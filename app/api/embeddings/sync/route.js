/**
 * API Route: Sync Embeddings to Pinecone
 * POST /api/embeddings/sync
 * 
 * Syncs blog embeddings from MongoDB to Pinecone vector database.
 * This enables fast similarity search across all blog content.
 * 
 * The sync process:
 * 1. Creates Pinecone index if it doesn't exist
 * 2. Fetches all blogs with embeddings from MongoDB
 * 3. Upserts vectors to Pinecone with metadata (title, slug, description)
 */

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import { createIndexIfNotExists, upsertVectors } from '@/lib/pinecone';

export async function POST() {
    try {
        // Ensure Pinecone index exists
        await createIndexIfNotExists();

        // Connect to MongoDB
        await connectDB();

        // Fetch all blogs that have embeddings
        const blogs = await Blog.find({
            published: true,
            embedding: { $ne: null },
        }).select('+embedding');

        if (blogs.length === 0) {
            return NextResponse.json({
                success: true,
                message: 'No blogs with embeddings to sync',
                synced: 0,
            });
        }

        console.log(`📤 Syncing ${blogs.length} blog(s) to Pinecone...`);

        // Prepare vectors for Pinecone
        const vectors = blogs.map(blog => ({
            id: blog._id.toString(),
            values: blog.embedding,
            metadata: {
                title: blog.title,
                slug: blog.slug,
                description: blog.description || '',
                tags: blog.tags?.join(', ') || '',
                author: blog.author || 'Unknown',
                type: 'blog', // For future expansion to other content types
            },
        }));

        // Upsert to Pinecone
        await upsertVectors(vectors);

        console.log(`✅ Successfully synced ${vectors.length} blog(s) to Pinecone`);

        return NextResponse.json({
            success: true,
            message: `Synced ${vectors.length} blog(s) to Pinecone`,
            synced: vectors.length,
        });

    } catch (error) {
        console.error('❌ Pinecone sync error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to sync embeddings to Pinecone',
                details: error.message,
            },
            { status: 500 }
        );
    }
}
