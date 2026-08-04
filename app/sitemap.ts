import type { MetadataRoute } from "next";
import { products, blogPosts, categories } from "@/lib/data";

const BASE = "https://deltasurveys.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/produits",
    "/services",
    "/solutions",
    "/a-propos",
    "/blog",
    "/contact",
    "/devis",
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const productRoutes = products.map((p) => ({
    url: `${BASE}/produits/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const blogRoutes = blogPosts.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const categoryRoutes = categories.map((c) => ({
    url: `${BASE}/produits?categorie=${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes, ...blogRoutes, ...categoryRoutes];
}
