export interface BlogPost {
  title: string
  slug: string
  description: string
  date: string
  tags: string[]
  featured?: boolean
}

export const BLOG_POSTS: BlogPost[] = [
  {
    title: "Building My Portfolio with Next.js",
    slug: "building-my-portfolio-with-nextjs",
    description:
      "How I designed and built my portfolio using Next.js App Router.",
    date: "2026-01-12",
    tags: ["Next.js", "Frontend", "Portfolio"],
    featured: true,
  },
  {
    title: "Getting Started with AI Projects",
    slug: "getting-started-with-ai-projects",
    description:
      "A beginner-friendly guide to building real AI projects.",
    date: "2026-01-10",
    tags: ["AI", "Machine Learning", "Beginner"],
  },
  {
    title: "Why I Chose MongoDB for My Blog",
    slug: "why-i-chose-mongodb-for-my-blog",
    description:
      "Thoughts on schema design and flexibility with MongoDB.",
    date: "2026-01-08",
    tags: ["MongoDB", "Backend", "Databases"],
  },
]
