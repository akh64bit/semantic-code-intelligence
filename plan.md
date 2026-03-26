# Plan: Convert Gemini Code Intel to Gemini Extension

This plan outlines the steps to transform the existing MCP-based project into a native Gemini extension for the Gemini CLI.

## Goals
- Simplify usage by removing the need for manual `settings.json` configuration.
- Provide a better user experience through integrated agent skills.
- Standardize the project structure as a Gemini extension.

## Proposed Changes

### 1. Branching Strategy
- Create a new branch `feature/gemini-extension` to perform all changes.

### 2. Extension Manifest (`gemini-extension.json`)
- Create a `gemini-extension.json` in the root directory.
- Configure the `mcpServers` to point to the local build of `@gemini/gemini-code-intel-mcp`.
- Use relative paths to ensure portability.

### 3. Agent Skill (`skills/code-intel/SKILL.md`)
- Create a new skill called `code-intel`.
- Provide detailed instructions to the agent on:
    - When to use semantic search vs. traditional grep.
    - How to trigger indexing if a search fails.
    - Best practices for natural language queries.

### 4. Build and Installation
- Ensure the project can be built using existing `pnpm` scripts.
- Provide instructions for linking the extension using `gemini extensions link .`.

### 5. Cleanup (Optional/Post-Implementation)
- Document how users can remove the manual entry from `settings.json` once the extension is active.

## Implementation Steps

1.  **Preparation:**
    - Switch to a new branch: `git checkout -b feature/gemini-extension`.
2.  **Manifest Creation:**
    - Write `gemini-extension.json`.
3.  **Skill Creation:**
    - Create directory `skills/code-intel/`.
    - Write `skills/code-intel/SKILL.md`.
4.  **Verification:**
    - Run `pnpm build` to ensure latest `dist` files are present.
    - Run `gemini extensions link .`.
    - Test the extension by asking Gemini CLI to search for something in the codebase.
