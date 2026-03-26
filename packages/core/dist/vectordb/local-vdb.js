"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalVectorDatabase = void 0;
const lancedb = __importStar(require("@lancedb/lancedb"));
const apache_arrow_1 = require("apache-arrow");
const path = __importStar(require("path"));
const fs = __importStar(require("fs-extra"));
/**
 * Local implementation of VectorDatabase using an embedded provider.
 * Terminology is kept generic to maintain provider anonymity.
 */
class LocalVectorDatabase {
    constructor(config) {
        this.db = null;
        this.initError = null;
        this.config = config;
        this.initializationPromise = this.initialize();
    }
    async initialize() {
        try {
            const storageDir = path.resolve(this.config.uri);
            await fs.ensureDir(storageDir);
            this.db = await lancedb.connect(storageDir);
            console.log(`[VDB] 🚀 Connected to database at: ${storageDir}`);
        }
        catch (error) {
            this.initError = error;
            console.error(`[VDB] ❌ Failed to initialize database: ${error.message}`);
        }
    }
    async ensureInitialized() {
        await this.initializationPromise;
        if (this.initError) {
            throw new Error(`Database initialization failed: ${this.initError.message}`);
        }
        if (!this.db) {
            throw new Error('Database connection is not established.');
        }
    }
    getTableSchema(dimension) {
        return new apache_arrow_1.Schema([
            new apache_arrow_1.Field('id', new apache_arrow_1.Utf8(), false),
            new apache_arrow_1.Field('vector', new apache_arrow_1.FixedSizeList(dimension, new apache_arrow_1.Field('item', new apache_arrow_1.Float32(), true)), false),
            new apache_arrow_1.Field('content', new apache_arrow_1.Utf8(), false),
            new apache_arrow_1.Field('relativePath', new apache_arrow_1.Utf8(), false),
            new apache_arrow_1.Field('startLine', new apache_arrow_1.Int64(), false),
            new apache_arrow_1.Field('endLine', new apache_arrow_1.Int64(), false),
            new apache_arrow_1.Field('fileExtension', new apache_arrow_1.Utf8(), false),
            new apache_arrow_1.Field('metadata', new apache_arrow_1.Utf8(), false),
        ]);
    }
    async createCollection(collectionName, dimension, description) {
        await this.ensureInitialized();
        if (!this.db)
            return;
        const schema = this.getTableSchema(dimension);
        try {
            await this.db.createEmptyTable(collectionName, schema, { existOk: true });
            console.log(`[VDB] ✅ Created table: ${collectionName}`);
        }
        catch (error) {
            console.error(`[VDB] ❌ Failed to create table ${collectionName}:`, error.message);
            throw error;
        }
    }
    async createHybridCollection(collectionName, dimension, description) {
        await this.createCollection(collectionName, dimension, description);
        await this.ensureInitialized();
        const table = await this.db.openTable(collectionName);
        // Enable full-text search via indices
        console.log(`[VDB] 🔧 Creating FTS index for collection: ${collectionName}`);
        await table.createIndex('content', {
            config: lancedb.Index.fts(),
        });
    }
    async dropCollection(collectionName) {
        await this.ensureInitialized();
        await this.db.dropTable(collectionName);
    }
    async hasCollection(collectionName) {
        await this.ensureInitialized();
        const tableNames = await this.db.tableNames();
        return tableNames.includes(collectionName);
    }
    async listCollections() {
        await this.ensureInitialized();
        return await this.db.tableNames();
    }
    async insert(collectionName, documents) {
        await this.ensureInitialized();
        const table = await this.db.openTable(collectionName);
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
    async insertHybrid(collectionName, documents) {
        // Hybrid insertion uses the same path as normal insertion,
        // as the FTS index automatically handles the content field.
        await this.insert(collectionName, documents);
    }
    async search(collectionName, queryVector, options) {
        await this.ensureInitialized();
        const table = await this.db.openTable(collectionName);
        let query = table.vectorSearch(queryVector)
            .distanceType('cosine')
            .limit(options?.topK || 10);
        if (options?.filterExpr) {
            // Map filter to standard SQL expressions
            query = query.where(options.filterExpr);
        }
        const results = await query.toArray();
        return results.map((result) => ({
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
    async hybridSearch(collectionName, searchRequests, options) {
        await this.ensureInitialized();
        const table = await this.db.openTable(collectionName);
        // searchRequests[0] is typically dense, searchRequests[1] is typically text (for FTS)
        const denseRequest = searchRequests.find(r => Array.isArray(r.data));
        const textRequest = searchRequests.find(r => typeof r.data === 'string');
        let queryBuilder = table.query();
        if (denseRequest) {
            queryBuilder = table.vectorSearch(denseRequest.data);
        }
        if (textRequest) {
            // Execute hybrid search (Vector + FTS)
            queryBuilder = queryBuilder.fullTextSearch(textRequest.data);
        }
        const limit = options?.limit || denseRequest?.limit || 10;
        queryBuilder = queryBuilder.limit(limit);
        if (options?.filterExpr) {
            queryBuilder = queryBuilder.where(options.filterExpr);
        }
        const results = await queryBuilder.toArray();
        return results.map((result) => ({
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
    async delete(collectionName, ids) {
        await this.ensureInitialized();
        const table = await this.db.openTable(collectionName);
        const filter = `id IN (${ids.map(id => `'${id}'`).join(',')})`;
        await table.delete(filter);
    }
    async query(collectionName, filter, outputFields, limit) {
        await this.ensureInitialized();
        const table = await this.db.openTable(collectionName);
        let queryBuilder = table.query().select(outputFields);
        if (filter && filter.trim() !== '') {
            queryBuilder = queryBuilder.where(filter);
        }
        if (limit) {
            queryBuilder = queryBuilder.limit(limit);
        }
        const results = await queryBuilder.toArray();
        // Handle BigInt conversion for compatibility
        return results.map((row) => {
            const mapped = {};
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
    async checkCollectionLimit() {
        // Local database implementations typically do not have practical collection limits
        return true;
    }
}
exports.LocalVectorDatabase = LocalVectorDatabase;
//# sourceMappingURL=local-vdb.js.map