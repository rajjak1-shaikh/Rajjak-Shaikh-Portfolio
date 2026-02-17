---
title: "Implementing SEO in Next.js: Sitemap, RSS, and Robots.txt"
publishedAt: "2026-01-26"
summary: "How I implemented sitemap.xml, RSS feeds, and robots.txt in a Next.js App Router project, and the real-world issues I faced while deploying to Vercel."
tags: ["Next.js", "SEO", "Web Development", "App Router"]
---

## Why SEO Matters Even for a Portfolio

SEO is often treated as something only large products need, but that mindset is wrong.

A portfolio is:
- Public
- Meant to be discovered
- Often reviewed through links, previews, and search results

If search engines can’t properly crawl and understand it, you’re leaving visibility on the table.

That’s why I decided to implement **proper SEO infrastructure** instead of relying on defaults.

---

## The Three SEO Pillars I Implemented

I focused on three core pieces:

1. `sitemap.xml`
2. RSS feed
3. `robots.txt`

Together, they help search engines and users discover content efficiently.

---

## Implementing Sitemap in Next.js App Router

Next.js App Router allows generating a sitemap using a simple function.

### What my sitemap includes
- Home page
- About page
- Blog index
- Individual blog posts (generated from Markdown files)

Instead of hardcoding URLs, I read blog slugs directly from the filesystem.  
This ensures the sitemap stays updated automatically whenever I add a new blog.

---

## RSS Feed for Blog Updates

RSS feeds are underrated, but still incredibly useful.

They allow:
- Content subscriptions
- Feed readers
- Automated aggregators

### How I built it
- Used a route handler (`app/rss/route.ts`)
- Read blog metadata
- Sorted posts by publish date
- Returned XML instead of JSON

This keeps the feed lightweight and standards-compliant.

---

## Robots.txt Configuration

The `robots.txt` file tells search engines how to crawl your site.

I configured it to:
- Allow all public pages
- Point crawlers to the sitemap
- Avoid blocking content unnecessarily

This ensures maximum discoverability without risking crawl issues.

---

## Real Problems I Faced (and How I Fixed Them)

This part mattered the most.

### ❌ Importing shared values from route files
At first, I tried importing `baseUrl` from `sitemap.ts` and `rss` routes.

That caused build failures because:
- Route files are entry points
- They are not meant to be shared modules

### ✅ The fix
I moved shared values like `baseUrl` into a dedicated config file and imported it everywhere.

---

### ❌ Filesystem path issues on deployment
My local build worked, but Vercel failed.

The reason:
- Linux file systems are case-sensitive
- Windows is not

### ✅ The fix
I made sure all folder names and imports matched exactly.

---

### ❌ Invalid dates from Markdown front-matter
One blog caused a runtime crash due to an invalid date.

The fix was simple:
- Standardize metadata fields
- Validate dates before formatting

This made the system more robust.

---

## Lessons Learned

From implementing SEO manually, I learned that:
- SEO is part of system design, not marketing
- Small mistakes can break builds
- Shared configuration matters a lot
- Testing on production-like environments is critical

---

## What I’d Improve Next

- Add Open Graph images
- Add structured data (JSON-LD)
- Track blog impressions
- Improve RSS metadata

These are easy extensions now that the foundation is solid.

---

## Final Thoughts

Implementing sitemap, RSS, and robots.txt taught me more about **how the web actually works** than most tutorials ever did.

SEO isn’t magic — it’s engineering.

And once it’s set up properly, it quietly works in the background while you focus on building.
