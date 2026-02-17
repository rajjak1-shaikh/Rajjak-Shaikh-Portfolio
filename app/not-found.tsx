import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="min-h-screen text-[var(--text-primary)] flex items-center justify-center relative overflow-hidden px-6">

      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[hsl(var(--primary)/0.1)] rounded-full blur-[120px] opacity-50" />
      </div>

      <div className="relative z-10 max-w-lg w-full text-center p-12 rounded-3xl glass">
        <h1
          className="text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-[var(--text-primary)] to-[var(--text-tertiary)] mb-6"
          style={{ fontFamily: "'Syne', system-ui, sans-serif" }}
        >
          404
        </h1>
        <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">
          Page Not Found
        </h2>
        <p className="text-[var(--text-secondary)] mb-10 text-lg">
          The page you are looking for has vanished into the digital void.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-semibold hover:opacity-90 transition-all hover:scale-105"
        >
          Return Home
        </Link>
      </div>
    </section>
  )
}
