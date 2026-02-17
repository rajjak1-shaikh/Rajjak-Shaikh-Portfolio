/**
 * Google AI Embeddings Utility
 * 
 * This module provides functions for generating text embeddings
 * using Google's Generative AI (text-embedding-004 model).
 * 
 * Embeddings are used for semantic search - they convert text into
 * numerical vectors that capture meaning, allowing similarity comparison.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Google AI client (lazy initialization)
let genAI = null;
let embeddingModel = null;

/**
 * Get or create the embedding model instance
 * @returns {import('@google/generative-ai').GenerativeModel} Embedding model
 */
function getEmbeddingModel() {
    const apiKey = process.env.GOOGLE_AI_API_KEY;

    if (!apiKey) {
        throw new Error('GOOGLE_AI_API_KEY is not set in environment variables');
    }

    if (!genAI) {
        genAI = new GoogleGenerativeAI(apiKey);
    }
    if (!embeddingModel) {
        // text-embedding-004 is Google's latest embedding model
        // Outputs 768-dimensional vectors
        embeddingModel = genAI.getGenerativeModel({ model: 'models/gemini-embedding-001' });
    }
    return embeddingModel;
}

/**
 * Generate an embedding vector for a single text
 * @param {string} text - The text to embed
 * @returns {Promise<number[]>} 768-dimensional embedding vector
 */
export async function generateEmbedding(text) {
    if (!text || text.trim().length === 0) {
        throw new Error('Text cannot be empty');
    }

    const model = getEmbeddingModel();

    try {
        const result = await model.embedContent(text);
        return result.embedding.values;
    } catch (error) {
        console.error('❌ Error generating embedding:', error);
        throw error;
    }
}

/**
 * Generate embeddings for multiple texts (batch processing)
 * @param {string[]} texts - Array of texts to embed
 * @returns {Promise<number[][]>} Array of 768-dimensional embedding vectors
 */
export async function generateEmbeddings(texts) {
    if (!texts || texts.length === 0) {
        return [];
    }

    // Process in parallel for efficiency
    const embeddings = await Promise.all(
        texts.map(text => generateEmbedding(text))
    );

    return embeddings;
}

/**
 * Prepare text for embedding by combining relevant fields
 * This creates a rich text representation for better semantic matching
 * @param {object} document - Document with title, description, content, tags
 * @returns {string} Combined text for embedding
 */
export function prepareTextForEmbedding(document) {
    const parts = [];

    if (document.title) {
        // Title is weighted by repetition for emphasis
        parts.push(`Title: ${document.title}`);
    }

    if (document.description) {
        parts.push(`Description: ${document.description}`);
    }

    if (document.content) {
        // Truncate very long content to avoid token limits
        // text-embedding-004 has a 2048 token limit
        const maxContentLength = 6000; // Approximate character limit
        const content = document.content.length > maxContentLength
            ? document.content.substring(0, maxContentLength) + '...'
            : document.content;
        parts.push(`Content: ${content}`);
    }

    if (document.tags && Array.isArray(document.tags) && document.tags.length > 0) {
        parts.push(`Tags: ${document.tags.join(', ')}`);
    }

    return parts.join('\n\n');
}
