import { FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/dashboard/EmptyState";

const statusStyles: Record<string, string> = {
  new: "bg-amber-50 text-amber-600",
  processing: "bg-sky-50 text-sky-600",
  sent: "bg-navy-50 text-navy-700",
  closed: "bg-emerald-50 text-emerald-600",
};
const statusLabels: Record<string, string> = {
  new: "Nouveau",
  processing: "En traitement",
  sent: "Envoyé",
  closed: "Clôture",
};

export default async function DevisPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: quotes } = await supabase
    .from("quotes")
    .select("id,subject,message,status,created_at")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  if (!quotes || quotes.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="Aucun devis"
        description="Vos demandes de devis apparaitront ici. Demandez un devis gratuit et sans engagement."
        ctaLabel="Demander un devis"
        ctaHref="/devis"
      />
    );
  }

  return (
    <div className="space-y-3">
      {quotes.map((q) => (
        <div key={q.id} className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-display font-bold text-navy-900">
                {q.subject || "Demande de devis"}
              </p>
              <p className="mt-1 line-clamp-2 text-sm text-navy-500">{q.message}</p>
              <p className="mt-2 text-xs text-navy-400">
                {new Date(q.created_at).toLocaleDateString("fr-FR")}
              </p>
            </div>
            <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[q.status]}`}>
              {statusLabels[q.status] ?? q.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
