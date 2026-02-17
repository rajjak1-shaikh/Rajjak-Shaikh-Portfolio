"use client"

import { usePathname } from "next/navigation"

export default function PageWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isBlog = pathname.startsWith("/blog")

  return (
    <main className="w-full min-h-screen flex flex-col">
      {children}
    </main >
  )
}
