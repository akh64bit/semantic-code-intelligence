# @zilliz/gemini-context-core

![](../../assets/gemini-context.png)

The core indexing engine for Gemini Context - a powerful tool for semantic search and analysis of codebases using Gemini embeddings and LanceDB.

[![npm version](https://img.shields.io/npm/v/@zilliz/gemini-context-core.svg)](https://www.npmjs.com/package/@zilliz/gemini-context-core)
[![npm downloads](https://img.shields.io/npm/dm/@zilliz/gemini-context-core.svg)](https://www.npmjs.com/package/@zilliz/gemini-context-core)

> 📖 **New to Gemini Context?** Check out the [main project README](../../README.md) for an overview and quick start guide.

## Installation

```bash
npm install @zilliz/gemini-context-core
```

### Prepare Environment Variables

#### Gemini API Key
Get your API key from [Google AI Studio](https://aistudio.google.com/).
```bash
GEMINI_API_KEY=your-gemini-api-key
```

#### LanceDB Configuration (Optional)
Gemini Context uses LanceDB for embedded vector storage. By default, data is stored in `~/.gemini-context/lancedb`. You can override this using the `LANCEDB_URI` environment variable.

## Quick Start

```typescript
import { 
  Context, 
  GeminiEmbedding, 
  LanceDBVectorDatabase 
} from '@zilliz/gemini-context-core';

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

// Index a codebase
const stats = await context.indexCodebase('./my-project', (progress) => {
  console.log(`${progress.phase} - ${progress.percentage}%`);
});

console.log(`Indexed ${stats.indexedFiles} files with ${stats.totalChunks} chunks`);

// Search the codebase
const results = await context.semanticSearch(
  './my-project',
  'function that handles user authentication',
  5
);
```

## Features

- **Multi-language Support**: Index TypeScript, JavaScript, Python, Java, C++, and many more.
- **Semantic Search**: Find code using natural language queries powered by Gemini embeddings.
- **Hybrid Search**: Combined BM25 and vector search for superior accuracy.
- **Smart Chunking**: AST-based code splitting that preserves context and structure.
- **Incremental Synchronization**: Efficient change detection using Merkle trees.

## Configuration

### ContextConfig

```typescript
interface ContextConfig {
  embedding?: Embedding;           // Embedding provider
  vectorDatabase?: VectorDatabase; // Vector database instance (required)
  codeSplitter?: Splitter;        // Code splitting strategy
  supportedExtensions?: string[]; // File extensions to index
  ignorePatterns?: string[];      // Patterns to ignore
}
```

## API Reference

### Context

#### Methods
- `indexCodebase(path, progressCallback?, forceReindex?)` - Index an entire codebase
- `reindexByChange(path, progressCallback?)` - Incrementally re-index only changed files
- `semanticSearch(path, query, topK?, threshold?, filterExpr?)` - Search indexed code semantically
- `hasIndex(path)` - Check if codebase is already indexed
- `clearIndex(path, progressCallback?)` - Remove index for a codebase
- `updateIgnorePatterns(patterns)` - Update ignore patterns
- `updateEmbedding(embedding)` - Switch embedding provider
- `updateVectorDatabase(vectorDB)` - Switch vector database
- `updateSplitter(splitter)` - Switch code splitter

## License
MIT - See [LICENSE](../../LICENSE) for details
