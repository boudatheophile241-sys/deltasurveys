import { createClient } from "@/lib/supabase/server";
import type { Product, Category, Brand, BlogPost, Badge, Service } from "@/lib/data";
import {
  products as fallbackProducts,
  categories as fallbackCategories,
  brands as fallbackBrands,
  blogPosts as fallbackPosts,
  services as fallbackServices,
} from "@/lib/data";

/* -------------------------------------------------------------------------- */
/*  Mappers : rangees DB -> types UI                                          */
/* -------------------------------------------------------------------------- */

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  price: number;
  old_price: number | null;
  rating: number | null;
  reviews: number | null;
  in_stock: boolean | null;
  warranty: string | null;
  delivery: string | null;
  badges: string[] | null;
  icon: string | null;
  accent: string | null;
  short_description: string | null;
  specs: unknown;
  images: string[] | null;
  brands: { name: string } | null;
  categories: { slug: string } | null;
};

function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brands?.name ?? "",
    category: row.categories?.slug ?? "",
    price: Number(row.price),
    oldPrice: row.old_price ? Number(row.old_price) : undefined,
    rating: Number(row.rating ?? 0),
    reviews: row.reviews ?? 0,
    inStock: row.in_stock ?? true,
    warranty: row.warranty ?? "",
    delivery: row.delivery ?? "",
    badges: (row.badges ?? []) as Badge[],
    icon: row.icon ?? "Package",
    accent: (row.accent ?? "navy") as Product["accent"],
    shortDescription: row.short_description ?? "",
    specs: Array.isArray(row.specs)
      ? (row.specs as { label: string; value: string }[])
      : [],
    images: row.images ?? [],
    image: row.images?.[0],
  };
}

const PRODUCT_SELECT =
  "id,slug,name,price,old_price,rating,reviews,in_stock,warranty,delivery,badges,icon,accent,short_description,specs,images,brands(name),categories(slug)";

/* -------------------------------------------------------------------------- */
/*  Produits                                                                  */
/* -------------------------------------------------------------------------- */

export async function getProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .order("created_at", { ascending: true });
    if (error || !data) return fallbackProducts;
    return (data as unknown as ProductRow[]).map(mapProduct);
  } catch {
    return fallbackProducts;
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("is_featured", true)
      .limit(4);
    if (error || !data || data.length === 0) return fallbackProducts.slice(0, 4);
    return (data as unknown as ProductRow[]).map(mapProduct);
  } catch {
    return fallbackProducts.slice(0, 4);
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("slug", slug)
      .maybeSingle();
    if (error || !data) {
      return fallbackProducts.find((p) => p.slug === slug) ?? null;
    }
    return mapProduct(data as unknown as ProductRow);
  } catch {
    return fallbackProducts.find((p) => p.slug === slug) ?? null;
  }
}

export async function getRelatedProducts(
  categorySlug: string,
  excludeSlug: string,
): Promise<Product[]> {
  const all = await getProducts();
  const related = all.filter(
    (p) => p.category === categorySlug && p.slug !== excludeSlug,
  );
  const list = related.length > 0 ? related : all.filter((p) => p.slug !== excludeSlug);
  return list.slice(0, 3);
}

/* -------------------------------------------------------------------------- */
/*  Categories & marques                                                      */
/* -------------------------------------------------------------------------- */

export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("slug,name,description,icon,accent")
      .order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) return fallbackCategories;

    const { data: prods } = await supabase
      .from("products")
      .select("category_id,categories(slug)");
    const counts = new Map<string, number>();
    (prods as unknown as { categories: { slug: string } | null }[] | null)?.forEach(
      (p) => {
        const slug = p.categories?.slug;
        if (slug) counts.set(slug, (counts.get(slug) ?? 0) + 1);
      },
    );

    return data.map((c) => ({
      slug: c.slug,
      name: c.name,
      description: c.description ?? "",
      icon: c.icon ?? "Boxes",
      accent: (c.accent ?? "navy") as Category["accent"],
      count: counts.get(c.slug) ?? 0,
    }));
  } catch {
    return fallbackCategories;
  }
}

export async function getBrands(): Promise<Brand[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("brands")
      .select("name,origin,monogram,logo")
      .order("name", { ascending: true });
    if (error || !data || data.length === 0) return fallbackBrands;
    return data.map((b) => ({
      name: b.name,
      origin: b.origin ?? "",
      monogram: b.monogram ?? b.name.slice(0, 2).toUpperCase(),
      logo: b.logo ?? undefined,
    }));
  } catch {
    return fallbackBrands;
  }
}

/* -------------------------------------------------------------------------- */
/*  Services                                                                  */
/* -------------------------------------------------------------------------- */

export async function getServices(): Promise<Service[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("services")
      .select("slug,title,description,icon,features,accent")
      .order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) return fallbackServices;
    return data.map((s) => ({
      slug: s.slug,
      title: s.title,
      description: s.description ?? "",
      icon: s.icon ?? "Wrench",
      features: s.features ?? [],
      accent: (s.accent ?? "navy") as Service["accent"],
    }));
  } catch {
    return fallbackServices;
  }
}

/* -------------------------------------------------------------------------- */
/*  Blog                                                                      */
/* -------------------------------------------------------------------------- */

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("slug,title,excerpt,content,cover_url,category,author,icon,read_time,published_at")
      .eq("published", true)
      .order("published_at", { ascending: false });
    if (error || !data || data.length === 0) return fallbackPosts;
    return data.map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt ?? "",
      category: p.category ?? "Article",
      date: formatDate(p.published_at),
      readTime: p.read_time ?? "5 min",
      author: p.author ?? "Delta Surveys",
      icon: p.icon ?? "Newspaper",
      content: p.content ?? undefined,
      cover: p.cover_url ?? undefined,
    }));
  } catch {
    return fallbackPosts;
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

/* -------------------------------------------------------------------------- */
/*  Favoris de l'utilisateur courant                                          */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*  Paramètres de contenu (textes / bannières éditables)                      */
/* -------------------------------------------------------------------------- */

export type SiteSettings = Record<string, string>;

const DEFAULT_SETTINGS: SiteSettings = {
  banner_enabled: "false",
  banner_text: "",
  banner_link: "",
  banner_link_label: "",
  hero_eyebrow: "",
  hero_title: "",
  hero_subtitle: "",
  site_logo: "",
  hero_image: "",
  logo_header_size: "80",
  logo_footer_size: "44",
};

/** Renvoie tous les paramètres de contenu du site (map clé -> valeur). */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("site_settings").select("key,value");
    if (error || !data) return { ...DEFAULT_SETTINGS };
    const map: SiteSettings = { ...DEFAULT_SETTINGS };
    for (const row of data) map[row.key] = row.value ?? "";
    return map;
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

/** Renvoie les IDs de produits favoris de l'utilisateur connecte (vide sinon). */
export async function getFavoriteIds(): Promise<string[]> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];
    const { data } = await supabase
      .from("favorites")
      .select("product_id")
      .eq("user_id", user.id);
    return (data ?? []).map((f) => f.product_id);
  } catch {
    return [];
  }
}
