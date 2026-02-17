import fs from "fs"
import path from "path"
import { baseUrl } from "./blog/lib/site"


export default function sitemap() {
  const blogDir = path.join(process.cwd(), "app/blog/content")

  let blogUrls: { url: string; lastModified: Date }[] = []

  if (fs.existsSync(blogDir)) {
    blogUrls = fs
      .readdirSync(blogDir)
      .filter((file) => file.endsWith(".md"))
      .map((file) => ({
        url: `${baseUrl}/blog/${file.replace(".md", "")}`,
        lastModified: new Date(),
      }))
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
    },
    ...blogUrls,
  ]
}
