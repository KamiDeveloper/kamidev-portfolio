import type { MetadataRoute } from "next";

const SITE_DOMAIN = "https://kamidev.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // Base routes - add more as the site grows
  const routes: MetadataRoute.Sitemap = [
    {
      url: SITE_DOMAIN,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    // Future routes example:
    // {
    //   url: `${SITE_DOMAIN}/projects`,
    //   lastModified,
    //   changeFrequency: "weekly",
    //   priority: 0.8,
    // },
    // {
    //   url: `${SITE_DOMAIN}/blog`,
    //   lastModified,
    //   changeFrequency: "weekly",
    //   priority: 0.7,
    // },
  ];

  return routes;
}
