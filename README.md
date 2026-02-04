<div align="center">

# Gemini Context

### Your entire codebase as Gemini's context

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-green.svg)](https://nodejs.org/)
[![Documentation](https://img.shields.io/badge/Documentation-📚-orange.svg)](docs/)
[![npm - core](https://img.shields.io/npm/v/@zilliz/gemini-context-core?label=%40zilliz%2Fgemini-context-core&logo=npm)](https://www.npmjs.com/package/@zilliz/gemini-context-core)
[![npm - mcp](https://img.shields.io/npm/v/@zilliz/gemini-context-mcp?label=%40zilliz%2Fgemini-context-mcp&logo=npm)](https://www.npmjs.com/package/@zilliz/gemini-context-mcp)
</div>

**Gemini Context** is an MCP plugin that adds semantic code search to Gemini CLI and other AI coding agents, giving them deep context from your entire codebase.

🧠 **Your Entire Codebase as Context**: Gemini Context uses semantic search to find all relevant code from millions of lines. No multi-round discovery needed. It brings results straight into the Gemini's context.

💰 **Cost-Effective for Large Codebases**: Instead of loading entire directories into Gemini for every request, which can be very expensive, Gemini Context efficiently stores your codebase in a local vector database and only uses related code in context to keep your costs manageable.

---

## 🚀 Demo

![img](https://lh7-rt.googleusercontent.com/docsz/AD_4nXf2uIf2c5zowp-iOMOqsefHbY_EwNGiutkxtNXcZVJ8RI6SN9DsCcsc3amXIhOZx9VcKFJQLSAqM-2pjU9zoGs1r8GCTUL3JIsLpLUGAm1VQd5F2o5vpEajx2qrc77iXhBu1zWj?key=qYdFquJrLcfXCUndY-YRBQ)

Model Context Protocol (MCP) allows you to integrate Gemini Context with your favorite AI coding assistants, e.g. Gemini CLI.

## Quick Start

### Prerequisites

- Node.js >= 20.0.0 and < 24.0.0
- Gemini API key

### Get Gemini API Key for embedding model

You need a Gemini API key for the embedding model. You can get one by signing up at [Google AI Studio](https://aistudio.google.com/).  

Copy your key and use it in the configuration examples below as `your-gemini-api-key`.

### Configure MCP for Gemini CLI

#### Configuration

Use the command line interface to add the Gemini Context MCP server to your preferred client. For example, with Gemini CLI:

```bash
# Add gemini-context to your gemini configuration
gemini mcp add gemini-context \
  -e GEMINI_API_KEY=your-gemini-api-key \
  -- npx @zilliz/gemini-context-mcp@latest
```

### Other MCP Client Configurations

<details>
<summary><strong>Gemini CLI (Manual)</strong></summary>

Gemini CLI requires manual configuration through a JSON file:

1. Create or edit the `~/.gemini/settings.json` file.
2. Add the following configuration:

```json
{
  "mcpServers": {
    "gemini-context": {
      "command": "npx",
      "args": ["@zilliz/gemini-context-mcp@latest"],
      "env": {
        "GEMINI_API_KEY": "your-gemini-api-key"
      }
    }
  }
}
```

3. Save the file and restart Gemini CLI to apply the changes.

</details>

<details>
<summary><strong>Cursor</strong></summary>

Go to: `Settings` -> `Cursor Settings` -> `MCP` -> `Add new global MCP server`

Pasting the following configuration into your Cursor `~/.cursor/mcp.json` file is the recommended approach.

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

---

### Usage in Your Codebase

1. **Open Gemini CLI**

   ```bash
   cd your-project-directory
   gemini
   ```

2. **Index your codebase**:

   ```
   Index this codebase
   ```

3. **Check indexing status**:

   ```
   Check the indexing status
   ```

4. **Start searching**:

   ```
   Find functions that handle user authentication
   ```

🎉 **That's it!** You now have semantic code search in Gemini CLI.

---

### Available Tools

#### 1. `index_codebase`
Index a codebase directory for hybrid search (FTS + dense vector).

#### 2. `search_code`
Search the indexed codebase using natural language queries with hybrid search (FTS + dense vector).

#### 3. `clear_index`
Clear the search index for a specific codebase.

#### 4. `get_indexing_status`
Get the current indexing status of a codebase.

---

## 🏗️ Architecture

![](assets/Architecture.png)

### 🔧 Implementation Details

- 🔍 **Hybrid Code Search**: Advanced hybrid search (FTS + dense vector) powered by LanceDB.
- 🧠 **Context-Aware**: Understand how different parts of your codebase relate.
- ⚡ **Incremental Indexing**: Efficiently re-index only changed files using Merkle trees.
- 🧩 **Intelligent Code Chunking**: Analyze code in Abstract Syntax Trees (AST) for chunking.
- 🗄️ **Embedded Storage**: Uses LanceDB for high-performance serverless vector search.

### Core Components

Gemini Context is a monorepo containing two main packages:

- **`@zilliz/gemini-context-core`**: Core indexing engine with Gemini embedding and LanceDB integration
- **`@zilliz/gemini-context-mcp`**: Model Context Protocol server for AI agent integration

### Supported Technologies

- **Embedding Providers**: [Gemini](https://gemini.google.com)
- **Vector Databases**: [LanceDB](https://lancedb.com)
- **Code Splitters**: AST-based splitter (with native fallback)
- **Languages**: TypeScript, JavaScript, Python, Java, C++, C#, Go, Rust, PHP, Ruby, Swift, Kotlin, Scala, Markdown
- **Development Tools**: Model Context Protocol

---

## 📦 direct use of Gemini Context

The `@zilliz/gemini-context-core` package provides the fundamental functionality for code indexing and semantic search.

```typescript
import { Context, LanceDBVectorDatabase, GeminiEmbedding } from '@zilliz/gemini-context-core';

// Initialize embedding provider
const embedding = new GeminiEmbedding({
    apiKey: process.env.GEMINI_API_KEY || 'your-gemini-api-key',
    model: 'gemini-embedding-001'
});

// Initialize vector database
const vectorDatabase = new LanceDBVectorDatabase({
    uri: process.env.LANCEDB_URI || './.lancedb'
});

// Create context instance
const context = new Context({
    embedding,
    vectorDatabase
});
```
