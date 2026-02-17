import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const blogSchema = new mongoose.Schema({
    title: String,
    slug: String,
    published: Boolean,
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);

async function main() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete sample blogs that don't have corresponding markdown files
    const sampleSlugs = [
        'building-modern-web-apps-nextjs-14',
        'intro-machine-learning-python',
        'mastering-typescript-react',
        'restful-apis-nodejs-express',
        'css-grid-flexbox-layout-guide'
    ];

    const result = await Blog.deleteMany({ slug: { $in: sampleSlugs } });
    console.log(`Deleted ${result.deletedCount} sample blogs`);

    const remaining = await Blog.find({}).select('title slug').lean();
    console.log(`\nRemaining ${remaining.length} blogs:`);
    remaining.forEach((b, i) => console.log(`  ${i + 1}. ${b.title}`));

    await mongoose.disconnect();
}

main().catch(console.error);
