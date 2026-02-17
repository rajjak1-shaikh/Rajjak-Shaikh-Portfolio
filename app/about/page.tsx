'use client';

import Link from "next/link"
import { Github, Twitter, Linkedin } from "lucide-react"
import { Container } from "@/app/components/ui/section"
import { FadeIn } from "@/app/components/ui/fade-in"
import { ContactSection } from "@/app/components/contact-section"

export default function AboutPage() {

  return (
    <section className="min-h-screen text-[var(--text-primary)] selection:bg-indigo-500/30">

      {/* TOP SPACING FOR FIXED NAV */}
      <Container className="pt-32 relative z-10">

        <FadeIn>
          {/* BACK */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-12 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Home
          </Link>

          {/* HEADER */}
          <div id="about" className="mb-12">
            <p className="text-sm font-mono text-[var(--text-accent)] mb-4 tracking-widest uppercase">
              About Me
            </p>

            <h1
              className="text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight text-[var(--text-primary)] mb-6"
              style={{ fontFamily: "'Syne', system-ui, sans-serif" }}
            >
              Krishna Jadhav
            </h1>
            <p className="text-xl text-[var(--text-secondary)] max-w-2xl leading-relaxed">
              Full-Stack Engineer & AI Agent Developer.
            </p>
          </div>

          {/* INTRO CONTENT */}
          <div className="grid md:grid-cols-12 gap-12 mb-24">
            <div className="md:col-span-8 space-y-6 text-lg text-[var(--text-secondary)] leading-relaxed font-light">
              <p>
                I'm a Full-Stack Engineer and AI Developer who enjoys building things that actually work — not just in demos, but in production.
                Over the past couple of years I've shipped a <span className="text-[var(--text-primary)] font-medium">RAG-powered portfolio with semantic search</span>,
                an AI resume matcher, a fully automated <span className="text-[var(--text-primary)] font-medium">AI video generation pipeline</span> orchestrated with n8n,
                and a fraud detection system trained on 6.3M+ records.
              </p>

              <p>
                On the AI side, I work hands-on with <span className="text-[var(--text-primary)] font-medium">LLMs, vector embeddings, RAG, LangChain, and multi-API pipelines</span> —
                integrating Gemini, Pexels, GitHub, and Pinecone to build systems that do real work end-to-end.
                On the full-stack side I'm comfortable across React/Next.js, Django/Flask/Node, and PostgreSQL/MongoDB.
              </p>

              <p>
                I care about <span className="text-[var(--text-primary)] font-medium">clean code, observable systems, and writing software that's easy to hand off</span> —
                and I'm looking for a team where those things matter too.
              </p>

              <div className="pt-4">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-[var(--text-accent)] hover:opacity-80 transition-colors border-b border-[var(--text-accent)]/30 hover:border-[var(--text-accent)] pb-0.5"
                >
                  Read my technical blog <span className="text-xs">→</span>
                </Link>
              </div>
            </div>

            {/* SIDEBAR / STATS */}
            <div className="md:col-span-4 space-y-6">
              <div className="p-6 rounded-2xl glass">
                <h3 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-4">Focus Areas</h3>
                <div className="flex flex-wrap gap-2">
                  {['AI / Agent Systems', 'Full-Stack Dev', 'Data & ML', 'DevOps & Cloud'].map(tag => (
                    <span key={tag} className="px-3 py-1 text-xs font-medium glass rounded-full text-[var(--text-secondary)]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-2xl glass">
                <h3 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-4">Connect</h3>
                <div className="flex gap-4">
                  <a href="https://github.com/KrishnaJadhav2525" target="_blank" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"><Github size={20} /></a>
                  <a href="https://x.com/krlshn444" target="_blank" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"><Twitter size={20} /></a>
                  <a href="https://www.linkedin.com/in/krishna-jadhav-a5122a316/" target="_blank" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"><Linkedin size={20} /></a>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* EXPERIENCE & EDUCATION GRID */}
        <FadeIn delay={0.2}>
          <div className="grid md:grid-cols-2 gap-12 mb-32">

            {/* EXPERIENCE */}
            <div>
              <h2
                className="text-2xl font-bold text-[var(--text-primary)] mb-8 flex items-center gap-3"
                style={{ fontFamily: "'Syne', system-ui, sans-serif" }}
              >
                <span className="w-2 h-2 rounded-full bg-[hsl(var(--primary))]" /> Experience
              </h2>
              <div className="space-y-12 border-l border-[var(--glass-border)] ml-3 pl-8 relative">

                <div className="relative group">
                  <span className="absolute -left-[37px] top-1.5 w-4 h-4 rounded-full border-2 border-[var(--glass-border)] bg-[hsl(var(--background))] group-hover:border-[hsl(var(--primary))] transition-colors" />
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--text-accent)] transition-colors">
                    Database & IT Support
                  </h3>
                  <p className="text-sm text-[var(--text-tertiary)] mb-2 font-mono">
                    Kohinoor Ropes Pvt. Ltd. • May '25 – Aug '25
                  </p>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                    Optimized MySQL queries for data validation and provided on-site IT infrastructure support, ensuring 99% uptime for critical systems.
                  </p>
                </div>

                <div className="relative group">
                  <span className="absolute -left-[37px] top-1.5 w-4 h-4 rounded-full border-2 border-[var(--glass-border)] bg-[hsl(var(--background))] group-hover:border-[hsl(var(--primary))] transition-colors" />
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--text-accent)] transition-colors">
                    Business Development Exec
                  </h3>
                  <p className="text-sm text-[var(--text-tertiary)] mb-2 font-mono">
                    Conglomerate Magazine • Aug '24 – Feb '25
                  </p>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                    Led client requirements gathering and strategic outreach, acting as the technical bridge between clients and the engineering team.
                  </p>
                </div>

              </div>
            </div>

            {/* EDUCATION */}
            <div>
              <h2
                className="text-2xl font-bold text-[var(--text-primary)] mb-8 flex items-center gap-3"
                style={{ fontFamily: "'Syne', system-ui, sans-serif" }}
              >
                <span className="w-2 h-2 rounded-full bg-[hsl(var(--secondary))]" /> Education
              </h2>
              <div className="space-y-12 border-l border-[var(--glass-border)] ml-3 pl-8 relative">

                <div className="relative group">
                  <span className="absolute -left-[37px] top-1.5 w-4 h-4 rounded-full border-2 border-[var(--glass-border)] bg-[hsl(var(--background))] group-hover:border-[hsl(var(--secondary))] transition-colors" />
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-[hsl(var(--secondary))] transition-colors">
                    B.Sc. Computer Science
                  </h3>
                  <p className="text-sm text-[var(--text-tertiary)] mb-2 font-mono">
                    Rajarshi Shahu Mahavidyalaya • 2023 – 2026
                  </p>
                  <p className="text-[var(--text-secondary)] text-sm">
                    CGPA: 7.53/10 • Specialized in Data Structures & AI
                  </p>
                </div>

                <div className="relative group">
                  <span className="absolute -left-[37px] top-1.5 w-4 h-4 rounded-full border-2 border-[var(--glass-border)] bg-[hsl(var(--background))] group-hover:border-[hsl(var(--secondary))] transition-colors" />
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-[hsl(var(--secondary))] transition-colors">
                    Higher Secondary (Science)
                  </h3>
                  <p className="text-sm text-[var(--text-tertiary)] mb-2 font-mono">
                    Maharashtra State Board • 2023
                  </p>
                </div>

              </div>
            </div>
          </div>
        </FadeIn>

        {/* CONTACT FORM */}
        <ContactSection />
      </Container>
    </section>
  )
}