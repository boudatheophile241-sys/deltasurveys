"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type LeadState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string }
  | null;

const contactSchema = z.object({
  name: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  phone: z.string().min(4, "Telephone requis"),
  subject: z.string().min(2, "Sujet requis"),
  message: z.string().min(5, "Message trop court"),
});

/** Enregistre un message de contact (table messages, insertion publique). */
export async function submitMessage(
  _prev: LeadState,
  formData: FormData,
): Promise<LeadState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email") ?? "",
    phone: formData.get("phone"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("messages").insert({
    name: parsed.data.name,
    email: parsed.data.email || null,
    phone: parsed.data.phone,
    subject: parsed.data.subject,
    message: parsed.data.message,
  });
  if (error) return { status: "error", message: "Envoi impossible. Reessayez." };

  return {
    status: "success",
    message: "Message envoye ! Notre equipe vous repond sous 24h.",
  };
}

/** Enregistre une demande de devis (table quotes). Lie le produit et l'utilisateur si connus. */
export async function submitQuote(
  _prev: LeadState,
  formData: FormData,
): Promise<LeadState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email") ?? "",
    phone: formData.get("phone"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let productId: string | null = null;
  const productSlug = formData.get("productSlug") as string | null;
  if (productSlug) {
    const { data: product } = await supabase
      .from("products")
      .select("id")
      .eq("slug", productSlug)
      .maybeSingle();
    productId = product?.id ?? null;
  }

  const { error } = await supabase.from("quotes").insert({
    user_id: user?.id ?? null,
    name: parsed.data.name,
    email: parsed.data.email || null,
    phone: parsed.data.phone,
    subject: parsed.data.subject,
    message: parsed.data.message,
    product_id: productId,
  });
  if (error) return { status: "error", message: "Envoi impossible. Reessayez." };

  return {
    status: "success",
    message: "Demande de devis envoyee ! Nous revenons vers vous sous 24h.",
  };
}

/** Inscrit un email a la newsletter (idempotent). */
export async function subscribeNewsletter(
  _prev: LeadState,
  formData: FormData,
): Promise<LeadState> {
  const email = String(formData.get("email") ?? "");
  const valid = z.string().email().safeParse(email);
  if (!valid.success) {
    return { status: "error", message: "Adresse email invalide." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .upsert({ email }, { onConflict: "email", ignoreDuplicates: true });
  if (error) return { status: "error", message: "Inscription impossible." };

  return { status: "success", message: "Merci ! Vous etes bien inscrit." };
}
