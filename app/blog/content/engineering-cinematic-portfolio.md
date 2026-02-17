---
title: 'Engineering a Cinematic Portfolio: Framer Motion, RAG, and CI/CD'
publishedAt: '2026-02-06'
summary: 'A deep dive into building an immersive 3D project carousel, simulating AI streaming interfaces, and automating content pipelines with GitHub Actions.'
tags: ['Next.js', 'Framer Motion', 'GitHub Actions', 'UI/UX', 'RAG']
---

Building a portfolio is often a tradeoff between showing *what* you built and showing *how* you build. For version 2 of my portfolio, I wanted to bridge that gap—turning the portfolio itself into a technical demonstration of high-performance UI and automated DevOps.

Here is a look under the hood at the new Cinematic Carousel, the "Streaming" RAG interface, and the CI/CD pipeline that powers it all.

## 1. The Cinematic Carousel: From Grid to Hero

The standard grid layout is functional but boring. I wanted a "Hero" moment for each project. The goal was to have a single, focused card that feels like a movie poster, which dramatically expands on hover to reveal technical depth.

### The "Mini-Poster" Expansion
Using **Framer Motion**, I implemented a shared layout animation. When a user hovers over the card, we don't just change the CSS `width`; we signal a layout change that Framer smoothly interpolates.

```tsx
<motion.div 
  layout
  className={`relative overflow-hidden rounded-3xl ... ${isHovered ? 'w-full max-w-4xl' : 'w-full max-w-lg'}`}
>
  {/* Content */}
</motion.div>
```

The trickiest part was the **Staggered Content Reveal**. As the card expands, we don't want the text to just appear instantly. I used `AnimatePresence` with staggered delays:

1.  **Card Expands** (0ms)
2.  **Features List** slides in (200ms)
3.  **Stats Grid** pops up (300ms)
4.  **Action Buttons** fade in (500ms)

This creates a "premium" feel where information flows in sequentially, guiding the user's eye.

## 2. Simulating AI: The Streaming Typewriter

My portfolio features a Semantic Search powered by RAG (Retrieval Augmented Generation). However, the actual search API is a fast REST endpoint. To make it *feel* like an AI interaction, I implemented a **Typewriter Effect**.

Instead of dumping the search result text immediately, I created a component that reveals it character by character:

```tsx
function Typewriter({ text, speed = 10 }) {
  const [displayed, setDisplayed] = useState('');
  
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(prev => prev + text.charAt(i));
        i++;
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text]);

  return <span>{displayed}</span>;
}
```

This simple UI trick reduces cognitive load and aligns with the user's mental model of "asking an AI."

## 3. "Push to Publish": Automated CI/CD

Previously, adding a blog meant pushing code, then manually running a script to sync embeddings to Pinecone. This was error-prone.

I automated this using **GitHub Actions**. I created a workflow `.github/workflows/sync-blogs.yml` that watches for changes in the `content/` directory.

```yaml
on:
  push:
    paths:
      - 'app/blog/content/**'

jobs:
  sync:
    steps:
      - name: Run Sync Script
        run: node scripts/sync-blogs-to-db.js
        env:
          MONGODB_URI: ${{ secrets.MONGODB_URI }}
          PINECONE_API_KEY: ${{ secrets.PINECONE_API_KEY }}
```

Now, the moment I `git push`, GitHub spins up a runner, executes the sync script, and updates my Vector Database. My documentation pipeline is now fully continuous.

## 4. Advanced SEO

Finally, a portfolio is useless if no one sees it. I overhauled the `metadata` to include **OpenGraph** tags (for nice Twitter/LinkedIn previews) and **JSON-LD Structured Data**.

The JSON-LD tells Google explicitly: "This website represents a **Person**, and here are their links."

```tsx
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Krishna",
  "jobTitle": "Full Stack Developer"
}
```

## Conclusion

This update wasn't just about CSS; it was about treating the portfolio as a product. By focusing on **Interaction Design** (Cinematic Hover), **User Experience** (Streaming UI), and **Developer Experience** (CI/CD), the site now stands as a testament to the engineering values I bring to every project.
