import * as lancedb from '@lancedb/lancedb';
import { Schema, Field, Utf8, Int64, Float32, FixedSizeList } from 'apache-arrow';
import {
    VectorDocument,
    SearchOptions,
    VectorSearchResult,
    VectorDatabase,
    HybridSearchRequest,
    HybridSearchOptions,
    HybridSearchResult,
} from './types';
import * as path from 'path';
import * as fs from 'fs-extra';

export interface LanceDBConfig {
    uri: string;
}

export class LanceDBVectorDatabase implements VectorDatabase {
    private config: LanceDBConfig;
    private db: lancedb.Connection | null = null;
    private initializationPromise: Promise<void>;
    private initError: Error | null = null;

    constructor(config: LanceDBConfig) {
        this.config = config;
        this.initializationPromise = this.initialize();
    }

    private async initialize(): Promise<void> {
        try {
            const storageDir = path.resolve(this.config.uri);
            await fs.ensureDir(storageDir);
            this.db = await lancedb.connect(storageDir);
            console.log(`[LanceDB] 🚀 Connected to LanceDB at: ${storageDir}`);
        } catch (error: any) {
            this.initError = error;
            console.error(`[LanceDB] ❌ Failed to initialize LanceDB: ${error.message}`);
        }
    }

    private async ensureInitialized(): Promise<void> {
        await this.initializationPromise;
        if (this.initError) {
            throw new Error(`LanceDB initialization failed: ${this.initError.message}`);
        }
        if (!this.db) {
            throw new Error('LanceDB connection is not established.');
        }
    }

    private getTableSchema(dimension: number): Schema {
        return new Schema([
            new Field('id', new Utf8(), false),
            new Field('vector', new FixedSizeList(dimension, new Field('item', new Float32(), true)), false),
            new Field('content', new Utf8(), false),
            new Field('relativePath', new Utf8(), false),
            new Field('startLine', new Int64(), false),
            new Field('endLine', new Int64(), false),
            new Field('fileExtension', new Utf8(), false),
            new Field('metadata', new Utf8(), false),
        ]);
    }

    async createCollection(collectionName: string, dimension: number, description?: string): Promise<void> {
        await this.ensureInitialized();
        if (!this.db) return;

        const schema = this.getTableSchema(dimension);

        try {
            await this.db.createEmptyTable(collectionName, schema, { existOk: true });
            console.log(`[LanceDB] ✅ Created table: ${collectionName}`);
        } catch (error: any) {
            console.error(`[LanceDB] ❌ Failed to create table ${collectionName}:`, error.message);
            throw error;
        }
    }
    async createHybridCollection(collectionName: string, dimension: number, description?: string): Promise<void> {
        await this.createCollection(collectionName, dimension, description);
        await this.ensureInitialized();

        const table = await this.db!.openTable(collectionName);
        // LanceDB enables FTS via indices
        console.log(`[LanceDB] 🔧 Creating FTS index for collection: ${collectionName}`);
        await table.createIndex('content', {
            config: lancedb.Index.fts(),
        });
    }

    async dropCollection(collectionName: string): Promise<void> {
        await this.ensureInitialized();
        await this.db!.dropTable(collectionName);
    }

    async hasCollection(collectionName: string): Promise<boolean> {
        await this.ensureInitialized();
        const tableNames = await this.db!.tableNames();
        return tableNames.includes(collectionName);
    }

    async listCollections(): Promise<string[]> {
        await this.ensureInitialized();
        return await this.db!.tableNames();
    }

    async insert(collectionName: string, documents: VectorDocument[]): Promise<void> {
        await this.ensureInitialized();
        const table = await this.db!.openTable(collectionName);

        const data = documents.map(doc => ({
            id: doc.id,
            vector: doc.vector,
            content: doc.content,
            relativePath: doc.relativePath,
            startLine: BigInt(doc.startLine),
            endLine: BigInt(doc.endLine),
            fileExtension: doc.fileExtension,
            metadata: JSON.stringify(doc.metadata),
        }));

        await table.add(data);
    }

