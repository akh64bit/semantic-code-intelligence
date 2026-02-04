# @zilliz/gemini-context-mcp

![](../../assets/gemini-context.png)
Model Context Protocol (MCP) integration for Gemini Context - A powerful MCP server that enables AI assistants and agents to index and search codebases using semantic search.

[![npm version](https://img.shields.io/npm/v/@zilliz/gemini-context-mcp.svg)](https://www.npmjs.com/package/@zilliz/gemini-context-mcp)
[![npm downloads](https://img.shields.io/npm/dm/@zilliz/gemini-context-mcp.svg)](https://www.npmjs.com/package/@zilliz/gemini-context-mcp)

> 📖 **New to Gemini Context?** Check out the [main project README](../../README.md) for an overview and setup instructions.

## 🚀 Use Gemini Context as MCP in Gemini CLI and others

Model Context Protocol (MCP) allows you to integrate Gemini Context with your favorite AI coding assistants, e.g. Gemini CLI.

## Quick Start

### Prerequisites

Before using the MCP server, make sure you have:

- Gemini API key
- Node.js 18 or later

> 💡 **Setup Help:** See the [main project setup guide](../../README.md#-quick-start) for detailed installation instructions.

### Prepare Environment Variables

#### Gemini Configuration

Gemini Context MCP is optimized for Google's Gemini embeddings.

> 📋 **Quick Reference**: For a complete list of environment variables and their descriptions, see the [Environment Variables Guide](../../docs/getting-started/environment-variables.md).

```bash
# Required: Your Gemini API key
GEMINI_API_KEY=your-gemini-api-key

# Optional: Specify embedding model (default: gemini-embedding-001)
EMBEDDING_MODEL=gemini-embedding-001

# Optional: Custom API base URL (for custom endpoints)
GEMINI_BASE_URL=https://generativelanguage.googleapis.com/v1beta
```

**Getting API Key:**
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Create a new API key

#### LanceDB Configuration (Optional)

By default, data is stored in `~/.gemini-context/lancedb`. You can override this using:

```bash
LANCEDB_URI=/path/to/your/storage
```

#### Embedding Batch Size

You can set the embedding batch size to optimize the performance. The default value is 100.

```bash
EMBEDDING_BATCH_SIZE=512
```

## Usage with MCP Clients

<details>
<summary><strong>Gemini CLI</strong></summary>

Use the command line interface to add the Gemini Context MCP server:

```bash
gemini mcp add gemini-context -e GEMINI_API_KEY=your-gemini-api-key -- npx @zilliz/gemini-context-mcp@latest
```

</details>

<details>
<summary><strong>Cursor</strong></summary>

Go to: `Settings` -> `Cursor Settings` -> `MCP` -> `Add new global MCP server`

```json
{
  "mcpServers": {
    "gemini-context": {
      "command": "npx",
      "args": ["-y", "@zilliz/gemini-context-mcp@latest"],
      "env": {
        "GEMINI_API_KEY": "your-gemini-api-key"
      }
    }
  }
}
```

</details>

## Features

- 🔌 **MCP Protocol Compliance**: Full compatibility with MCP-enabled AI assistants
- 🔍 **Hybrid Code Search**: Advanced hybrid search (FTS + dense vector) powered by LanceDB
- 📁 **Codebase Indexing**: Fast hybrid search across millions of lines of code
- 🔄 **Incremental Indexing**: Efficiently re-index only changed files using Merkle trees
- 🧩 **Intelligent Code Chunking**: AST-based code analysis for syntax-aware chunking
- 🗄️ **Serverless**: Embedded storage using LanceDB, no external database required

## Available Tools

### 1. `index_codebase`
Index a codebase directory for hybrid search.

### 2. `search_code`
Search the indexed codebase using natural language queries.

### 3. `clear_index`
Clear the search index for a specific codebase.

### 4. `get_indexing_status`
Get the current indexing status of a codebase.

## Contributing

This package is part of the Gemini Context monorepo. Please see:
- [Main Contributing Guide](../../CONTRIBUTING.md) - General contribution guidelines  
- [MCP Package Contributing](CONTRIBUTING.md) - Specific development guide for this package

## License
MIT - See [LICENSE](../../LICENSE) for details
