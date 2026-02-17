/**
 * API Route: Generate Embeddings for Blogs
 * POST /api/embeddings/generate
 * 
 * Generates embedding vectors for blog posts using Google AI.
 * These embeddings enable semantic search functionality.
 * 
 * Request body:
 * - id (optional): Specific blog ID to generate embedding for
 * - force (optional): Regenerate even if embedding exists
 * 
 * If no id is provided, generates embeddings for all published blogs
 * that don't have embeddings yet (or all if force=true).
 */

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import { generateEmbedding, prepareTextForEmbedding } from '@/lib/embeddings';

export async function POST(request) {
    try {
        await connectDB();

        const body = await request.json().catch(() => ({}));
        const { id, force = false } = body;

        let blogs;

        if (id) {
            // Generate for specific blog
            const blog = await Blog.findById(id).select('+embedding');
            if (!blog) {
                return NextResponse.json(
                    { success: false, error: 'Blog not found' },
                    { status: 404 }
                );
            }
            blogs = [blog];
        } else {
            // Generate for all published blogs
            const query = { published: true };

            // Only get blogs without embeddings unless force is true
            if (!force) {
                query.embedding = { $eq: null };
            }

            blogs = await Blog.find(query).select('+embedding');
        }

        if (blogs.length === 0) {
            return NextResponse.json({
                success: true,
                message: 'No blogs need embedding generation',
                generated: 0,
            });
        }

        console.log(`📝 Generating embeddings for ${blogs.length} blog(s)...`);

        let generated = 0;
        const errors = [];

        for (const blog of blogs) {
            try {
                // Prepare text by combining title, description, content, and tags
                const text = prepareTextForEmbedding(blog);

                // Generate embedding using Google AI
                const embedding = await generateEmbedding(text);

                // Update blog document with embedding
                await Blog.findByIdAndUpdate(blog._id, {
                    embedding,
                    embeddingUpdatedAt: new Date(),
                });

                generated++;
                console.log(`✅ Generated embedding for: ${blog.title}`);
            } catch (error) {
                console.error(`❌ Error generating embedding for ${blog.title}:`, error.message);
                errors.push({ id: blog._id.toString(), title: blog.title, error: error.message });
            }
        }

        return NextResponse.json({
            success: true,
            message: `Generated embeddings for ${generated} blog(s)`,
            generated,
            total: blogs.length,
            errors: errors.length > 0 ? errors : undefined,
        });

    } catch (error) {
        console.error('❌ Embedding generation error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to generate embeddings',
                details: error.message,
            },
            { status: 500 }
        );
    }
}
