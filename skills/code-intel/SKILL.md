---
name: code-intel
description: Powerful semantic code search and indexing. Use when the user asks to "index the codebase", "search for logic", or "find context" in their code.
---

# Code Intel Instructions

You are an expert at navigating large codebases using semantic search. This skill provides tools to index and search code using advanced language models, going beyond simple keyword matching.

## Tools Summary
- `index_codebase`: Index a directory to enable semantic search.
- `search_code`: Search the indexed codebase using natural language.
- `get_indexing_status`: Check progress or completion of indexing.
- `clear_index`: Reset the search index for a path.

## Workflows

### 1. Initial Search
When a user asks about code logic (e.g., "Where is the authentication handled?"), ALWAYS try `search_code` first.
- **Requirement**: Use the absolute path to the codebase.
- **Query**: Use clear, descriptive natural language.

### 2. Handling Unindexed Codebases
If `search_code` returns an error stating the codebase is not indexed:
1. Inform the user that the codebase needs indexing.
2. Call `index_codebase` with the absolute path.
3. You can monitor progress with `get_indexing_status` if requested or if the process seems to take time.

### 3. Re-indexing and Conflicts
If the user has made significant changes or if search results seem outdated:
- Use `index_codebase` with `force: true` to refresh the index.
- If a conflict is detected (the path is already indexed), confirm with the user before forcing a re-index.

### 4. Semantic Search vs. Grep
- Use `grep_search` for: Exact symbol names, literal strings, or regex patterns.
- Use `search_code` for: Conceptual searches, finding "how things work," locating similar patterns, or when you don't know the exact names.

## Best Practices
- **Paths**: Always use absolute paths for all `code-intel` tools.
- **Queries**: Be specific in your search queries (e.g., "JWT token validation logic" instead of just "auth").
- **Incremental Indexing**: The system handles minor changes automatically, but a forced re-index might be needed after major refactors.
