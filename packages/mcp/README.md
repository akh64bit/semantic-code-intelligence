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
- Milvus vector database (local or cloud)

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

#### Get a free vector database on Zilliz Cloud

Gemini Context needs a vector database. You can [sign up](https://cloud.zilliz.com/signup?utm_source=github&utm_medium=referral&utm_campaign=2507-codecontext-readme) on Zilliz Cloud to get an API key.

```bash
MILVUS_TOKEN=your-zilliz-cloud-api-key
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
gemini mcp add gemini-context -e GEMINI_API_KEY=your-gemini-api-key -e MILVUS_TOKEN=your-zilliz-cloud-api-key -- npx @zilliz/gemini-context-mcp@latest
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
        "GEMINI_API_KEY": "your-gemini-api-key",
        "MILVUS_TOKEN": "your-zilliz-cloud-api-key"
      }
    }
  }
}
```

</details>

## Features

- 🔌 **MCP Protocol Compliance**: Full compatibility with MCP-enabled AI assistants
- 🔍 **Hybrid Code Search**: Advanced hybrid search (BM25 + dense vector) powered by Milvus
- 📁 **Codebase Indexing**: Fast hybrid search across millions of lines of code
- 🔄 **Incremental Indexing**: Efficiently re-index only changed files using Merkle trees
- 🧩 **Intelligent Code Chunking**: AST-based code analysis for syntax-aware chunking
- 🗄️ **Scalable**: Integrates with Zilliz Cloud for scalable vector search

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
