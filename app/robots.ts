import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/connexion", "/inscription", "/panier", "/favoris"],
    },
    sitemap: "https://deltasurveys.com/sitemap.xml",
  };
}