    async insertHybrid(collectionName: string, documents: VectorDocument[]): Promise<void> {
        // In LanceDB, hybrid insertion is same as normal insertion.
        // FTS index handles the content field.
        await this.insert(collectionName, documents);
    }

    async search(collectionName: string, queryVector: number[], options?: SearchOptions): Promise<VectorSearchResult[]> {
        await this.ensureInitialized();
        const table = await this.db!.openTable(collectionName);

        let query = table.vectorSearch(queryVector)
            .distanceType('cosine')
            .limit(options?.topK || 10);

        if (options?.filterExpr) {
            // Map filter to SQL
            // e.g. 'id in ["1", "2"]' or 'fileExtension == ".ts"'
            // LanceDB uses standard SQL
            query = query.where(options.filterExpr);
        }

        const results = await query.toArray();

        return results.map((result: any) => ({
            document: {
                id: result.id,
                vector: Array.from(result.vector),
                content: result.content,
                relativePath: result.relativePath,
                startLine: Number(result.startLine),
                endLine: Number(result.endLine),
                fileExtension: result.fileExtension,
                metadata: JSON.parse(result.metadata || '{}'),
            },
            score: result._distance !== undefined ? 1 - result._distance : (result._score || 0),
        }));
    }

    async hybridSearch(collectionName: string, searchRequests: HybridSearchRequest[], options?: HybridSearchOptions): Promise<HybridSearchResult[]> {
        await this.ensureInitialized();
        const table = await this.db!.openTable(collectionName);

        // searchRequests[0] is usually dense, searchRequests[1] is usually text (for FTS)
        // If we have a text query, we use it.
        const denseRequest = searchRequests.find(r => Array.isArray(r.data));
        const textRequest = searchRequests.find(r => typeof r.data === 'string');

        let queryBuilder: any = table.query();

        if (denseRequest) {
            queryBuilder = table.vectorSearch(denseRequest.data as number[]);
        }

        if (textRequest) {
            // Note: LanceDB hybrid search (Vector + FTS)
            queryBuilder = queryBuilder.fullTextSearch(textRequest.data as string);
        }

        const limit = options?.limit || denseRequest?.limit || 10;
        queryBuilder = queryBuilder.limit(limit);

        if (options?.filterExpr) {
            queryBuilder = queryBuilder.where(options.filterExpr);
        }

        const results = await queryBuilder.toArray();

        return results.map((result: any) => ({
            document: {
                id: result.id,
                content: result.content,
                vector: result.vector ? Array.from(result.vector) : [],
                relativePath: result.relativePath,
                startLine: Number(result.startLine),
                endLine: Number(result.endLine),
                fileExtension: result.fileExtension,
                metadata: JSON.parse(result.metadata || '{}'),
            },
            score: result._distance !== undefined ? 1 - result._distance : (result._score || 0),
        }));
    }

    async delete(collectionName: string, ids: string[]): Promise<void> {
        await this.ensureInitialized();
        const table = await this.db!.openTable(collectionName);
        const filter = `id IN (${ids.map(id => `'${id}'`).join(',')})`;
        await table.delete(filter);
    }

    async query(collectionName: string, filter: string, outputFields: string[], limit?: number): Promise<Record<string, any>[]> {
        await this.ensureInitialized();
        const table = await this.db!.openTable(collectionName);

        let queryBuilder = table.query().select(outputFields);

        if (filter && filter.trim() !== '') {
            queryBuilder = queryBuilder.where(filter);
        }

        if (limit) {
            queryBuilder = queryBuilder.limit(limit);
        }

        const results = await queryBuilder.toArray();

        // Handle BigInt conversion for compatibility
        return results.map((row: any) => {
            const mapped: Record<string, any> = {};
            for (const key of Object.keys(row)) {
                let val = row[key];
                if (typeof val === 'bigint') {
                    val = Number(val);
                }
                mapped[key] = val;
            }
            return mapped;
        });
    }

    async checkCollectionLimit(): Promise<boolean> {
        // LanceDB doesn't have a practical collection limit like Zilliz free tier
        return true;
    }
}
