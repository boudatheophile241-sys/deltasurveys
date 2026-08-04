"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const loginSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
  redirect: z.string().optional(),
});

const registerSchema = z.object({
  fullName: z.string().min(2, "Nom complet requis"),
  phone: z.string().min(6, "Telephone requis"),
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caracteres"),
});

export type AuthState = { error?: string; success?: string } | null;

export async function login(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    redirect: formData.get("redirect") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: "Email ou mot de passe incorrect." };
  }

  revalidatePath("/", "layout");
  redirect(parsed.data.redirect || "/compte");
}

export async function register(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = registerSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
        phone: parsed.data.phone,
      },
    },
  });

  if (error) {
    if (error.message.toLowerCase().includes("already")) {
      return { error: "Un compte existe deja avec cet email." };
    }
    return { error: "Impossible de creer le compte. Reessayez." };
  }

  // Si la confirmation email est desactivee, l'utilisateur est connecte directement.
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      success:
        "Compte cree. Verifiez votre boite mail pour confirmer votre adresse, puis connectez-vous.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/compte");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
