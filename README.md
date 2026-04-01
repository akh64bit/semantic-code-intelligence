# Gemini Code Intel

Gemini Code Intel is a Model Context Protocol (MCP) plugin that enables semantic code search for AI assistants. It provides deep context from an entire codebase by indexing it into a local vector database, allowing efficient and cost-effective retrieval of relevant code snippets.

## Modules

### Core (@gemini/gemini-code-intel-core)
The core indexing engine responsible for semantic search and codebase analysis.

- **Key Features**:
  - Multi-language support (TypeScript, JavaScript, Python, Java, C++, and more).
  - Hybrid search combining BM25 and vector search for improved accuracy.
  - AST-based intelligent code chunking to preserve syntax and context.
  - Incremental synchronization using Merkle trees for efficient re-indexing.
- **Configuration**:
  - ContextConfig: Configures embedding provider, vector database instance, splitting strategy, and file patterns.
- **API Reference**:
  - indexCodebase: Indexes an entire directory.
  - reindexByChange: Incrementally updates the index based on file changes.
  - semanticSearch: Performs semantic queries against the indexed code.
  - clearIndex: Removes existing index data.

### MCP (@gemini/gemini-code-intel-mcp)
Integrates the core engine with the Model Context Protocol for use with AI agents and clients.

- **Prerequisites**: Node.js (20+), Gemini API key.
- **Environment Variables**:
  - GEMINI_API_KEY: Required API key for embeddings.
  - EMBEDDING_MODEL: Optional model specification (default: gemini-embedding-001).
  - DB_URI: Optional local storage path (default: ~/.gemini-code-intel/db).
  - EMBEDDING_BATCH_SIZE: Optional batch size for performance tuning.
- **Available Tools**:
  - index_codebase: Index a codebase directory.
  - search_code: Search using natural language queries.
  - clear_index: Reset the search index.
  - get_indexing_status: Retrieve current indexing progress.

## Installation

### Recommended: Install as Gemini Extension
This is the recommended way to use Gemini Code Intel as it automatically configures the MCP server and provides an integrated **Agent Skill**.

#### Direct Installation (Pre-built)
You can install the extension directly from the repository. The build artifacts (`dist` folders) are included, so you don't need to manually build the TypeScript code. However, **you must still install dependencies** because this extension relies on native system bindings (like `tree-sitter` and `vectordb`).

1. Install the extension using the CLI:
   ```bash
   gemini extensions install https://github.com/akh64bit/semantic-code-intelligence
   ```
2. Navigate to the installed extension directory (usually `~/.gemini/extensions/semantic-code-intelligence` or similar).
3. Install the dependencies to fetch the required native binaries for your OS:
   ```bash
   pnpm install
   ```

#### Manual Installation (From Source)
If you are working from the source code, follow these steps:
1. **Build the Project**:
   ```bash
   pnpm install
   pnpm build
   ```
2. **Link the Extension**:
   ```bash
   gemini extensions link .
   ```

### Troubleshooting "Disconnected" Status

If the extension shows as **Disconnected** 🔴 after installation, it's usually due to missing configuration or native dependencies.

#### 1. Configure your API Key
The MCP server requires a Gemini API key. You can set it using the extension configuration:
```bash
# This will prompt you to enter the key
gemini extensions config gemini-code-intel GEMINI_API_KEY
```

#### 2. Install Native Dependencies
This extension uses native binaries for high-performance code parsing and vector search. If they weren't installed correctly:
1. Navigate to the extension directory: `~/.gemini/extensions/gemini-code-intel`
2. Run `pnpm install`
3. If using `pnpm`, you may need to allow the build scripts for native modules:
   ```bash
   pnpm approve-builds
   pnpm install
   ```

#### 3. Check logs
If it's still disconnected, check the extension logs for detailed error messages.

## Manual MCP Setup (Optional)
If you prefer to configure the MCP server manually in your `settings.json`:
1. Build the project as shown above.
2. Add the following to your `mcpServers` section:
```json
"gemini-code-intel": {
  "command": "node",
  "args": ["/path/to/gemini-code-intel/packages/mcp/dist/index.js"],
  "env": {
    "GEMINI_API_KEY": "your-api-key",
    "DB_URI": "~/.gemini-code-intel/db"
  }
}
```

## Technical Overview

- **Storage**: Uses high-performance, serverless embedded vector storage.
- **Embeddings**: Optimized for Google's Gemini embedding models.
- **Languages**: Supports TypeScript, JavaScript, Python, Java, C++, C#, Go, Rust, PHP, Ruby, Swift, Kotlin, Scala, and Markdown.
