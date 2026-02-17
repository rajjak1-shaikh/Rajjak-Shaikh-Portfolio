import Link from "next/link"
import { BLOG_POSTS } from "./data"

export function CuratedBlogs() {
  const featured = BLOG_POSTS.filter(post => post.featured)

  return (
    <aside className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-2 text-sm font-medium text-white">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-yellow-500/10 text-yellow-400">
          ✨
        </span>
        Curated Blogs
      </div>

      {/* CARDS */}
      <div className="space-y-4">
        {featured.map(post => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 hover:border-emerald-400/40 transition"
          >
            <div className="space-y-2">
              <p className="text-xs text-emerald-400 uppercase tracking-wide">
                Featured
              </p>

              <h3 className="text-sm font-medium text-white leading-snug group-hover:text-emerald-400 transition">
                {post.title}
              </h3>

              <p className="text-xs text-neutral-400 line-clamp-2">
                {post.description}
              </p>

              <div className="pt-2 text-xs text-neutral-500 flex items-center justify-between">
                <span>{post.date}</span>
                <span className="group-hover:translate-x-1 transition">
                  Read →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  )
}
