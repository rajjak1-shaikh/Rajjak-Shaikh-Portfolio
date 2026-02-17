/**
 * Pinecone Vector Database Client
 * 
 * This module provides utilities for interacting with Pinecone,
 * including index initialization, vector upsert, and similarity search.
 */

import { Pinecone } from '@pinecone-database/pinecone';

// Cached Pinecone client instance
let pineconeClient = null;

/**
 * Get the Pinecone index name from environment
 */
function getIndexName() {
    return process.env.PINECONE_INDEX_NAME || 'portfolio-search';
}

/**
 * Get or create a Pinecone client instance
 * @returns {Pinecone} Pinecone client
 */
export function getPineconeClient() {
    const apiKey = process.env.PINECONE_API_KEY;

    if (!apiKey) {
        throw new Error('PINECONE_API_KEY is not set in environment variables');
    }

    if (!pineconeClient) {
        pineconeClient = new Pinecone({
            apiKey: apiKey,
        });
    }
    return pineconeClient;
}

/**
 * Get the Pinecone index for portfolio search
 * @returns {import('@pinecone-database/pinecone').Index} Pinecone index
 */
export function getIndex() {
    const client = getPineconeClient();
    return client.index(getIndexName());
}

/**
 * Create the Pinecone index if it doesn't exist
 * Uses 768 dimensions for Google AI text-embedding-004 model
 * @returns {Promise<boolean>} True if index was created, false if it already exists
 */
export async function createIndexIfNotExists() {
    const client = getPineconeClient();

    try {
        // List existing indexes
        const { indexes } = await client.listIndexes();
        const indexExists = indexes?.some(idx => idx.name === getIndexName());

        if (indexExists) {
            console.log(`✅ Pinecone index "${getIndexName()}" already exists`);
            return false;
        }

        // Create new index with 3072 dimensions (gemini-embedding-001)
        await client.createIndex({
            name: getIndexName(),
            dimension: 3072,
            metric: 'cosine',
            spec: {
                serverless: {
                    cloud: 'aws',
                    region: 'us-east-1',
                },
            },
        });

        console.log(`✅ Created Pinecone index "${getIndexName()}"`);
        return true;
    } catch (error) {
        console.error('❌ Error creating Pinecone index:', error);
        throw error;
    }
}

/**
 * Upsert vectors to Pinecone
 * @param {Array<{id: string, values: number[], metadata: object}>} vectors - Vectors to upsert
 * @returns {Promise<void>}
 */
export async function upsertVectors(vectors) {
    console.log(`   Received ${vectors.length} vectors to upsert`);

    if (vectors.length === 0) {
        console.log('No vectors to upsert');
        return;
    }

    // Debug: log first vector structure
    console.log('   First vector sample:', JSON.stringify({
        id: vectors[0].id,
        valuesLength: vectors[0].values?.length,
        metadataKeys: Object.keys(vectors[0].metadata || {}),
    }));

    const index = getIndex();

    // Pinecone recommends batches of 100 vectors
    const batchSize = 100;
    for (let i = 0; i < vectors.length; i += batchSize) {
        const batch = vectors.slice(i, i + batchSize);
        console.log(`   Upserting batch of ${batch.length} vectors...`);
        // Pinecone v7 expects { records: [...] } format
        await index.upsert({ records: batch });
        console.log(`✅ Upserted batch ${Math.floor(i / batchSize) + 1} (${batch.length} vectors)`);
    }
}

/**
 * Query Pinecone for similar vectors
 * @param {number[]} queryVector - The query embedding vector
 * @param {number} topK - Number of results to return (default: 5)
 * @returns {Promise<Array<{id: string, score: number, metadata: object}>>} Similar vectors
 */
export async function querySimilar(queryVector, topK = 5) {
    const index = getIndex();

    const results = await index.query({
        vector: queryVector,
        topK,
        includeMetadata: true,
    });

    return results.matches || [];
}

/**
 * Delete vectors by IDs
 * @param {string[]} ids - Vector IDs to delete
 * @returns {Promise<void>}
 */
export async function deleteVectors(ids) {
    if (ids.length === 0) return;

    const index = getIndex();
    await index.deleteMany(ids);
    console.log(`✅ Deleted ${ids.length} vectors`);
}

export { getIndexName as PINECONE_INDEX_NAME };
