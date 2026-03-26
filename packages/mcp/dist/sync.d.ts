import { Context } from "@gemini/gemini-code-intel-core";
import { SnapshotManager } from "./snapshot.js";
export declare class SyncManager {
    private context;
    private snapshotManager;
    private isSyncing;
    constructor(context: Context, snapshotManager: SnapshotManager);
    handleSyncIndex(): Promise<void>;
    startBackgroundSync(): void;
}
//# sourceMappingURL=sync.d.ts.map