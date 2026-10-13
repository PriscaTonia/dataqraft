import type { MetadataRoute } from "next"

import { site } from "@/lib/content"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: "2026-10-13",
      changeFrequency: "monthly",
      priority: 1,
    },
  ]
}
