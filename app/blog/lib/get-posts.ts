import fs from "fs"
import path from "path"
import matter from "gray-matter"

const BLOG_DIR = path.join(process.cwd(), "app/blog/content")

export interface BlogPost {
  slug: string
  title: string
  date: string
  tags: string[]
  description: string
}

export function getAllPosts(): BlogPost[] {
  const files = fs.readdirSync(BLOG_DIR)

  return files
    .filter(file => file.endsWith(".md"))
    .map(file => {
      const slug = file.replace(".md", "")
      const filePath = path.join(BLOG_DIR, file)
      const content = fs.readFileSync(filePath, "utf8")
      const { data, content: body } = matter(content)

      return {
        slug,
        title: data.title ?? "Untitled",
        date: data.publishedAt
          ? new Date(data.publishedAt).toISOString().split("T")[0]
          : "",
        tags: data.tags ?? [],
        description:
          body.trim().split("\n").find(Boolean)?.slice(0, 160) ?? "",
      }
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}
