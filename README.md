# Gemini Context

Gemini Context is a Model Context Protocol (MCP) plugin that enables semantic code search for AI assistants. It provides deep context from an entire codebase by indexing it into a local vector database, allowing efficient and cost-effective retrieval of relevant code snippets.

## Modules

### Core (@zilliz/gemini-context-core)
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

### MCP (@zilliz/gemini-context-mcp)
Integrates the core engine with the Model Context Protocol for use with AI agents and clients.

- **Prerequisites**: Node.js (18+), Gemini API key.
- **Environment Variables**:
  - GEMINI_API_KEY: Required API key for embeddings.
  - EMBEDDING_MODEL: Optional model specification (default: gemini-embedding-001).
  - LANCEDB_URI: Optional local storage path (default: ~/.gemini-context/lancedb).
  - EMBEDDING_BATCH_SIZE: Optional batch size for performance tuning.
- **Available Tools**:
  - index_codebase: Index a codebase directory.
  - search_code: Search using natural language queries.
  - clear_index: Reset the search index.
  - get_indexing_status: Retrieve current indexing progress.

## Technical Overview

- **Storage**: Uses LanceDB for high-performance, serverless embedded vector storage.
- **Embeddings**: Optimized for Google's Gemini embedding models.
- **Languages**: Supports TypeScript, JavaScript, Python, Java, C++, C#, Go, Rust, PHP, Ruby, Swift, Kotlin, Scala, and Markdown.
