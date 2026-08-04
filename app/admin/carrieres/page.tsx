import { Briefcase, Download, Mail, Phone } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { updateApplicationStatus } from "@/lib/actions/careers";

const statusOptions = [
  { value: "received", label: "Reçue" },
  { value: "reviewing", label: "En cours d'étude" },
  { value: "accepted", label: "Acceptée" },
  { value: "rejected", label: "Refusée" },
];

const typeLabels: Record<string, string> = {
  stage: "Demande de stage",
  emploi: "Candidature emploi",
  spontanee: "Candidature spontanée",
};

type Row = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  type: string;
  position: string | null;
  message: string | null;
  status: string;
  created_at: string;
  cv_url: string | null;
  cover_letter_url: string | null;
  internship_request_url: string | null;
  other_docs: string[] | null;
};

export default async function AdminCarrieresPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("applications")
    .select("id,full_name,email,phone,type,position,message,status,created_at,cv_url,cover_letter_url,internship_request_url,other_docs")
    .order("created_at", { ascending: false });

  const applications = (data as Row[] | null) ?? [];

  // Génère les URLs signées (bucket privé) pour chaque document.
  async function sign(path: string | null): Promise<string | null> {
    if (!path) return null;
    const { data } = await supabase.storage.from("applications").createSignedUrl(path, 3600);
    return data?.signedUrl ?? null;
  }

  const withLinks = await Promise.all(
    applications.map(async (a) => ({
      app: a,
      docs: [
        { label: "CV", url: await sign(a.cv_url) },
        { label: "Lettre de motivation", url: await sign(a.cover_letter_url) },
        { label: "Demande de stage", url: await sign(a.internship_request_url) },
        ...(await Promise.all(
          (a.other_docs ?? []).map(async (p, i) => ({ label: `Document ${i + 1}`, url: await sign(p) })),
        )),
      ].filter((d) => d.url),
    })),
  );

  return (
    <div className="space-y-6 text-white">
      <div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Carrières</h1>
        <p className="mt-1 text-sm text-white/60">{applications.length} candidature(s)</p>
      </div>

      {withLinks.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center text-white/50">
          <Briefcase className="mx-auto h-10 w-10 text-white/30" />
          <p className="mt-3 text-sm">Aucune candidature pour l'instant.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {withLinks.map(({ app, docs }) => (
            <div key={app.id} className="rounded-2xl bg-white p-5 text-navy-800 shadow-card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display font-bold text-navy-900">{app.full_name}</p>
                  <p className="mt-0.5 text-sm text-navy-500">
                    {typeLabels[app.type] ?? app.type}
                    {app.position ? ` · ${app.position}` : ""}
                  </p>
                </div>
                <StatusSelect id={app.id} current={app.status} options={statusOptions} action={updateApplicationStatus} />
              </div>

              {app.message && <p className="mt-3 text-sm text-navy-600">{app.message}</p>}

              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-navy-400">
                <span className="inline-flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {app.email}</span>
                {app.phone && <span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {app.phone}</span>}
                <span>{new Date(app.created_at).toLocaleDateString("fr-FR")}</span>
              </div>

              {docs.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {docs.map((d, i) => (
                    <a
                      key={i}
                      href={d.url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-navy-200 bg-navy-50 px-3 py-1.5 text-xs font-medium text-navy-700 transition hover:border-brand-red hover:text-brand-red"
                    >
                      <Download className="h-3.5 w-3.5" /> {d.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
