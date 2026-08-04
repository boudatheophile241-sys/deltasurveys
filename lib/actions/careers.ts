"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { sendEmail, emailShell, CAREERS_NOTIFY_EMAIL } from "@/lib/email";

export type CareerState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string }
  | null;

const schema = z.object({
  full_name: z.string().min(2, "Nom complet requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(4, "Téléphone requis"),
  type: z.enum(["stage", "emploi", "spontanee"]),
  position: z.string().optional(),
  message: z.string().optional(),
});

const TYPE_LABELS: Record<string, string> = {
  stage: "Demande de stage",
  emploi: "Candidature à un emploi",
  spontanee: "Candidature spontanée",
};

type SupabaseServer = Awaited<ReturnType<typeof createClient>>;

async function uploadDoc(
  supabase: SupabaseServer,
  folder: string,
  file: File | null,
): Promise<string | null> {
  if (!file || file.size === 0) return null;
  const ext = file.name.split(".").pop() || "pdf";
  const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "doc";
  const path = `${folder}/${Date.now()}-${base}.${ext}`;
  const { error } = await supabase.storage
    .from("applications")
    .upload(path, file, { contentType: file.type || undefined, upsert: false });
  if (error) return null;
  return path;
}

export async function submitApplication(
  _prev: CareerState,
  formData: FormData,
): Promise<CareerState> {
  const parsed = schema.safeParse({
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    type: formData.get("type"),
    position: formData.get("position"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { status: "error", message: "Veuillez créer un compte ou vous connecter pour postuler." };
  }

  const folder = `${slugify(parsed.data.full_name)}-${Date.now()}`;

  const cv = await uploadDoc(supabase, folder, formData.get("cv") as File | null);
  const coverLetter = await uploadDoc(supabase, folder, formData.get("cover_letter") as File | null);
  const internship = await uploadDoc(supabase, folder, formData.get("internship_request") as File | null);

  const others: string[] = [];
  for (const f of formData.getAll("other_docs")) {
    if (f instanceof File && f.size > 0) {
      const p = await uploadDoc(supabase, folder, f);
      if (p) others.push(p);
    }
  }

  const { error } = await supabase.from("applications").insert({
    user_id: user.id,
    full_name: parsed.data.full_name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    type: parsed.data.type,
    position: parsed.data.position || null,
    message: parsed.data.message || null,
    cv_url: cv,
    cover_letter_url: coverLetter,
    internship_request_url: internship,
    other_docs: others,
  });
  if (error) {
    return { status: "error", message: "Envoi impossible. Réessayez." };
  }

  // E-mail au responsable
  await sendEmail({
    to: CAREERS_NOTIFY_EMAIL,
    subject: `Nouvelle candidature — ${parsed.data.full_name}`,
    html: emailShell(
      "Nouvelle candidature reçue",
      `<p><strong>${parsed.data.full_name}</strong> a soumis une <strong>${TYPE_LABELS[parsed.data.type]}</strong>.</p>
       <p>Email : ${parsed.data.email}<br/>Téléphone : ${parsed.data.phone}<br/>
       Poste / domaine : ${parsed.data.position || "—"}</p>
       <p>${(parsed.data.message || "").replace(/</g, "&lt;")}</p>
       <p>Documents joints : ${[cv && "CV", coverLetter && "Lettre de motivation", internship && "Demande de stage", others.length && `${others.length} autre(s)`].filter(Boolean).join(", ") || "aucun"}.</p>
       <p>Consultez et téléchargez les pièces dans le tableau de bord : <a href="https://delta-surveys.vercel.app/admin/carrieres">Espace admin → Carrières</a>.</p>`,
    ),
  });

  // Confirmation au candidat
  await sendEmail({
    to: parsed.data.email,
    subject: "Votre candidature chez Delta Surveys a bien été reçue",
    html: emailShell(
      "Merci pour votre candidature !",
      `<p>Bonjour ${parsed.data.full_name},</p>
       <p>Nous avons bien reçu votre <strong>${TYPE_LABELS[parsed.data.type].toLowerCase()}</strong>. Notre équipe l'étudie avec attention et reviendra vers vous dans les meilleurs délais.</p>
       <p>À très bientôt,<br/>L'équipe Delta Surveys</p>`,
    ),
  });

  revalidatePath("/admin/carrieres");
  revalidatePath("/admin");

  return {
    status: "success",
    message:
      "Votre candidature a été envoyée avec succès. Vous recevrez une confirmation par e-mail.",
  };
}

const STATUS_LABELS: Record<string, string> = {
  received: "Reçue",
  reviewing: "En cours d'étude",
  accepted: "Acceptée",
  rejected: "Refusée",
};

export async function updateApplicationStatus(id: string, status: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") return;

  const { data: app } = await supabase
    .from("applications")
    .update({ status: status as "received" | "reviewing" | "accepted" | "rejected" })
    .eq("id", id)
    .select("full_name,email")
    .single();

  if (app?.email) {
    await sendEmail({
      to: app.email,
      subject: `Mise à jour de votre candidature — Delta Surveys`,
      html: emailShell(
        "Mise à jour de votre candidature",
        `<p>Bonjour ${app.full_name},</p>
         <p>Le statut de votre candidature est désormais : <strong>${STATUS_LABELS[status] ?? status}</strong>.</p>
         ${status === "accepted" ? "<p>Félicitations ! Notre équipe vous contactera très prochainement pour la suite.</p>" : ""}
         ${status === "rejected" ? "<p>Nous vous remercions de l'intérêt porté à Delta Surveys et vous souhaitons plein succès dans vos recherches.</p>" : ""}
         <p>L'équipe Delta Surveys</p>`,
      ),
    });
  }

  revalidatePath("/admin/carrieres");
}
