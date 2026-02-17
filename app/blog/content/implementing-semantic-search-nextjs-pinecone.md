---
title: "Implementing Semantic Search in a Next.js Portfolio with Pinecone and Google AI"
publishedAt: "2026-02-03"
summary: "A deep dive into building AI-powered semantic search for my portfolio using Pinecone vector database, Google's text-embedding-004 model, and Next.js - from architecture decisions to debugging production issues."
tags: ["AI", "Semantic Search", "Pinecone", "Next.js", "Vector Database", "Google AI"]
---

## The Problem: Beyond Keyword Search

Traditional keyword-based search has its limitations. When users search for "machine learning projects" on a portfolio, they often miss relevant content that uses different terminology like "AI models," "predictive analytics," or "neural networks."

I wanted my portfolio to understand **intent**, not just match words. That's where semantic search comes in.

---

## What is Semantic Search?

Semantic search uses AI embeddings to understand the **meaning** behind text. Instead of looking for exact keyword matches, it:

1. Converts text into high-dimensional vectors (embeddings)
2. Stores these vectors in a specialized database
3. Finds similar content by comparing vector distances

When someone searches "web development frameworks," semantic search can find content about React, Next.js, and Vue - even if those exact words weren't in the query.

---

## The Tech Stack

After researching various options, I settled on:

- **Google AI text-embedding-004**: Produces 768-dimensional embeddings with excellent semantic understanding
- **Pinecone**: Serverless vector database with fast similarity search
- **Next.js API Routes**: Backend integration
- **MongoDB**: Storing blog content and cached embeddings

### Why These Choices?

**Pinecone** stood out for its:
- Generous free tier (enough for a portfolio)
- Serverless architecture (no infrastructure management)
- Fast query times
- Simple JavaScript SDK

**Google AI Embeddings** because:
- High-quality 768-dimensional vectors
- Free tier available
- Easy API integration
- Excellent multilingual support

---

## Architecture Overview

```
User Search Query
       ↓
Generate Query Embedding (Google AI)
       ↓
Vector Similarity Search (Pinecone)
       ↓
Return Ranked Results with Metadata
```

The flow is straightforward:
1. User enters a search query
2. We generate an embedding for the query
3. Pinecone finds the most similar content vectors
4. We return the matching blog posts/projects

---

## Setting Up Pinecone

First, I created a Pinecone index with the right configuration:

```javascript
await pinecone.createIndex({
    name: 'portfolio-search',
    dimension: 768,  // Google AI embedding size
    metric: 'cosine',
    spec: {
        serverless: {
            cloud: 'aws',
            region: 'us-east-1',
        },
    },
});
```

The **dimension must match** your embedding model - Google AI's text-embedding-004 produces 768-dimensional vectors.

---

## Generating Embeddings

The embedding generation is handled by a utility function:

```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function generateEmbedding(text) {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
    
    const result = await model.embedContent(text);
    return result.embedding.values;  // 768-dimensional array
}
```

For better search quality, I combine multiple fields:

```javascript
function prepareTextForEmbedding(document) {
    return `Title: ${document.title}
    Description: ${document.description}
    Content: ${document.content}
    Tags: ${document.tags.join(', ')}`;
}
```

This gives the embedding model rich context about each piece of content.

---

## Challenges We Faced

### 1. Environment Variables Not Loading

**Problem**: The seeding script couldn't access environment variables.

**Solution**: Next.js uses `.env.local`, but Node scripts need explicit loading:

```javascript
import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env.local') });
```

### 2. File-Based vs Database Blogs

**Problem**: My blogs were stored as markdown files, not in MongoDB.

**Solution**: Created a sync script to read markdown files using `gray-matter` and push them to MongoDB:

```javascript
const { data: frontmatter, content } = matter(fileContent);
await Blog.create({
    title: frontmatter.title,
    slug: filename.replace('.md', ''),
    content: content,
    published: true,
});
```

### 3. Invalid API Keys

**Problem**: API keys weren't being recognized during embedding generation.

**Solution**: Ensured dotenv loads BEFORE importing modules that use env vars. Import order matters!

---

## The Seeding Process

With everything set up, the seeding script:

1. Connects to MongoDB
2. Fetches all published blogs
3. Generates embeddings for each
4. Upserts vectors to Pinecone
5. Stores embeddings in MongoDB (for caching)

```javascript
for (const blog of blogs) {
    const text = prepareTextForEmbedding(blog);
    const embedding = await generateEmbedding(text);
    
    vectors.push({
        id: `blog-${blog._id}`,
        values: embedding,
        metadata: {
            title: blog.title,
            slug: blog.slug,
            tags: blog.tags,
        },
    });
}

await pinecone.index('portfolio-search').upsert(vectors);
```

---

## Querying for Results

The search API endpoint is simple:

```javascript
export async function POST(request) {
    const { query } = await request.json();
    
    // Generate embedding for the search query
    const queryEmbedding = await generateEmbedding(query);
    
    // Search Pinecone
    const results = await index.query({
        vector: queryEmbedding,
        topK: 5,
        includeMetadata: true,
    });
    
    return Response.json({ results: results.matches });
}
```

The `topK` parameter controls how many results to return, and `includeMetadata` gives us the blog details.

---

## Results and Performance

After implementing semantic search:

- Searches return **relevant results even with different terminology**
- Query times are under **100ms** thanks to Pinecone's optimization
- The system scales automatically with more content

A search for "building websites" now returns posts about Next.js, React, and frontend development - exactly what users expect.

---

## Key Takeaways

1. **Embeddings capture meaning**: They understand synonyms, related concepts, and intent
2. **Vector databases are essential**: Traditional databases can't efficiently search high-dimensional vectors
3. **Environment setup matters**: Getting env vars right in different contexts (Next.js vs Node scripts) requires attention
4. **Sync your data sources**: Having content in both files and database requires synchronization scripts
5. **Start simple**: Begin with basic search, then add features like filtering and pagination

---

## What's Next

Future improvements planned:
- Add semantic search to projects, not just blogs
- Implement search suggestions
- Add relevance feedback to improve results
- Cache embeddings for faster seeding

Semantic search transforms how users interact with content. Instead of hoping they guess the right keywords, they can describe what they're looking for naturally.

---

Building this taught me that AI features aren't just for big tech companies. With the right tools, even a personal portfolio can have intelligent, context-aware search.
