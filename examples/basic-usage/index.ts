import { Context, MilvusVectorDatabase, AstCodeSplitter, GeminiEmbedding } from '@zilliz/gemini-context-core';
import { envManager } from '@zilliz/gemini-context-core';
import * as path from 'path';

// Try to load .env file
try {
    require('dotenv').config();
} catch (error) {
    // dotenv is not required, skip if not installed
}

async function main() {
    console.log('🚀 Gemini Context Real Usage Example');
    console.log('===============================');

    try {
        // 1. Initialize Vector Database
        const milvusAddress = envManager.get('MILVUS_ADDRESS') || 'localhost:19530';
        const milvusToken = envManager.get('MILVUS_TOKEN');

        console.log(`🔌 Connecting to Milvus at: ${milvusAddress}`);

        const vectorDatabase = new MilvusVectorDatabase({
            address: milvusAddress,
            ...(milvusToken && { token: milvusToken })
        });

        // 2. Create Context instance
        const codeSplitter = new AstCodeSplitter(2500, 300);

        const context = new Context({
            vectorDatabase,
            codeSplitter,
            supportedExtensions: ['.ts', '.js', '.py', '.java', '.cpp', '.go', '.rs']
        });

        // 3. Check if index already exists and clear if needed
        console.log('\n📖 Starting to index codebase...');
        const codebasePath = path.join(__dirname, '../..'); // Index entire project

        // Check if index already exists
        const hasExistingIndex = await context.hasIndex(codebasePath);
        if (hasExistingIndex) {
            console.log('🗑️  Existing index found, clearing it first...');
            await context.clearIndex(codebasePath);
        }

        // Index with progress tracking
        const indexStats = await context.indexCodebase(codebasePath);

        // 4. Show indexing statistics
        console.log(`\n📊 Indexing stats: ${indexStats.indexedFiles} files, ${indexStats.totalChunks} code chunks`);

        // 5. Perform semantic search
        console.log('\n🔍 Performing semantic search...');

        const queries = [
            'vector database operations',
            'code splitting functions',
            'embedding generation',
            'typescript interface definitions'
        ];

        for (const query of queries) {
            console.log(`\n🔎 Search: "${query}"`);
            const results = await context.semanticSearch(codebasePath, query, 3, 0.3);

            if (results.length > 0) {
                results.forEach((result, index) => {
                    console.log(`   ${index + 1}. Similarity: ${(result.score * 100).toFixed(2)}%`);
                    console.log(`      File: ${path.join(codebasePath, result.relativePath)}`);
                    console.log(`      Language: ${result.language}`);
                    console.log(`      Lines: ${result.startLine}-${result.endLine}`);
                    console.log(`      Preview: ${result.content.substring(0, 100)}...`);
                });
            } else {
                console.log('   No relevant results found');
            }
        }

        console.log('\n🎉 Example completed successfully!');

    } catch (error) {
        console.error('❌ Error occurred:', error);

        // Provide detailed error diagnostics
        if (error instanceof Error) {
            if (error.message.includes('API key')) {
                console.log('\n💡 Please make sure to set the correct GEMINI_API_KEY environment variable');
                console.log('   Example: export GEMINI_API_KEY="your-actual-api-key"');
            } else if (error.message.includes('Milvus') || error.message.includes('connect')) {
                console.log('\n💡 Please make sure Milvus service is running');
                console.log('   - Default address: localhost:19530');
                console.log('   - Can be modified via MILVUS_ADDRESS environment variable');
                console.log('   - Start Milvus: docker run -p 19530:19530 milvusdb/milvus:latest');
            }

            console.log('\n💡 Environment Variables:');
            console.log('   - GEMINI_API_KEY: Your Google AI API key (required)');
            console.log('   - GEMINI_BASE_URL: Custom Gemini API endpoint (optional)');
            console.log('   - MILVUS_ADDRESS: Milvus server address (default: localhost:19530)');
            console.log('   - MILVUS_TOKEN: Milvus authentication token (optional)');
        }

        process.exit(1);
    }
}

// Run main program
if (require.main === module) {
    main().catch(console.error);
}

export { main };