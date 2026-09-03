import type { MetadataRoute } from "next";

/*
 * Generated alongside the sitemap so the two can never drift apart.
 *
 * Nothing is disallowed on purpose: Googlebot has to fetch /_next/ to get the
 * CSS and JS it needs to render the page, and blocking those is a documented
 * way to get a JS-heavy site rendered wrongly or judged as mobile-unfriendly.
 */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://kavishkadeshan.dev/sitemap.xml",
    host: "https://kavishkadeshan.dev",
  };
}
