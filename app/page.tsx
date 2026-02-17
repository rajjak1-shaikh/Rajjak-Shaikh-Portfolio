'use client';

import Link from "next/link"
import { Github, Twitter, Linkedin } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import ProjectCarousel from "@/app/components/project-carousel"
import Skills from "@/app/components/skills"
import { Container } from "@/app/components/ui/section"
import { FadeIn } from "@/app/components/ui/fade-in"
import { ContactSection } from "@/app/components/contact-section"

const socialLinks = [
  { href: "https://github.com/KrishnaJadhav2525", icon: Github, label: "GitHub" },
  { href: "https://x.com/krlshn444", icon: Twitter, label: "Twitter" },
  { href: "https://www.linkedin.com/in/krishna-jadhav-a5122a316/", icon: Linkedin, label: "LinkedIn" },
]

// Hook for scroll-triggered animations
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect(); // Only animate once
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
}

export default function Page() {
  // Scroll animation refs
  const heroSection = useInView();
  const skillsSection = useInView(0.2);
  const contactSection = useInView(0.2);

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* AURORA BACKGROUND EFFECT */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Primary gradient blob */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-[hsl(var(--primary)/0.2)] via-[hsl(var(--secondary)/0.1)] to-transparent rounded-full blur-3xl animate-aurora-1" />
        {/* Secondary gradient blob */}
        <div className="absolute -top-20 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[hsl(var(--primary)/0.15)] via-[hsl(var(--ring)/0.05)] to-transparent rounded-full blur-3xl animate-aurora-2" />
        {/* Accent blob */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-[hsl(var(--secondary)/0.1)] via-[hsl(var(--primary)/0.05)] to-[hsl(var(--secondary)/0.1)] rounded-full blur-3xl animate-aurora-3" />
      </div>



      {/* HERO - Replaced manual animation with FadeIn */}
      <FadeIn className="min-h-[85vh] flex flex-col items-center justify-center text-center px-4 pt-32 md:pt-40" delay={0.1}>
        {/* HEADLINE WITH GRADIENT & GLOW */}
        <div className="relative mb-8 max-w-4xl mx-auto">
          <div className="absolute inset-0 blur-[100px] bg-[hsl(var(--primary)/0.2)] pointer-events-none" />
          <h1
            className="relative z-10 text-5xl md:text-6xl xl:text-8xl font-bold tracking-tight leading-tight text-[var(--text-primary)] drop-shadow-2xl"
            style={{ fontFamily: "'Syne', system-ui, sans-serif" }}
          >
            Krishna <span className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))]">Jadhav</span>
          </h1>
        </div>

        <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mb-12 leading-relaxed">
          Full Stack Developer & AI Engineer crafting <span className="text-[var(--text-primary)] font-medium">high-performance</span> digital experiences.
        </p>

        {/* BUTTONS */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-20">
          {/* Primary Button */}
          <div className="p-[1px] rounded-full bg-gradient-to-r from-[hsl(var(--primary))] via-[hsl(var(--secondary))] to-[hsl(var(--primary))] bg-[length:200%_auto] hover:animate-gradient-x transition-all duration-300 shadow-[0_0_20px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)]">
            <Link
              href="/blog"
              className="group relative inline-flex items-center gap-2 px-8 py-4 text-lg font-medium bg-[hsl(var(--background))] rounded-full text-[var(--text-primary)] overflow-hidden transition-all hover:opacity-90"
            >
              <span className="relative z-10 flex items-center gap-2">Read My Blogs <span className="group-hover:translate-x-1 transition-transform">→</span></span>
            </Link>
          </div>

          <Link
            href="#contact"
            className="group px-8 py-4 text-lg font-medium glass rounded-full text-[var(--text-primary)] hover:scale-105 transition-all"
          >
            Let's connect
          </Link>
        </div>

        {/* SOCIAL ICONS */}
        <div className="flex gap-6 mb-24">
          {socialLinks.map(({ href, icon: Icon, label }, index) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="p-3 rounded-full glass text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:scale-110 transition-all duration-300"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <Icon size={22} />
            </a>
          ))}
        </div>

        {/* SCROLL */}
        <a
          href="#projects"
          className="flex flex-col items-center gap-3 text-xs tracking-[0.2em] uppercase text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors duration-300 animate-bounce"
        >
          <span>Scroll</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
          </svg>
        </a>
      </FadeIn>

      {/* FEATURED PROJECTS - Carousel */}
      <section
        id="projects"
        className="py-20 px-4 sm:px-8 scroll-mt-24 border-t border-[var(--glass-border)]"
      >
        <FadeIn>
          <p className="text-sm text-[var(--text-tertiary)] mb-4 tracking-widest">
            SELECTED WORK
          </p>

          <h2
            className="text-3xl md:text-4xl font-semibold tracking-tight mb-12 text-[var(--text-primary)]"
            style={{ fontFamily: "'Syne', system-ui, sans-serif" }}
          >
            Featured Projects
          </h2>
        </FadeIn>

        <FadeIn delay={0.2} fullWidth>
          <ProjectCarousel />
        </FadeIn>
      </section>

      {/* SKILLS */}
      <FadeIn>
        <Skills />
      </FadeIn>

      {/* CONTACT */}
      <ContactSection />
    </section>
  )
}
