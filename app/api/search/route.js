/**
 * API Route: Semantic Search
 * GET /api/search
 * 
 * Performs semantic search across blog posts using embeddings.
 * Unlike keyword search, this finds conceptually similar content
 * even if the exact words don't match.
 * 
 * Query parameters:
 * - q: Search query (required)
 * - limit: Number of results to return (default: 5, max: 20)
 * 
 * Response:
 * - results: Array of matching blogs with similarity scores
 */

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import { generateEmbedding } from '@/lib/embeddings';
import { querySimilar } from '@/lib/pinecone';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');
        const limit = Math.min(parseInt(searchParams.get('limit') || '5'), 20);

        // Validate query
        if (!query || query.trim().length === 0) {
            return NextResponse.json(
                { success: false, error: 'Search query is required' },
                { status: 400 }
            );
        }

        if (query.length < 2) {
            return NextResponse.json(
                { success: false, error: 'Search query must be at least 2 characters' },
                { status: 400 }
            );
        }

        console.log(`🔍 Semantic search for: "${query}"`);
        const start = Date.now();

        // Generate embedding for the search query
        const embeddingStart = Date.now();
        const queryEmbedding = await generateEmbedding(query);
        console.log(`⏱️ Embedding took ${Date.now() - embeddingStart}ms`);

        // Query Pinecone for similar vectors
        const pineconeStart = Date.now();
        const matches = await querySimilar(queryEmbedding, limit);
        console.log(`⏱️ Pinecone took ${Date.now() - pineconeStart}ms`);

        if (matches.length === 0) {
            return NextResponse.json({
                success: true,
                query,
                results: [],
                message: 'No matching blogs found',
            });
        }

        // Extract blog IDs from matches (strip 'blog-' prefix)
        const blogIds = matches.map(match => match.id.replace('blog-', ''));

        // Fetch full blog documents from MongoDB
        const mongoStart = Date.now();
        await connectDB();
        const blogs = await Blog.find({
            _id: { $in: blogIds },
            published: true,
        }).select('-__v');

        // Create a map for quick lookup and preserve Pinecone ordering (by similarity)
        const blogMap = new Map(blogs.map(blog => [blog._id.toString(), blog]));

        // Combine Pinecone scores with blog data, maintaining similarity order
        const results = matches
            .map(match => {
                const blogId = match.id.replace('blog-', '');
                const blog = blogMap.get(blogId);
                if (!blog) return null;

                return {
                    score: match.score, // Similarity score (0-1, higher is better)
                    blog: blog.toObject(),
                };
            })
            .filter(Boolean);

        console.log(`✅ Found ${results.length} matching blog(s)`);
        console.log(`⏱️ MongoDB took ${Date.now() - mongoStart}ms`);
        console.log(`⏱️ Total search took ${Date.now() - start}ms`);

        return NextResponse.json({
            success: true,
            query,
            count: results.length,
            results,
        });

    } catch (error) {
        console.error('❌ Search error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Search failed',
                details: error.stack,
            },
            { status: 500 }
        );
    }
}
