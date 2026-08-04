import { Download, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { formatCFA } from "@/lib/utils";

export default async function TelechargementsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: invoices } = await supabase
    .from("invoices")
    .select("id,number,amount,url,created_at")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  if (!invoices || invoices.length === 0) {
    return (
      <EmptyState
        icon={Download}
        title="Aucun telechargement"
        description="Vos factures seront disponibles ici après vos commandes."
      />
    );
  }

  return (
    <div className="space-y-3">
      {invoices.map((inv) => (
        <div key={inv.id} className="flex items-center gap-4 rounded-2xl border border-navy-100 bg-white p-4 shadow-card">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy-50 text-navy-700">
            <FileText className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-navy-900">Facture {inv.number}</p>
            <p className="text-sm text-navy-500">
              {new Date(inv.created_at).toLocaleDateString("fr-FR")} — {formatCFA(Number(inv.amount))}
            </p>
          </div>
          {inv.url && (
            <a
              href={inv.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn h-9 border border-navy-200 bg-white px-4 text-xs text-navy-800 hover:bg-navy-50"
            >
              <Download className="h-3.5 w-3.5" /> Télécharger
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
