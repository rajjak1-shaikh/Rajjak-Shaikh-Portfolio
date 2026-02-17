import { getAllPosts } from "./lib/get-posts"
import { BlogPosts } from "./posts"
import { CuratedBlogs } from "./curated"
import { ContactSection } from "@/app/components/contact-section"
import { NewsletterSection } from "./newsletter-section"
import SemanticSearch from "@/app/components/semantic-search"
import { Container } from "@/app/components/ui/section"
import { FadeIn } from "@/app/components/ui/fade-in"

export const metadata = {
  title: "Blog",
  description: "Thoughts on engineering, AI, and what I build.",
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <section className="min-h-screen text-[var(--text-primary)]">

      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[hsl(var(--primary)/0.05)] rounded-full blur-[100px] opacity-40" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[hsl(var(--secondary)/0.05)] rounded-full blur-[100px] opacity-40" />
      </div>

      <Container className="pt-32 relative z-10">

        {/* HEADER */}
        <FadeIn className="mb-12 text-center md:text-left">
          <p className="text-sm font-mono text-[var(--text-accent)] mb-4 tracking-widest uppercase">
            Engineering & Thoughts
          </p>
          <h1
            className="text-5xl md:text-6xl xl:text-7xl font-bold text-[var(--text-primary)] mb-6 tracking-tight"
            style={{ fontFamily: "'Syne', system-ui, sans-serif" }}
          >
            The Blog
          </h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl leading-relaxed md:ml-0 mx-auto">
            Insights on Artificial Intelligence, Software Engineering, and the future of tech.
            Documenting my journey of building and breaking things.
          </p>
        </FadeIn>

        {/* AI-POWERED SEMANTIC SEARCH */}
        <FadeIn className="mb-20" delay={0.1}>
          <SemanticSearch />
        </FadeIn>

        {/* BLOG LIST + SIDEBAR */}
        <FadeIn delay={0.2} className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12 lg:gap-20">

          {/* Main Content */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">Latest Posts</h2>
              <div className="h-px bg-[var(--glass-border)] flex-grow" />
            </div>
            <BlogPosts posts={posts} />
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-32 space-y-12 h-fit">
            <CuratedBlogs />
          </div>
        </FadeIn>

        {/* CONTACT - Client Component */}
        <ContactSection />

        {/* NEWSLETTER - Full Width */}
        <FadeIn className="my-20">
          <div className="rounded-3xl glass p-8 md:p-12">
            <NewsletterSection />
          </div>
        </FadeIn>
      </Container>
    </section>
  )
}