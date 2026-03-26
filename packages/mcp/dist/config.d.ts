export interface ContextMcpConfig {
    name: string;
    version: string;
    embeddingModel: string;
    geminiApiKey?: string;
    geminiBaseUrl?: string;
    dbUri?: string;
}
export interface CodebaseSnapshotV1 {
    indexedCodebases: string[];
    indexingCodebases: string[] | Record<string, number>;
    lastUpdated: string;
}
interface CodebaseInfoBase {
    lastUpdated: string;
}
export interface CodebaseInfoIndexing extends CodebaseInfoBase {
    status: 'indexing';
    indexingPercentage: number;
}
export interface CodebaseInfoIndexed extends CodebaseInfoBase {
    status: 'indexed';
    indexedFiles: number;
    totalChunks: number;
    indexStatus: 'completed' | 'limit_reached';
    performance?: {
        totalElapsedTimeMs: number;
    };
    metadata?: {
        languageBreakdown: Record<string, number>;
        totalCharacters: number;
        totalTokens: number;
        chunkingTelemetry: {
            averageChunkSize: number;
            chunkSizeDistribution: Record<string, number>;
        };
    };
}
export interface CodebaseInfoIndexFailed extends CodebaseInfoBase {
    status: 'indexfailed';
    errorMessage: string;
    lastAttemptedPercentage?: number;
}
export type CodebaseInfo = CodebaseInfoIndexing | CodebaseInfoIndexed | CodebaseInfoIndexFailed;
export interface CodebaseSnapshotV2 {
    formatVersion: 'v2';
    codebases: Record<string, CodebaseInfo>;
    lastUpdated: string;
}
export type CodebaseSnapshot = CodebaseSnapshotV1 | CodebaseSnapshotV2;
export declare function getDefaultModel(): string;
export declare function getEmbeddingModel(): string;
export declare function createMcpConfig(): ContextMcpConfig;
export declare function logConfigurationSummary(config: ContextMcpConfig): void;
export declare function showHelpMessage(): void;
export {};
//# sourceMappingURL=config.d.ts.map