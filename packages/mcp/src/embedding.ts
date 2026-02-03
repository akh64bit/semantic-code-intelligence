import { GeminiEmbedding } from "@zilliz/gemini-context-core";
import { ContextMcpConfig } from "./config.js";

// Helper function to create embedding instance for Gemini
export function createEmbeddingInstance(config: ContextMcpConfig): GeminiEmbedding {
    console.log(`[EMBEDDING] Creating Gemini embedding instance...`);

    if (!config.geminiApiKey) {
        console.error(`[EMBEDDING] ❌ Gemini API key is required but not provided`);
        throw new Error('GEMINI_API_KEY is required for Gemini embedding provider');
    }
    console.log(`[EMBEDDING] 🔧 Configuring Gemini with model: ${config.embeddingModel}`);
    const geminiEmbedding = new GeminiEmbedding({
        apiKey: config.geminiApiKey,
        model: config.embeddingModel,
        ...(config.geminiBaseUrl && { baseURL: config.geminiBaseUrl })
    });
    console.log(`[EMBEDDING] ✅ Gemini embedding instance created successfully`);
    return geminiEmbedding;
}

export function logEmbeddingProviderInfo(config: ContextMcpConfig, embedding: GeminiEmbedding): void {
    console.log(`[EMBEDDING] ✅ Successfully initialized Gemini embedding provider`);
    console.log(`[EMBEDDING] Provider details - Model: ${config.embeddingModel}, Dimension: ${embedding.getDimension()}`);

    // Log Gemini configuration details
    console.log(`[EMBEDDING] Gemini configuration - API Key: ${config.geminiApiKey ? '✅ Provided' : '❌ Missing'}, Base URL: ${config.geminiBaseUrl || 'Default'}`);
} 
