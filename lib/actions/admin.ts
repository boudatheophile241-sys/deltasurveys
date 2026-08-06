"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export type AdminState = { error?: string; success?: boolean } | null;

/** Verifie que l'utilisateur courant est admin. Renvoie le client Supabase. */
async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase: null, ok: false as const };
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  return { supabase, ok: profile?.role === "admin" };
}

const productSchema = z.object({
  name: z.string().min(2, "Nom requis"),
  price: z.coerce.number().min(0, "Prix invalide"),
  category_id: z.string().uuid("Categorie requise"),
  brand_id: z.string().uuid("Marque requise"),
});

function parseSpecs(raw: string): { label: string; value: string }[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const idx = line.indexOf(":");
      if (idx === -1) return { label: line, value: "" };
      return {
        label: line.slice(0, idx).trim(),
        value: line.slice(idx + 1).trim(),
      };
    });
}

/** Cree ou met a jour un produit (selon la presence de l'id). */
export async function saveProduct(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  const { supabase, ok } = await requireAdmin();
  if (!ok || !supabase) return { error: "Acces non autorise." };

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    price: formData.get("price"),
    category_id: formData.get("category_id"),
    brand_id: formData.get("brand_id"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const id = (formData.get("id") as string) || null;
  const slugInput = (formData.get("slug") as string)?.trim();
  const slug = slugInput ? slugify(slugInput) : slugify(parsed.data.name);
  const stockQty = Number(formData.get("stock_qty") ?? 0);

  const badges: string[] = [];
  if (formData.get("badge_nouveau")) badges.push("Nouveau");
  if (formData.get("badge_promo")) badges.push("Promo");
  if (formData.get("badge_top")) badges.push("Top Vente");

  const oldPriceRaw = formData.get("old_price");
  const oldPrice = oldPriceRaw ? Number(oldPriceRaw) : null;

  const images = ((formData.get("images") as string) || "")
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const payload = {
    name: parsed.data.name,
    slug,
    brand_id: parsed.data.brand_id,
    category_id: parsed.data.category_id,
    price: parsed.data.price,
    old_price: oldPrice && oldPrice > 0 ? oldPrice : null,
    stock_qty: stockQty,
    in_stock: stockQty > 0 || formData.get("in_stock") === "on",
    warranty: (formData.get("warranty") as string) || null,
    delivery: (formData.get("delivery") as string) || null,
    icon: (formData.get("icon") as string) || "Package",
    accent: (formData.get("accent") as string) || "navy",
    short_description: (formData.get("short_description") as string) || null,
    description: (formData.get("description") as string) || null,
    specs: parseSpecs((formData.get("specs") as string) || ""),
    images,
    is_featured: formData.get("is_featured") === "on",
    updated_at: new Date().toISOString(),
  };

  if (id) {
    const { error } = await supabase.from("products").update(payload).eq("id", id);
    if (error) {
      return {
        error: error.message.includes("duplicate")
          ? "Ce slug existe deja."
          : "Enregistrement impossible.",
      };
    }
  } else {
    const { error } = await supabase.from("products").insert(payload);
    if (error) {
      return {
        error: error.message.includes("duplicate")
          ? "Ce slug existe deja."
          : "Creation impossible.",
      };
    }
  }

  revalidatePath("/admin/produits");
  revalidatePath("/produits");
  revalidatePath("/");
  redirect("/admin/produits");
}

export async function deleteProduct(formData: FormData) {
  const { supabase, ok } = await requireAdmin();
  if (!ok || !supabase) return;
  const id = formData.get("id") as string;
  if (!id) return;
  await supabase.from("products").delete().eq("id", id);
  revalidatePath("/admin/produits");
  revalidatePath("/produits");
  revalidatePath("/");
}

export async function toggleFeatured(formData: FormData) {
  const { supabase, ok } = await requireAdmin();
  if (!ok || !supabase) return;
  const id = formData.get("id") as string;
  const current = formData.get("current") === "true";
  if (!id) return;
  await supabase.from("products").update({ is_featured: !current }).eq("id", id);
  revalidatePath("/admin/produits");
  revalidatePath("/");
}

/* -------------------------------------------------------------------------- */
/*  Mises a jour de statut (devis, messages, commandes)                       */
/* -------------------------------------------------------------------------- */

export async function updateQuoteStatus(id: string, status: string) {
  const { supabase, ok } = await requireAdmin();
  if (!ok || !supabase) return;
  await supabase
    .from("quotes")
    .update({ status: status as "new" | "processing" | "sent" | "closed" })
    .eq("id", id);
  revalidatePath("/admin/devis");
  revalidatePath("/admin");
}

export async function updateMessageStatus(id: string, status: string) {
  const { supabase, ok } = await requireAdmin();
  if (!ok || !supabase) return;
  await supabase
    .from("messages")
    .update({ status: status as "new" | "read" | "replied" })
    .eq("id", id);
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function updateOrderStatus(id: string, status: string) {
  const { supabase, ok } = await requireAdmin();
  if (!ok || !supabase) return;
  await supabase
    .from("orders")
    .update({
      status: status as
        | "pending"
        | "confirmed"
        | "shipped"
        | "delivered"
        | "cancelled",
    })
    .eq("id", id);
  revalidatePath("/admin/commandes");
  revalidatePath("/admin");
}

/* -------------------------------------------------------------------------- */
/*  Categories (CRUD)                                                          */
/* -------------------------------------------------------------------------- */

const categorySchema = z.object({
  name: z.string().min(2, "Nom requis"),
  description: z.string().optional(),
  icon: z.string().optional(),
  accent: z.string().optional(),
});

export async function saveCategory(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  const { supabase, ok } = await requireAdmin();
  if (!ok || !supabase) return { error: "Acces non autorise." };

  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    icon: formData.get("icon"),
    accent: formData.get("accent"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const id = (formData.get("id") as string) || null;
  const payload = {
    name: parsed.data.name,
    slug: slugify((formData.get("slug") as string) || parsed.data.name),
    description: parsed.data.description || null,
    icon: parsed.data.icon || "Boxes",
    accent: parsed.data.accent || "navy",
  };

  const { error } = id
    ? await supabase.from("categories").update(payload).eq("id", id)
    : await supabase.from("categories").insert(payload);
  if (error) {
    return {
      error: error.message.includes("duplicate")
        ? "Ce slug existe deja."
        : "Enregistrement impossible.",
    };
  }
  revalidatePath("/admin/categories");
  revalidatePath("/produits");
  revalidatePath("/");
  redirect("/admin/categories");
}

export async function deleteCategory(formData: FormData) {
  const { supabase, ok } = await requireAdmin();
  if (!ok || !supabase) return;
  const id = formData.get("id") as string;
  if (!id) return;
  await supabase.from("categories").delete().eq("id", id);
  revalidatePath("/admin/categories");
  revalidatePath("/");
}

/* -------------------------------------------------------------------------- */
/*  Marques (CRUD)                                                             */
/* -------------------------------------------------------------------------- */

const brandSchema = z.object({
  name: z.string().min(1, "Nom requis"),
  origin: z.string().optional(),
  monogram: z.string().optional(),
});

export async function saveBrand(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  const { supabase, ok } = await requireAdmin();
  if (!ok || !supabase) return { error: "Acces non autorise." };

  const parsed = brandSchema.safeParse({
    name: formData.get("name"),
    origin: formData.get("origin"),
    monogram: formData.get("monogram"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const id = (formData.get("id") as string) || null;
  const payload = {
    name: parsed.data.name,
    slug: slugify((formData.get("slug") as string) || parsed.data.name),
    origin: parsed.data.origin || null,
    monogram:
      parsed.data.monogram || parsed.data.name.slice(0, 2).toUpperCase(),
    logo: ((formData.get("logo") as string) || "").trim() || null,
  };

  const { error } = id
    ? await supabase.from("brands").update(payload).eq("id", id)
    : await supabase.from("brands").insert(payload);
  if (error) {
    return {
      error: error.message.includes("duplicate")
        ? "Ce slug existe deja."
        : "Enregistrement impossible.",
    };
  }
  revalidatePath("/admin/marques");
  revalidatePath("/");
  redirect("/admin/marques");
}

export async function deleteBrand(formData: FormData) {
  const { supabase, ok } = await requireAdmin();
  if (!ok || !supabase) return;
  const id = formData.get("id") as string;
  if (!id) return;
  await supabase.from("brands").delete().eq("id", id);
  revalidatePath("/admin/marques");
  revalidatePath("/");
}

/* -------------------------------------------------------------------------- */
/*  Services (CRUD)                                                            */
/* -------------------------------------------------------------------------- */

const serviceSchema = z.object({
  title: z.string().min(2, "Titre requis"),
  description: z.string().optional(),
  icon: z.string().optional(),
  accent: z.string().optional(),
});

export async function saveService(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  const { supabase, ok } = await requireAdmin();
  if (!ok || !supabase) return { error: "Accès non autorisé." };

  const parsed = serviceSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    icon: formData.get("icon"),
    accent: formData.get("accent"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const id = (formData.get("id") as string) || null;
  const features = ((formData.get("features") as string) || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const payload = {
    title: parsed.data.title,
    slug: slugify((formData.get("slug") as string) || parsed.data.title),
    description: parsed.data.description || null,
    icon: parsed.data.icon || "Wrench",
    accent: parsed.data.accent || "navy",
    features,
    sort_order: Number(formData.get("sort_order") ?? 0),
  };

  const { error } = id
    ? await supabase.from("services").update(payload).eq("id", id)
    : await supabase.from("services").insert(payload);
  if (error) {
    return {
      error: error.message.includes("duplicate")
        ? "Ce slug existe déjà."
        : "Enregistrement impossible.",
    };
  }
  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/");
  redirect("/admin/services");
}

export async function deleteService(formData: FormData) {
  const { supabase, ok } = await requireAdmin();
  if (!ok || !supabase) return;
  const id = formData.get("id") as string;
  if (!id) return;
  await supabase.from("services").delete().eq("id", id);
  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/");
}

/* -------------------------------------------------------------------------- */
/*  Blog (CRUD)                                                                */
/* -------------------------------------------------------------------------- */

const blogSchema = z.object({
  title: z.string().min(2, "Titre requis"),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  category: z.string().optional(),
  icon: z.string().optional(),
  read_time: z.string().optional(),
});

export async function saveBlogPost(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  const { supabase, ok } = await requireAdmin();
  if (!ok || !supabase) return { error: "Acces non autorise." };

  const parsed = blogSchema.safeParse({
    title: formData.get("title"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    category: formData.get("category"),
    icon: formData.get("icon"),
    read_time: formData.get("read_time"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const id = (formData.get("id") as string) || null;
  const payload = {
    title: parsed.data.title,
    slug: slugify((formData.get("slug") as string) || parsed.data.title),
    excerpt: parsed.data.excerpt || null,
    content: parsed.data.content || null,
    category: parsed.data.category || "Article",
    icon: parsed.data.icon || "Newspaper",
    cover_url: (formData.get("cover_url") as string) || null,
    read_time: parsed.data.read_time || "5 min",
    author: (formData.get("author") as string) || "Delta Surveys",
    published: formData.get("published") === "on",
  };

  const { error } = id
    ? await supabase.from("blog_posts").update(payload).eq("id", id)
    : await supabase.from("blog_posts").insert(payload);
  if (error) {
    return {
      error: error.message.includes("duplicate")
        ? "Ce slug existe deja."
        : "Enregistrement impossible.",
    };
  }
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/");
  redirect("/admin/blog");
}

export async function deleteBlogPost(formData: FormData) {
  const { supabase, ok } = await requireAdmin();
  if (!ok || !supabase) return;
  const id = formData.get("id") as string;
  if (!id) return;
  await supabase.from("blog_posts").delete().eq("id", id);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

/* -------------------------------------------------------------------------- */
/*  Promotions (CRUD)                                                          */
/* -------------------------------------------------------------------------- */

const promoSchema = z.object({
  title: z.string().min(2, "Titre requis"),
  description: z.string().optional(),
  code: z.string().optional(),
  discount_percent: z.coerce.number().min(0).max(100).optional(),
});

export async function savePromotion(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  const { supabase, ok } = await requireAdmin();
  if (!ok || !supabase) return { error: "Acces non autorise." };

  const parsed = promoSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    code: formData.get("code"),
    discount_percent: formData.get("discount_percent") || 0,
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const id = (formData.get("id") as string) || null;
  const starts = (formData.get("starts_at") as string) || "";
  const ends = (formData.get("ends_at") as string) || "";
  const payload = {
    title: parsed.data.title,
    description: parsed.data.description || null,
    code: parsed.data.code || null,
    discount_percent: parsed.data.discount_percent ?? 0,
    active: formData.get("active") === "on",
    starts_at: starts ? new Date(starts).toISOString() : null,
    ends_at: ends ? new Date(ends).toISOString() : null,
  };

  const { error } = id
    ? await supabase.from("promotions").update(payload).eq("id", id)
    : await supabase.from("promotions").insert(payload);
  if (error) return { error: "Enregistrement impossible." };

  revalidatePath("/admin/promotions");
  revalidatePath("/");
  redirect("/admin/promotions");
}

/* -------------------------------------------------------------------------- */
/*  Contenu du site (textes / bannières)                                      */
/* -------------------------------------------------------------------------- */

const SETTING_KEYS = [
  "banner_enabled",
  "banner_text",
  "banner_link",
  "banner_link_label",
  "hero_eyebrow",
  "hero_title",
  "hero_subtitle",
  "site_logo",
  "hero_image",
  "logo_header_size",
  "logo_footer_size",
];

export async function saveSettings(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  const { supabase, ok } = await requireAdmin();
  if (!ok || !supabase) return { error: "Accès non autorisé." };

  const rows = SETTING_KEYS.map((key) => ({
    key,
    value:
      key === "banner_enabled"
        ? formData.get("banner_enabled") === "on"
          ? "true"
          : "false"
        : ((formData.get(key) as string) ?? "").trim(),
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from("site_settings")
    .upsert(rows, { onConflict: "key" });
  if (error) return { error: "Enregistrement impossible." };

  revalidatePath("/", "layout");
  return { success: true };
}

export async function deletePromotion(formData: FormData) {
  const { supabase, ok } = await requireAdmin();
  if (!ok || !supabase) return;
  const id = formData.get("id") as string;
  if (!id) return;
  await supabase.from("promotions").delete().eq("id", id);
  revalidatePath("/admin/promotions");
}
