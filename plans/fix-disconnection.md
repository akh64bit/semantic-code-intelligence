# Plan: Fix MCP Disconnection Issue

The "Disconnected" status of the Gemini Code Intel MCP server is typically caused by missing configuration (API key) or missing dependencies (native binaries for tree-sitter or LanceDB). This plan addresses these issues by improving error handling, configuration management, and onboarding.

## 1. Improve Extension Configuration
We will update `gemini-extension.json` to include a configuration schema. This allows users to set their API key using the CLI command:
`gemini extensions config gemini-code-intel geminiApiKey <YOUR_KEY>`

## 2. Enhance Error Handling in MCP Server
Currently, the server throws an error and exits immediately if the `GEMINI_API_KEY` is missing. We will:
- Catch these early errors in the `main()` function.
- Log a clear, user-friendly message to `stderr` explaining exactly how to fix the issue.
- Verify that native dependencies (like `tree-sitter`) can be loaded and provide a helpful error if they can't.

## 3. Update Documentation
The README will be updated to include a "Troubleshooting" section specifically for the "Disconnected" status.

## 4. Proposed Changes

### gemini-extension.json
Add a `configuration` section:
```json
{
  "name": "gemini-code-intel",
  "configuration": {
    "geminiApiKey": {
      "type": "string",
      "description": "Google AI API Key for Gemini embeddings",
      "required": true
    },
    "dbUri": {
      "type": "string",
      "description": "Path to the local vector database",
      "default": "~/.gemini-code-intel/db"
    }
  },
  ...
}
```

### packages/mcp/src/index.ts
Wrap `main()` in a better try-catch block and add a "pre-flight check" for dependencies.

### packages/mcp/src/config.ts
Update to prioritize configuration from the extension host if available.

## 5. Implementation Steps
1. [ ] Update `gemini-extension.json` with configuration schema.
2. [ ] Modify `packages/mcp/src/config.ts` to handle missing keys more gracefully.
3. [ ] Modify `packages/mcp/src/index.ts` with better error reporting.
4. [ ] Update `README.md` with troubleshooting steps.
