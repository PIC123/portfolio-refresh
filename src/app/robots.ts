import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Reachable by direct URL (and by Google's OAuth reviewers, who are
        // not crawlers), but kept out of search indexes.
        disallow: ["/oauth"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
