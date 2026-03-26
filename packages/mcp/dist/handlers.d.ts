import { Context } from "@gemini/gemini-code-intel-core";
import { SnapshotManager } from "./snapshot.js";
export declare class ToolHandlers {
    private context;
    private snapshotManager;
    private indexingStats;
    private currentWorkspace;
    constructor(context: Context, snapshotManager: SnapshotManager);
    /**
     * Sync indexed codebases from LanceDB tables
     * This method fetches all tables from the vector database,
     * gets the first document from each table to extract codebasePath from metadata,
     * and updates the snapshot with discovered codebases.
     *
     * Logic: Compare mcp-codebase-snapshot.json with LanceDB tables
     * - If local snapshot has extra directories (not in database), remove them
     * - If local snapshot is missing directories (exist in database), ignore them
     */
    private syncIndexedCodebases;
    handleIndexCodebase(args: any): Promise<{
        content: {
            type: string;
            text: string;
        }[];
        isError: boolean;
    } | {
        content: {
            type: string;
            text: string;
        }[];
        isError?: undefined;
    }>;
    private startBackgroundIndexing;
    handleSearchCode(args: any): Promise<{
        content: {
            type: string;
            text: string;
        }[];
        isError: boolean;
    } | {
        content: {
            type: string;
            text: string;
        }[];
        isError?: undefined;
    }>;
    handleClearIndex(args: any): Promise<{
        content: {
            type: string;
            text: string;
        }[];
        isError?: undefined;
    } | {
        content: {
            type: string;
            text: string;
        }[];
        isError: boolean;
    }>;
    handleGetIndexingStatus(args: any): Promise<{
        content: {
            type: string;
            text: string;
        }[];
        isError: boolean;
    } | {
        content: {
            type: string;
            text: string;
        }[];
        isError?: undefined;
    }>;
}
//# sourceMappingURL=handlers.d.ts.map