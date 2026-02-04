import { envManager } from "@zilliz/gemini-context-core";
import * as path from "path";
import * as os from "os";

export interface ContextMcpConfig {
    name: string;
    version: string;
    // Gemini configuration
    embeddingModel: string;
    geminiApiKey?: string;
    geminiBaseUrl?: string;
    // Vector database configuration
    lancedbUri?: string;
}

// Legacy format (v1) - for backward compatibility
export interface CodebaseSnapshotV1 {
    indexedCodebases: string[];
    indexingCodebases: string[] | Record<string, number>;  // Array (legacy) or Map of codebase path to progress percentage
    lastUpdated: string;
}

// New format (v2) - structured with codebase information

// Base interface for common fields
interface CodebaseInfoBase {
    lastUpdated: string;
}

// Indexing state - when indexing is in progress
export interface CodebaseInfoIndexing extends CodebaseInfoBase {
    status: 'indexing';
    indexingPercentage: number;  // Current progress percentage
}

// Indexed state - when indexing completed successfully
export interface CodebaseInfoIndexed extends CodebaseInfoBase {
    status: 'indexed';
    indexedFiles: number;        // Number of files indexed
    totalChunks: number;         // Total number of chunks generated
    indexStatus: 'completed' | 'limit_reached';  // Status from indexing result
}

// Index failed state - when indexing failed
export interface CodebaseInfoIndexFailed extends CodebaseInfoBase {
    status: 'indexfailed';
    errorMessage: string;        // Error message from the failure
    lastAttemptedPercentage?: number;  // Progress when failure occurred
}

// Union type for all codebase information states
export type CodebaseInfo = CodebaseInfoIndexing | CodebaseInfoIndexed | CodebaseInfoIndexFailed;

export interface CodebaseSnapshotV2 {
    formatVersion: 'v2';
    codebases: Record<string, CodebaseInfo>;  // codebasePath -> CodebaseInfo
    lastUpdated: string;
}

// Union type for all supported formats
export type CodebaseSnapshot = CodebaseSnapshotV1 | CodebaseSnapshotV2;

// Helper function to get default model for Gemini
export function getDefaultModel(): string {
    return 'gemini-embedding-001';
}

// Helper function to get embedding model with environment variable priority
export function getEmbeddingModel(): string {
    const selectedModel = envManager.get('EMBEDDING_MODEL') || getDefaultModel();
    console.log(`[DEBUG] 🎯 Gemini model selection: EMBEDDING_MODEL=${envManager.get('EMBEDDING_MODEL') || 'NOT SET'}, selected=${selectedModel}`);
    return selectedModel;
}

// Helper function to resolve LanceDB URI and expand ~
function resolveLancedbUri(): string {
    let uri = envManager.get('LANCEDB_URI');
    if (!uri) {
        return path.join(os.homedir(), '.gemini-context', 'lancedb');
    }

    if (uri.startsWith('~')) {
        return path.join(os.homedir(), uri.slice(1));
    }

    return path.resolve(uri);
}

export function createMcpConfig(): ContextMcpConfig {
    // Debug: Print environment variables related to Context
    console.log(`[DEBUG] 🔍 Environment Variables Debug:`);
    console.log(`[DEBUG]   EMBEDDING_MODEL: ${envManager.get('EMBEDDING_MODEL') || 'NOT SET'}`);
    console.log(`[DEBUG]   GEMINI_API_KEY: ${envManager.get('GEMINI_API_KEY') ? 'SET (length: ' + envManager.get('GEMINI_API_KEY')!.length + ')' : 'NOT SET'}`);
    console.log(`[DEBUG]   LANCEDB_URI: ${envManager.get('LANCEDB_URI') || 'NOT SET'}`);
    console.log(`[DEBUG]   NODE_ENV: ${envManager.get('NODE_ENV') || 'NOT SET'}`);

    const config: ContextMcpConfig = {
        name: envManager.get('MCP_SERVER_NAME') || "Gemini Context MCP Server",
        version: envManager.get('MCP_SERVER_VERSION') || "1.0.0",
        embeddingModel: getEmbeddingModel(),
        geminiApiKey: envManager.get('GEMINI_API_KEY'),
        geminiBaseUrl: envManager.get('GEMINI_BASE_URL'),
        // Vector database configuration
        lancedbUri: resolveLancedbUri()
    };

    return config;
}

export function logConfigurationSummary(config: ContextMcpConfig): void {
    // Log configuration summary before starting server
    console.log(`[MCP] 🚀 Starting Gemini Context MCP Server`);
    console.log(`[MCP] Configuration Summary:`);
    console.log(`[MCP]   Server: ${config.name} v${config.version}`);
    console.log(`[MCP]   Embedding Model: ${config.embeddingModel}`);
    console.log(`[MCP]   LanceDB URI: ${config.lancedbUri}`);

    // Log Gemini configuration without exposing sensitive data
    console.log(`[MCP]   Gemini API Key: ${config.geminiApiKey ? '✅ Configured' : '❌ Missing'}`);
    if (config.geminiBaseUrl) {
        console.log(`[MCP]   Gemini Base URL: ${config.geminiBaseUrl}`);
    }

    console.log(`[MCP] 🔧 Initializing server components...`);
}

export function showHelpMessage(): void {
    console.log(`
Gemini Context MCP Server

Usage: npx @zilliz/gemini-context-mcp@latest [options]

Options:
  --help, -h                          Show this help message

Environment Variables:
  MCP_SERVER_NAME         Server name
  MCP_SERVER_VERSION      Server version
  
  Embedding Configuration:
  EMBEDDING_MODEL         Embedding model name (default: gemini-embedding-001)
  
  Gemini API Keys:
  GEMINI_API_KEY          Google AI API key (required)
  GEMINI_BASE_URL         Gemini API base URL (optional, for custom endpoints)
  
  Vector Database Configuration:
  LANCEDB_URI             LanceDB storage URI (default: ~/.gemini-context/lancedb)

Examples:
  # Start MCP server with Gemini and default LanceDB storage
  GEMINI_API_KEY=xxx npx @zilliz/gemini-context-mcp@latest
  
  # Start MCP server with Gemini and specific LanceDB URI
  GEMINI_API_KEY=xxx LANCEDB_URI=/tmp/lancedb npx @zilliz/gemini-context-mcp@latest
        `);
} 
