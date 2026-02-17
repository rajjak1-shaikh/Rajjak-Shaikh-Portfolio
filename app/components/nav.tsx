'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "./theme-provider"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
]

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2.5 rounded-full glass hover:scale-110 transition-all duration-300"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <motion.div
        animate={{ rotate: theme === "dark" ? 0 : 180 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-5 h-5 relative"
      >
        {/* Sun icon */}
        <svg
          className={`w-5 h-5 absolute inset-0 transition-opacity duration-300 ${theme === "light" ? "opacity-100" : "opacity-0"
            }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        {/* Moon icon */}
        <svg
          className={`w-5 h-5 absolute inset-0 transition-opacity duration-300 ${theme === "dark" ? "opacity-100" : "opacity-0"
            }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </motion.div>
    </button>
  )
}

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <motion.header
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <nav
        className={`
          glass flex items-center justify-between py-2 px-5 rounded-full
          transition-all duration-300
          ${scrolled ? "shadow-xl" : ""}
        `}
      >
        {/* Logo */}
        <Link
          href="/"
          className="text-lg font-bold tracking-tight font-[family-name:var(--font-display)] text-[var(--text-primary)] hover:opacity-80 transition-opacity"
          style={{ fontFamily: "'Syne', system-ui, sans-serif" }}
        >
          Krishna<span className="text-[var(--text-tertiary)]">.</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href || (href !== "/" && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={`
                  relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300
                  ${isActive
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }
                `}
              >
                {isActive && (
                  <motion.span
                    layoutId="navbar-active"
                    className="absolute inset-0 rounded-full bg-[var(--surface-raised)]"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {label}
              </Link>
            )
          })}
          <div className="w-px h-5 bg-[var(--glass-border)] mx-2" />
          <ThemeToggle />
        </div>

        {/* Mobile: Theme Toggle + Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2.5 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            aria-label="Toggle menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <motion.path
                d={mobileOpen ? "M6 6L18 18" : "M4 7h16"}
                animate={{ d: mobileOpen ? "M6 6L18 18" : "M4 7h16" }}
                transition={{ duration: 0.2 }}
              />
              <motion.path
                d={mobileOpen ? "M6 18L18 6" : "M4 17h16"}
                animate={{
                  d: mobileOpen ? "M6 18L18 6" : "M4 17h16",
                  opacity: 1
                }}
                transition={{ duration: 0.2 }}
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mt-3 glass rounded-2xl p-4 overflow-hidden"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map(({ href, label }) => {
                const isActive = pathname === href || (href !== "/" && pathname.startsWith(href))
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`
                      px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300
                      ${isActive
                        ? "text-[var(--text-primary)] bg-[var(--surface-raised)]"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]"
                      }
                    `}
                  >
                    {label}
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
