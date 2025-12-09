import type { MetadataRoute } from "next";

const SITE_DOMAIN = "https://kamidev.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${SITE_DOMAIN}/sitemap.xml`,
  };
}
