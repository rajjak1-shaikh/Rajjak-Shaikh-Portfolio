/**
 * Pinecone Index Initialization Script
 * 
 * Run this script once to create the Pinecone index for semantic search.
 * 
 * Usage:
 *   node scripts/init-pinecone.js
 * 
 * Prerequisites:
 *   - Set PINECONE_API_KEY in your environment
 *   - Optionally set PINECONE_INDEX_NAME (defaults to 'portfolio-search')
 */

// Load environment variables
import 'dotenv/config';

import { Pinecone } from '@pinecone-database/pinecone';

const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME || 'portfolio-search';

async function main() {
    console.log('🚀 Pinecone Index Initialization Script');
    console.log('━'.repeat(50));

    // Validate API key
    if (!PINECONE_API_KEY) {
        console.error('❌ Error: PINECONE_API_KEY environment variable is not set');
        console.log('\nPlease set it in your .env.local file:');
        console.log('  PINECONE_API_KEY=your_api_key_here');
        process.exit(1);
    }

    try {
        // Initialize Pinecone client
        const pinecone = new Pinecone({
            apiKey: PINECONE_API_KEY,
        });

        console.log('✅ Connected to Pinecone');

        // Check if index already exists
        const { indexes } = await pinecone.listIndexes();
        const existingIndex = indexes?.find(idx => idx.name === PINECONE_INDEX_NAME);

        if (existingIndex) {
            console.log(`\n⚠️  Index "${PINECONE_INDEX_NAME}" already exists`);
            console.log('   Dimension:', existingIndex.dimension);
            console.log('   Metric:', existingIndex.metric);
            console.log('   Status:', existingIndex.status?.state || 'unknown');
            console.log('\nNo action needed. Index is ready to use.');
            return;
        }

        // Create new index
        console.log(`\n📝 Creating index "${PINECONE_INDEX_NAME}"...`);
        console.log('   Dimension: 768 (Google AI text-embedding-004)');
        console.log('   Metric: cosine');
        console.log('   Cloud: AWS us-east-1 (serverless)');

        await pinecone.createIndex({
            name: PINECONE_INDEX_NAME,
            dimension: 768,
            metric: 'cosine',
            spec: {
                serverless: {
                    cloud: 'aws',
                    region: 'us-east-1',
                },
            },
        });

        console.log(`\n✅ Successfully created index "${PINECONE_INDEX_NAME}"`);
        console.log('\n⏳ Note: The index may take a few minutes to become ready.');
        console.log('   You can check the status in the Pinecone dashboard.');

    } catch (error) {
        console.error('\n❌ Error:', error.message);

        if (error.message?.includes('INVALID_API_KEY')) {
            console.log('\nPlease check your PINECONE_API_KEY is correct.');
        }

        process.exit(1);
    }
}

main();
