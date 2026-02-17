import { baseUrl } from "./blog/lib/site"

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
