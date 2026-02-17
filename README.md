# Krishna Portfolio & Blog

A modern personal portfolio with AI-powered semantic search, built using **Next.js App Router**.  
Features a fully integrated blog system, SEO optimization, and production-ready architecture.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://krishnajadhav.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://typescriptlang.org)

---

## ✨ Features

### 🧠 AI-Powered Semantic Search
- **Pinecone** vector database for similarity search
- **Google AI** embeddings (text-embedding-004, 768 dimensions)
- Finds conceptually related content, not just keyword matches
- Real-time search with debounced input

### 📝 Blog System
- Markdown-based blog content (Git-versioned)
- Synced to MongoDB for dynamic features
- Dynamic routing with `[slug]`
- Tags, descriptions, and read time
- Curated sidebar section

### 🎨 Portfolio
- Minimal, modern dark UI with glassmorphism effects
- Home, About, and Blog pages
- Skills, experience, and education sections
- Contact form with email integration
- Newsletter subscription
- Responsive design

### 🔍 SEO & Discoverability
- Automatic sitemap (`/sitemap.xml`)
- RSS feed (`/rss`)
- `robots.txt`
- SEO-friendly routing
- Open Graph meta tags

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Database** | MongoDB (Mongoose) |
| **Vector DB** | Pinecone |
| **AI/Embeddings** | Google Generative AI |
| **Content** | Markdown (`.md`) |
| **Package Manager** | pnpm |
| **Deployment** | Vercel |

---

## 📁 Project Structure

```
app/
├─ api/
│  ├─ search/route.js          # Semantic search API
│  ├─ blogs/route.js            # Blog CRUD API
│  ├─ contact/route.js          # Contact form API
│  └─ newsletter/route.js       # Newsletter API
│
├─ blog/
│  ├─ content/                  # Markdown blog files
│  ├─ lib/get-posts.ts          # Blog utilities
│  ├─ page.tsx                  # Blog listing
│  └─ [slug]/page.tsx           # Dynamic blog pages
│
├─ components/
│  ├─ semantic-search.tsx       # AI search component
│  ├─ nav.tsx                   # Navigation
│  └─ footer.tsx                # Footer
│
├─ rss/route.ts                 # RSS feed
├─ sitemap.ts                   # Sitemap generator
├─ robots.ts                    # Robots.txt
└─ page.tsx                     # Home page

lib/
├─ embeddings.js                # Google AI embedding functions
├─ pinecone.js                  # Pinecone client utilities
└─ db.js                        # MongoDB connection

scripts/
├─ seed-pinecone.js             # Seed blogs to Pinecone
└─ sync-blogs-to-db.js          # Sync markdown to MongoDB
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm
- MongoDB database
- Pinecone account
- Google AI API key

### Installation

```bash
# Clone the repository
git clone https://github.com/KrishnaJadhav2525/krishna-portfolio.git
cd krishna-portfolio

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file with:

```env
MONGODB_URI=your_mongodb_connection_string
GOOGLE_AI_API_KEY=your_google_ai_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=portfolio-search
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_TO=recipient@email.com
```

### Running Locally

```bash
# Start development server
pnpm run dev

# Sync blogs to MongoDB (first time)
node scripts/sync-blogs-to-db.js

# Seed Pinecone with embeddings (first time)
node scripts/seed-pinecone.js
```

---

## 🧠 How Semantic Search Works

```
User Query → Google AI (embed) → Pinecone (similarity search) → MongoDB (full data) → Results
```

1. **Seeding**: Blog content is converted to 768-dimensional vectors using Google AI
2. **Storage**: Vectors stored in Pinecone with MongoDB IDs as references
3. **Search**: Query is embedded, compared against all vectors, ranked by similarity
4. **Results**: Matching blog IDs fetched from MongoDB with full content

---

## 📄 Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `node scripts/sync-blogs-to-db.js` | Sync markdown blogs to MongoDB |
| `node scripts/seed-pinecone.js` | Generate embeddings and seed Pinecone |

---

## 🚢 Deployment

Deployed on **Vercel**. Push to `main` branch triggers automatic deployment.

Required Vercel environment variables:
- `MONGODB_URI`
- `GOOGLE_AI_API_KEY`
- `PINECONE_API_KEY`
- `PINECONE_INDEX_NAME`
- `EMAIL_USER`
- `EMAIL_PASS`
- `EMAIL_TO`

---

## 👤 Author

**Krishna Jadhav**  
Computer Science Undergraduate  
[GitHub](https://github.com/KrishnaJadhav2525) • [LinkedIn](https://linkedin.com/in/krishnajadhav2525)

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
