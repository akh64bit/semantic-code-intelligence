export interface SearchQuery {
    term: string;
    includeContent?: boolean;
    limit?: number;
}

export interface SemanticSearchResult {
    content: string;
    relativePath: string;
    startLine: number;
    endLine: number;
    language: string;
    score: number;
}

export interface IndexingResult {
    indexedFiles: number;
    totalChunks: number;
    status: 'completed' | 'limit_reached';
    totalElapsedTimeMs: number;
    languageBreakdown: Record<string, number>;
    totalCharacters: number;
    totalTokens: number;
    averageChunkSize: number;
    chunkSizeDistribution: Record<string, number>;
}
