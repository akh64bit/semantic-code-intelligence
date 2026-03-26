import { VectorDocument, SearchOptions, VectorSearchResult, VectorDatabase, HybridSearchRequest, HybridSearchOptions, HybridSearchResult } from './types';
export interface LocalDatabaseConfig {
    uri: string;
}
/**
 * Local implementation of VectorDatabase using an embedded provider.
 * Terminology is kept generic to maintain provider anonymity.
 */
export declare class LocalVectorDatabase implements VectorDatabase {
    private config;
    private db;
    private initializationPromise;
    private initError;
    constructor(config: LocalDatabaseConfig);
    private initialize;
    private ensureInitialized;
    private getTableSchema;
    createCollection(collectionName: string, dimension: number, description?: string): Promise<void>;
    createHybridCollection(collectionName: string, dimension: number, description?: string): Promise<void>;
    dropCollection(collectionName: string): Promise<void>;
    hasCollection(collectionName: string): Promise<boolean>;
    listCollections(): Promise<string[]>;
    insert(collectionName: string, documents: VectorDocument[]): Promise<void>;
    insertHybrid(collectionName: string, documents: VectorDocument[]): Promise<void>;
    search(collectionName: string, queryVector: number[], options?: SearchOptions): Promise<VectorSearchResult[]>;
    hybridSearch(collectionName: string, searchRequests: HybridSearchRequest[], options?: HybridSearchOptions): Promise<HybridSearchResult[]>;
    delete(collectionName: string, ids: string[]): Promise<void>;
    query(collectionName: string, filter: string, outputFields: string[], limit?: number): Promise<Record<string, any>[]>;
    checkCollectionLimit(): Promise<boolean>;
}
//# sourceMappingURL=local-vdb.d.ts.map