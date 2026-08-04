"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type FavoriteResult =
  | { status: "ok"; favorite: boolean }
  | { status: "unauth" }
  | { status: "error" };

/** Bascule un produit dans les favoris de l'utilisateur connecte. */
export async function toggleFavorite(productId: string): Promise<FavoriteResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "unauth" };

  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase.from("favorites").delete().eq("id", existing.id);
    if (error) return { status: "error" };
    revalidatePath("/compte/favoris");
    revalidatePath("/compte");
    return { status: "ok", favorite: false };
  }

  const { error } = await supabase
    .from("favorites")
    .insert({ user_id: user.id, product_id: productId });
  if (error) return { status: "error" };
  revalidatePath("/compte/favoris");
  revalidatePath("/compte");
  return { status: "ok", favorite: true };
}
