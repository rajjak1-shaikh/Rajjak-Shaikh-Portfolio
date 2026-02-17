import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { remark } from "remark"
import html from "remark-html"
import Link from "next/link"

function formatDate(date: string | Date) {
  const d = new Date(date)
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default async function BlogSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const filePath = path.join(
    process.cwd(),
    "app/blog/content",
    `${slug}.md`
  )

  if (!fs.existsSync(filePath)) {
    return (
      <section className="pt-28 px-6">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
            Blog not found
          </h1>
        </div>
      </section>
    )
  }

  const fileContent = fs.readFileSync(filePath, "utf8")
  const { data, content } = matter(fileContent)

  const processedContent = await remark()
    .use(html)
    .process(content)

  return (
    <section className="min-h-screen text-[var(--text-primary)] selection:bg-indigo-500/30">

      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[hsl(var(--primary)/0.05)] rounded-full blur-[100px] opacity-40" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[hsl(var(--secondary)/0.05)] rounded-full blur-[100px] opacity-40" />
      </div>

      <div className="relative z-10 pt-32 px-6 max-w-4xl mx-auto">

        {/* BACK LINK */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-12 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Blog
        </Link>

        {/* HEADER */}
        <header className="mb-16 text-center">
          <div className="mb-6 flex justify-center">
            <span className="px-3 py-1 rounded-full glass text-xs font-medium text-[var(--text-accent)]">
              {formatDate(data.date)}
            </span>
          </div>

          <h1
            className="text-4xl md:text-6xl font-bold tracking-tight text-[var(--text-primary)] mb-8 leading-tight"
            style={{ fontFamily: "'Syne', system-ui, sans-serif" }}
          >
            {data.title}
          </h1>

          {/* Tags if available in data */}
          {data.tags && (
            <div className="flex flex-wrap justify-center gap-2">
              {data.tags.map((tag: string) => (
                <span key={tag} className="text-sm text-[var(--text-tertiary)]">#{tag}</span>
              ))}
            </div>
          )}
        </header>

        {/* CONTENT */}
        <article className="prose prose-invert prose-lg prose-neutral max-w-none glass rounded-3xl p-8 md:p-12">
          <div
            dangerouslySetInnerHTML={{
              __html: processedContent.toString(),
            }}
          />
        </article>

        {/* FOOTER */}
        <div className="mt-20 border-t border-[var(--glass-border)] pt-10 pb-20 text-center">
          <p className="text-[var(--text-tertiary)] mb-6">Enjoyed this article?</p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-semibold hover:opacity-90 transition-colors"
          >
            Read more articles
          </Link>
        </div>

      </div>
    </section>
  )
}
