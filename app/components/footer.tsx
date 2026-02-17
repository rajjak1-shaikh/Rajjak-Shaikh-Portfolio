import Link from "next/link"
import { Github, Twitter, Linkedin } from "lucide-react"

import { Container } from "@/app/components/ui/section"
import { Separator } from "@/app/components/ui/separator"

const socialLinks = [
  { href: "https://github.com/KrishnaJadhav2525", icon: Github, label: "GitHub" },
  { href: "https://x.com/krlshn444", icon: Twitter, label: "Twitter" },
  { href: "https://www.linkedin.com/in/krishna-jadhav-a5122a316/", icon: Linkedin, label: "LinkedIn" },
]

export default function Footer() {
  return (
    <footer className="border-t border-[var(--glass-border)] bg-transparent pt-20 pb-10">
      <Container>
        <div className="grid md:grid-cols-4 gap-12 mb-20">
          {/* BRAND */}
          <div className="md:col-span-2">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-[var(--text-primary)]"
              style={{ fontFamily: "'Syne', system-ui, sans-serif" }}
            >
              Krishna<span className="text-[var(--text-tertiary)]">.</span>
            </Link>
            <p className="mt-6 text-[var(--text-secondary)] text-sm leading-relaxed max-w-sm">
              Engineering sleek, high-performance web applications with a focus on AI integration and modern user experiences.
            </p>
          </div>

          {/* SITEMAP */}
          <div>
            <h4 className="text-xs font-semibold tracking-wider text-[var(--text-primary)] mb-6 uppercase">Sitemap</h4>
            <ul className="space-y-4 text-sm text-[var(--text-secondary)]">
              <li><Link href="/" className="hover:text-[var(--text-primary)] transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-[var(--text-primary)] transition-colors">About</Link></li>
              <li><Link href="/blog" className="hover:text-[var(--text-primary)] transition-colors">Blog</Link></li>
              <li><Link href="/#projects" className="hover:text-[var(--text-primary)] transition-colors">Projects</Link></li>
              <li><Link href="/rss" className="hover:text-[var(--text-primary)] transition-colors">RSS</Link></li>
            </ul>
          </div>

          {/* SOCIAL */}
          <div>
            <h4 className="text-xs font-semibold tracking-wider text-[var(--text-primary)] mb-6 uppercase">Connect</h4>
            <div className="flex gap-2">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-2.5 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)] transition-all duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>

            <div className="mt-8">
              <Link href="/#contact" className="text-sm text-[var(--text-primary)] hover:text-[var(--text-accent)] transition-colors">
                Get in touch →
              </Link>
            </div>
          </div>
        </div>

        <Separator className="my-8 opacity-50" />

        {/* BOTTOM */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[var(--text-tertiary)]">
            © {new Date().getFullYear()} Krishna Jadhav.
          </p>
          <p className="text-xs text-[var(--text-tertiary)] font-mono">
            Next.js • Tailwind • Vercel
          </p>
        </div>
      </Container>
    </footer>
  )
}
