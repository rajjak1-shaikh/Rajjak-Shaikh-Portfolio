---
title: "Building My Portfolio with Next.js App Router"
publishedAt: "2026-01-25"
summary: "How I designed and built my personal portfolio using Next.js App Router, focusing on scalability, SEO, and real-world architecture decisions."
tags: ["Next.js", "Portfolio", "Frontend", "App Router"]
---

## Why I Decided to Build My Own Portfolio

Instead of using a template or a no-code builder, I chose to build my portfolio from scratch.  
The goal wasn’t just to have a website — it was to **learn how real-world web applications are structured**, deployed, and maintained.

I wanted:
- Clean architecture
- Full control over content
- SEO-friendly pages
- A base that could grow into a full product

That’s why I picked **Next.js App Router**.

---

## Why Next.js App Router?

Next.js App Router encourages a more **structured and scalable** way of building applications.

Some reasons it stood out to me:
- Built-in layouts and nested routing
- Server components by default
- Better handling of metadata and SEO
- Clear separation between UI and logic

Compared to the older Pages Router, this felt closer to how production systems are designed.

---

## Project Structure Overview

I structured the project around clarity and separation of concerns.

---
title: "Building My Portfolio with Next.js App Router"
publishedAt: "2026-01-25"
summary: "How I designed and built my personal portfolio using Next.js App Router, focusing on scalability, SEO, and real-world architecture decisions."
tags: ["Next.js", "Portfolio", "Frontend", "App Router"]
---

## Why I Decided to Build My Own Portfolio

Instead of using a template or a no-code builder, I chose to build my portfolio from scratch.  
The goal wasn’t just to have a website — it was to **learn how real-world web applications are structured**, deployed, and maintained.

I wanted:
- Clean architecture
- Full control over content
- SEO-friendly pages
- A base that could grow into a full product

That’s why I picked **Next.js App Router**.

---

## Why Next.js App Router?

Next.js App Router encourages a more **structured and scalable** way of building applications.

Some reasons it stood out to me:
- Built-in layouts and nested routing
- Server components by default
- Better handling of metadata and SEO
- Clear separation between UI and logic

Compared to the older Pages Router, this felt closer to how production systems are designed.

---

## Project Structure Overview

I structured the project around clarity and separation of concerns.

app/
├─ page.tsx // Home
├─ about/page.tsx // About
├─ blog/
│ ├─ page.tsx // Blog list
│ ├─ [slug]/ // Individual blog pages
│ └─ content/ // Markdown files
├─ sitemap.ts
├─ robots.ts
└─ rss/route.ts

Each part of the app has a **single responsibility**, which makes it easier to maintain and extend later.

---

## Designing the Blog System

Instead of using a CMS initially, I went with **Markdown-based blogs**.

### Why Markdown?
- Simple and fast
- No database needed initially
- Easy to version-control with Git
- Perfect for a personal blog

Each blog lives as a `.md` file inside `app/blog/content`, and the site automatically:
- Generates slugs
- Renders content
- Adds it to sitemap and RSS

---

## Handling SEO Properly

SEO was not an afterthought.

I implemented:
- `sitemap.xml` generation
- RSS feed for blog updates
- `robots.txt`
- Clean URLs using slugs
- Metadata per page

This ensures the site is:
- Search-engine friendly
- Shareable
- Future-proof

---

## Real Problems I Faced (and Solved)

This project wasn’t smooth — and that’s a good thing.

Some real issues I ran into:
- Importing shared values from route files (bad idea)
- Path mismatches on Vercel (Linux vs Windows)
- pnpm lockfile conflicts
- Static vs dynamic route confusion

Solving these taught me more than any tutorial ever could.

---

## What I’d Do Differently Next Time

- Add backend support earlier for forms
- Add analytics sooner
- Write tests for utility functions
- Plan SEO routes earlier

But overall, the architecture held up well.

---

## What’s Next?

This portfolio is not “done”.

Next steps include:
- Backend integration with MongoDB
- Newsletter subscriptions
- Contact form persistence
- AI-powered blog recommendations

This project is meant to **evolve**, not stay static.

---

## Final Thoughts

Building this portfolio taught me that real development is less about frameworks and more about:
- Making tradeoffs
- Debugging unexpected issues
- Designing for the future

And that’s exactly why I’m glad I built it myself.
