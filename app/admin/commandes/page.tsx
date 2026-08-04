import { ShoppingCart } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { updateOrderStatus } from "@/lib/actions/admin";
import { formatCFA } from "@/lib/utils";

const options = [
  { value: "pending", label: "En attente" },
  { value: "confirmed", label: "Confirmée" },
  { value: "shipped", label: "Expédiée" },
  { value: "delivered", label: "Livrée" },
  { value: "cancelled", label: "Annulée" },
];

type Row = {
  id: string;
  reference: string;
  status: string;
  channel: string;
  total: number;
  created_at: string;
  profiles: { full_name: string | null } | null;
  order_items: { product_name: string; quantity: number }[];
};

export default async function AdminCommandesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("id,reference,status,channel,total,created_at,profiles(full_name),order_items(product_name,quantity)")
    .order("created_at", { ascending: false });

  const orders = (data as unknown as Row[] | null) ?? [];

  return (
    <div className="space-y-6 text-white">
      <div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Commandes</h1>
        <p className="mt-1 text-sm text-white/60">{orders.length} commande(s)</p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center text-white/50">
          <ShoppingCart className="mx-auto h-10 w-10 text-white/30" />
          <p className="mt-3 text-sm">Aucune commande pour l&apos;instant.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((o) => (
            <div key={o.id} className="rounded-2xl bg-white p-5 text-navy-800 shadow-card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display font-bold text-navy-900">{o.reference}</p>
                  <p className="mt-0.5 text-sm text-navy-500">
                    {o.profiles?.full_name || "Client"} · {o.channel} ·{" "}
                    {new Date(o.created_at).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-display font-bold text-navy-900">
                    {formatCFA(Number(o.total))}
                  </span>
                  <StatusSelect id={o.id} current={o.status} options={options} action={updateOrderStatus} />
                </div>
              </div>
              {o.order_items?.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {o.order_items.map((it, i) => (
                    <li key={i} className="rounded-full bg-navy-50 px-3 py-1 text-xs text-navy-600">
                      {it.product_name} × {it.quantity}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
