import type { MetadataRoute } from "next";

/*
 * Generated at build time rather than hand-maintained in public/sitemap.xml,
 * so lastModified reflects the actual deploy instead of a date that silently
 * goes stale. Single-page site, so there is exactly one canonical URL.
 */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://kavishkadeshan.dev/",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
