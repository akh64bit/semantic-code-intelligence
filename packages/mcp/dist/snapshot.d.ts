import { CodebaseInfo } from "./config.js";
export declare class SnapshotManager {
    private snapshotFilePath;
    private indexedCodebases;
    private indexingCodebases;
    private codebaseFileCount;
    private codebaseInfoMap;
    constructor();
    /**
     * Check if snapshot is v2 format
     */
    private isV2Format;
    /**
     * Convert v1 format to internal state
     */
    private loadV1Format;
    /**
 * Convert v2 format to internal state
 */
    private loadV2Format;
    getIndexedCodebases(): string[];
    getIndexingCodebases(): string[];
    /**
     * @deprecated Use getCodebaseInfo() for individual codebases or iterate through codebases for v2 format support
     */
    getIndexingCodebasesWithProgress(): Map<string, number>;
    getIndexingProgress(codebasePath: string): number | undefined;
    /**
     * @deprecated Use setCodebaseIndexing() instead for v2 format support
     */
    addIndexingCodebase(codebasePath: string, progress?: number): void;
    /**
     * @deprecated Use setCodebaseIndexing() instead for v2 format support
     */
    updateIndexingProgress(codebasePath: string, progress: number): void;
    /**
     * @deprecated Use removeCodebaseCompletely() or state-specific methods instead for v2 format support
     */
    removeIndexingCodebase(codebasePath: string): void;
    /**
     * @deprecated Use setCodebaseIndexed() instead for v2 format support
     */
    addIndexedCodebase(codebasePath: string, fileCount?: number): void;
    /**
     * @deprecated Use removeCodebaseCompletely() or state-specific methods instead for v2 format support
     */
    removeIndexedCodebase(codebasePath: string): void;
    /**
     * @deprecated Use setCodebaseIndexed() instead for v2 format support
     */
    moveFromIndexingToIndexed(codebasePath: string, fileCount?: number): void;
    /**
     * @deprecated Use getCodebaseInfo() and check indexedFiles property instead for v2 format support
     */
    getIndexedFileCount(codebasePath: string): number | undefined;
    /**
     * @deprecated Use setCodebaseIndexed() with complete stats instead for v2 format support
     */
    setIndexedFileCount(codebasePath: string, fileCount: number): void;
    /**
     * Set codebase to indexing status
     */
    setCodebaseIndexing(codebasePath: string, progress?: number): void;
    /**
     * Set codebase to indexed status with complete statistics
     */
    setCodebaseIndexed(codebasePath: string, stats: {
        indexedFiles: number;
        totalChunks: number;
        status: 'completed' | 'limit_reached';
        totalElapsedTimeMs?: number;
        languageBreakdown?: Record<string, number>;
        totalCharacters?: number;
        totalTokens?: number;
        averageChunkSize?: number;
        chunkSizeDistribution?: Record<string, number>;
    }): void;
    /**
     * Set codebase to failed status
     */
    setCodebaseIndexFailed(codebasePath: string, errorMessage: string, lastAttemptedPercentage?: number): void;
    /**
     * Get codebase status
     */
    getCodebaseStatus(codebasePath: string): 'indexed' | 'indexing' | 'indexfailed' | 'not_found';
    /**
     * Get complete codebase information
     */
    getCodebaseInfo(codebasePath: string): CodebaseInfo | undefined;
    /**
     * Get all failed codebases
     */
    getFailedCodebases(): string[];
    /**
     * Completely remove a codebase from all tracking (for clear_index operation)
     */
    removeCodebaseCompletely(codebasePath: string): void;
    loadCodebaseSnapshot(): void;
    saveCodebaseSnapshot(): void;
}
//# sourceMappingURL=snapshot.d.ts.map