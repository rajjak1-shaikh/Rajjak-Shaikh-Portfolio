import "./global.css"
import type { Metadata } from "next"
import Navbar from "./components/nav"
import Footer from "./components/footer"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { baseUrl } from "./blog/lib/site"
import Script from "next/script"
import { ThemeProvider } from "./components/theme-provider"

import PageWrapper from "./components/page-wrapper"

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Krishna | Legal Tech & Full Stack Developer",
    template: "%s | Krishna",
  },
  description: "Personal portfolio of Krishna, a Full Stack Developer specializing in AI, Legal Tech, and High-Performance Web Applications.",
  openGraph: {
    title: "Krishna | Legal Tech & Full Stack Developer",
    description: "Personal portfolio of Krishna, a Full Stack Developer specializing in AI, Legal Tech, and High-Performance Web Applications.",
    url: baseUrl,
    siteName: "Krishna Portfolio",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: "Krishna",
    card: "summary_large_image",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Krishna",
    "url": baseUrl,
    "jobTitle": "Full Stack Developer",
    "sameAs": [
      "https://github.com/krishna-jadhav",
    ]
  }

  return (
    <html
      lang="en"
      className="bg-[var(--background)] text-[var(--foreground)]"
    >
      <head>
        {/* Anti-FOUC: apply saved theme before paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const t = localStorage.getItem('theme');
                if (t === 'light') document.documentElement.classList.add('light');
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col relative">
        {/* JSON-LD for SEO */}
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <ThemeProvider>
          {/* NAVBAR — FULL WIDTH */}
          <div className="px-6 md:px-12">
            <Navbar />
          </div>

          {/* PAGE CONTENT (WIDTH CONTROLLED INSIDE) */}
          <PageWrapper>
            {children}
            <Footer />
          </PageWrapper>
        </ThemeProvider>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
