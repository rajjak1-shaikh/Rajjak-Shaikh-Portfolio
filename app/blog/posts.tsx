"use client"

import { useState } from "react"
import Link from "next/link"
import type { BlogPost } from "./lib/get-posts"

type Props = {
  posts: BlogPost[]
}

export function BlogPosts({ posts }: Props) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPosts = posts.filter((post) => {
    const query = searchQuery.toLowerCase()
    return (
      post.title.toLowerCase().includes(query) ||
      post.description.toLowerCase().includes(query) ||
      post.tags.some((tag) => tag.toLowerCase().includes(query))
    )
  })

  return (
    <div className="space-y-8">
      {/* LOCAL FILTER INPUT */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-[var(--text-tertiary)] group-focus-within:text-[var(--text-accent)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Filter posts by keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full glass-input rounded-xl pl-12 pr-4 py-4 text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--ring))] transition-all"
        />
      </div>

      {/* POSTS */}
      <div className="grid gap-6">
        {filteredPosts.map((post, index) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="relative p-8 rounded-3xl glass transition-all duration-300 hover:scale-[1.01] overflow-hidden">

              {/* Hover Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--primary)/0.1)] via-[hsl(var(--secondary)/0.1)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* TITLE + ARROW */}
              <div className="flex items-start justify-between gap-6 mb-4 relative z-10">
                <h2 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight transition group-hover:text-[var(--text-accent)]">
                  {post.title}
                </h2>
                <span className="p-2 rounded-full bg-[var(--surface-raised)] border border-[var(--glass-border)] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-all transform group-hover:-rotate-45">
                  →
                </span>
              </div>

              {/* DESCRIPTION */}
              <p className="mb-6 max-w-2xl text-base text-[var(--text-secondary)] leading-relaxed group-hover:text-[var(--text-primary)] transition-colors relative z-10">
                {post.description}
              </p>

              {/* META */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--text-tertiary)] relative z-10">
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  {post.date}
                </span>

                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-full bg-[var(--surface-raised)] border border-[var(--glass-border)] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}

        {filteredPosts.length === 0 && (
          <div className="py-20 text-center rounded-3xl border border-dashed border-[var(--glass-border)] bg-[var(--surface-raised)]">
            <p className="text-[var(--text-secondary)] text-lg mb-2">No posts found matching &ldquo;{searchQuery}&rdquo;</p>
            <p className="text-[var(--text-tertiary)] text-sm">Try searching for a different keyword or topic.</p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-6 px-6 py-2 text-sm text-[var(--text-accent)] border border-[hsl(var(--primary)/0.3)] rounded-full hover:bg-[hsl(var(--primary)/0.1)] transition-colors"
            >
              Clear filter
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
