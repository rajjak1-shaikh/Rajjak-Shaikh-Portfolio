/**
 * Sync Markdown Blogs to MongoDB
 * 
 * Reads all markdown blog files from app/blog/content/
 * and syncs them to MongoDB as published blogs.
 * Updated to trigger sync workflow
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const result = dotenv.config({ path: join(__dirname, '..', '.env.local') });
if (result.error) {
    dotenv.config({ path: join(__dirname, '..', '.env') });
}

const MONGODB_URI = process.env.MONGODB_URI;
const BLOG_DIR = join(__dirname, '..', 'app', 'blog', 'content');

// Blog schema
const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, default: 'Krishna Jadhav' },
    tags: [String],
    coverImage: String,
    published: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
    readTime: { type: String, default: '5 min read' },
    embedding: [Number],
    embeddingUpdatedAt: Date,
}, { timestamps: true });

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);

function calculateReadTime(content) {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
}

async function syncBlogs() {
    console.log('🚀 Syncing Markdown Blogs to MongoDB');
    console.log('━'.repeat(50));

    if (!MONGODB_URI) {
        console.error('❌ MONGODB_URI is not set');
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Read all markdown files
        console.log('📚 Reading blog files from:', BLOG_DIR);
        const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));
        console.log(`   Found ${files.length} markdown files\n`);

        let synced = 0;
        let updated = 0;

        for (const file of files) {
            const filePath = join(BLOG_DIR, file);
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const { data: frontmatter, content } = matter(fileContent);

            const slug = file.replace('.md', '');
            const title = frontmatter.title || 'Untitled';
            const tags = frontmatter.tags || [];
            const summary = frontmatter.summary || content.trim().split('\n').find(Boolean)?.slice(0, 200) || '';
            const readTime = calculateReadTime(content);

            // Check if blog already exists
            const existingBlog = await Blog.findOne({ slug });

            if (existingBlog) {
                // Update existing
                await Blog.updateOne(
                    { slug },
                    {
                        title,
                        description: summary,
                        content,
                        tags,
                        readTime,
                        published: true,
                    }
                );
                console.log(`   ✏️  Updated: "${title}"`);
                updated++;
            } else {
                // Create new
                await Blog.create({
                    title,
                    slug,
                    description: summary,
                    content,
                    tags,
                    readTime,
                    published: true,
                    author: 'Krishna Jadhav',
                });
                console.log(`   ✅ Created: "${title}"`);
                synced++;
            }
        }

        console.log('\n━'.repeat(50));
        console.log(`✅ Sync complete!`);
        console.log(`   Created: ${synced} new blogs`);
        console.log(`   Updated: ${updated} existing blogs`);

        // Show total count
        const total = await Blog.countDocuments({ published: true });
        console.log(`   Total published: ${total} blogs`);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('\n👋 Disconnected from MongoDB');
    }
}

syncBlogs();
