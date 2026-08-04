"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const profileSchema = z.object({
  fullName: z.string().min(2, "Nom complet requis"),
  phone: z.string().optional(),
});

export type ActionState = { error?: string; success?: string } | null;

export async function updateProfile(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = profileSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Session expiree." };

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: parsed.data.fullName, phone: parsed.data.phone ?? null })
    .eq("id", user.id);

  if (error) return { error: "Impossible de mettre a jour le profil." };

  revalidatePath("/compte", "layout");
  return { success: "Profil mis a jour avec succes." };
}

export async function removeFavorite(formData: FormData) {
  const productId = formData.get("product_id") as string;
  if (!productId) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("favorites")
    .delete()
    .eq("user_id", user.id)
    .eq("product_id", productId);

  revalidatePath("/compte/favoris");
}

export async function markAllNotificationsRead() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", user.id)
    .eq("read", false);

  revalidatePath("/compte/notifications");
  revalidatePath("/compte");
}
