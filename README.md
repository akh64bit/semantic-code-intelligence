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

## Installation as Gemini Extension

This project is optimized for use as a **Gemini CLI Extension**. This is the recommended way to use Gemini Code Intel as it automatically configures the MCP server and provides an integrated **Agent Skill**.

### 1. Build the Project
First, ensure you have built the latest version of the core and MCP packages:
```bash
pnpm install
pnpm build
```

### 2. Link the Extension
From the root of this repository, run:
```bash
gemini extensions link .
```

### 3. Usage
Once linked, the Gemini CLI will automatically have access to the `code-intel` skill. You can interact with it naturally:
- "Index the current directory"
- "Search the codebase for the JWT validation logic"
- "What is the indexing status for /path/to/project?"

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
