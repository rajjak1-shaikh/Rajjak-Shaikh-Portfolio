/**
 * Pinecone Seeding Script
 * 
 * This script fetches all blogs from MongoDB, generates embeddings,
 * and uploads them to Pinecone for semantic search.
 * 
 * Usage:
 *   node scripts/seed-pinecone.js
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load .env.local (Next.js convention)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const result = dotenv.config({ path: join(__dirname, '..', '.env.local') });
if (result.error) {
    dotenv.config({ path: join(__dirname, '..', '.env') });
}
import mongoose from 'mongoose';

// Import after dotenv so env vars are available
import { generateEmbedding, prepareTextForEmbedding } from '../lib/embeddings.js';
import { upsertVectors, getIndex } from '../lib/pinecone.js';

const MONGODB_URI = process.env.MONGODB_URI;

// Define Blog schema inline (avoiding Next.js module resolution issues)
const blogSchema = new mongoose.Schema({
    title: String,
    slug: String,
    description: String,
    content: String,
    author: String,
    tags: [String],
    coverImage: String,
    published: Boolean,
    views: Number,
    readTime: String,
    embedding: [Number],
    embeddingUpdatedAt: Date,
}, { timestamps: true });

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);

async function connectDB() {
    if (mongoose.connection.readyState >= 1) {
        return mongoose.connection;
    }

    console.log('📦 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    return mongoose.connection;
}

async function seedPinecone() {
    console.log('🚀 Pinecone Seeding Script');
    console.log('━'.repeat(50));

    // Validate environment
    if (!MONGODB_URI) {
        console.error('❌ MONGODB_URI is not set');
        process.exit(1);
    }

    if (!process.env.PINECONE_API_KEY) {
        console.error('❌ PINECONE_API_KEY is not set');
        process.exit(1);
    }

    if (!process.env.GOOGLE_AI_API_KEY) {
        console.error('❌ GOOGLE_AI_API_KEY is not set');
        process.exit(1);
    }

    try {
        // Connect to MongoDB
        await connectDB();

        // Fetch all published blogs
        console.log('\n📚 Fetching blogs from MongoDB...');
        const blogs = await Blog.find({ published: true }).lean();
        console.log(`   Found ${blogs.length} published blogs`);

        if (blogs.length === 0) {
            console.log('\n⚠️  No published blogs found. Nothing to seed.');
            console.log('   Create some blog posts first!');
            await mongoose.disconnect();
            return;
        }

        // Generate embeddings and prepare vectors
        console.log('\n🧠 Generating embeddings...');
        const vectors = [];

        for (const blog of blogs) {
            console.log(`   Processing: "${blog.title}"`);

            try {
                // Prepare text for embedding
                const text = prepareTextForEmbedding({
                    title: blog.title,
                    description: blog.description,
                    content: blog.content,
                    tags: blog.tags,
                });

                // Generate embedding
                const embedding = await generateEmbedding(text);

                if (!embedding || !Array.isArray(embedding) || embedding.length === 0) {
                    console.error(`      ⚠️ Invalid embedding for "${blog.title}":`, embedding);
                    continue;
                }

                console.log(`      ✅ Got embedding with ${embedding.length} dimensions`);

                // Prepare vector for Pinecone
                vectors.push({
                    id: `blog-${blog._id.toString()}`,
                    values: embedding,
                    metadata: {
                        type: 'blog',
                        title: blog.title,
                        slug: blog.slug,
                        description: blog.description?.substring(0, 200) || '',
                        tags: blog.tags || [],
                        author: blog.author || 'Krishna Jadhav',
                        coverImage: blog.coverImage || '',
                        readTime: blog.readTime || '5 min read',
                        createdAt: blog.createdAt?.toISOString() || new Date().toISOString(),
                    },
                });

                // Also update the blog document with the embedding
                await Blog.updateOne(
                    { _id: blog._id },
                    {
                        embedding: embedding,
                        embeddingUpdatedAt: new Date(),
                    }
                );
            } catch (err) {
                console.error(`      ❌ Failed to embed "${blog.title}":`, err.message);
            }
        }

        // Upsert to Pinecone
        console.log(`\n📤 Uploading ${vectors.length} vectors to Pinecone...`);

        if (vectors.length === 0) {
            console.log('⚠️  No vectors to upload. Check if embeddings were generated correctly.');
        } else {
            await upsertVectors(vectors);
        }

        // Verify the upload
        console.log('\n🔍 Verifying upload...');
        const index = getIndex();
        const stats = await index.describeIndexStats();
        console.log(`   Total vectors in index: ${stats.totalRecordCount}`);

        console.log('\n✅ Seeding complete!');
        console.log(`   ${vectors.length} blogs indexed for semantic search`);

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error(error.stack);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('\n👋 Disconnected from MongoDB');
    }
}

// Run the script
seedPinecone();
