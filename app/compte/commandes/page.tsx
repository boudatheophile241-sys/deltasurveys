import { Package } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { formatCFA } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-600",
  confirmed: "bg-sky-50 text-sky-600",
  shipped: "bg-navy-50 text-navy-700",
  delivered: "bg-emerald-50 text-emerald-600",
  cancelled: "bg-red-50 text-red-600",
};
const statusLabels: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

export default async function CommandesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: orders } = await supabase
    .from("orders")
    .select("id,reference,status,total,channel,created_at")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  if (!orders || orders.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="Aucune commande"
        description="Vos commandes apparaitront ici. Commandez via WhatsApp ou demandez un devis pour demarrer."
        ctaLabel="Voir les produits"
        ctaHref="/produits"
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-navy-100 bg-navy-50/50 text-left text-xs uppercase tracking-wide text-navy-400">
            <th className="px-5 py-3 font-semibold">Reference</th>
            <th className="px-5 py-3 font-semibold">Date</th>
            <th className="px-5 py-3 font-semibold">Canal</th>
            <th className="px-5 py-3 font-semibold">Statut</th>
            <th className="px-5 py-3 text-right font-semibold">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-navy-50">
          {orders.map((o) => (
            <tr key={o.id} className="hover:bg-navy-50/40">
              <td className="px-5 py-4 font-medium text-navy-900">{o.reference}</td>
              <td className="px-5 py-4 text-navy-500">
                {new Date(o.created_at).toLocaleDateString("fr-FR")}
              </td>
              <td className="px-5 py-4 capitalize text-navy-500">{o.channel}</td>
              <td className="px-5 py-4">
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[o.status]}`}>
                  {statusLabels[o.status] ?? o.status}
                </span>
              </td>
              <td className="px-5 py-4 text-right font-semibold text-navy-900">
                {formatCFA(Number(o.total))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
