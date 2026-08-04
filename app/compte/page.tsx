import Link from "next/link";
import { Package, FileText, Heart, Bell, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatCFA } from "@/lib/utils";
import { getT } from "@/lib/i18n/server";

const statusLabelKeys: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

export default async function DashboardOverview() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const t = await getT();

  const uid = user!.id;

  const [orders, quotes, favorites, notifications] = await Promise.all([
    supabase.from("orders").select("id,reference,status,total,created_at").eq("user_id", uid).order("created_at", { ascending: false }).limit(5),
    supabase.from("quotes").select("id", { count: "exact", head: true }).eq("user_id", uid),
    supabase.from("favorites").select("id", { count: "exact", head: true }).eq("user_id", uid),
    supabase.from("notifications").select("id", { count: "exact", head: true }).eq("user_id", uid).eq("read", false),
  ]);

  const stats = [
    { label: t("dash.kOrders"), value: orders.data?.length ?? 0, icon: Package, href: "/compte/commandes", accent: "bg-navy-50 text-navy-700" },
    { label: t("dash.kQuotes"), value: quotes.count ?? 0, icon: FileText, href: "/compte/devis", accent: "bg-rose-50 text-brand-red" },
    { label: t("dash.kFavorites"), value: favorites.count ?? 0, icon: Heart, href: "/compte/favoris", accent: "bg-navy-50 text-navy-700" },
    { label: t("dash.kNotifs"), value: notifications.count ?? 0, icon: Bell, href: "/compte/notifications", accent: "bg-rose-50 text-brand-red" },
  ];

  const recentOrders = orders.data ?? [];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group rounded-2xl border border-navy-100 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
          >
            <span className={`grid h-11 w-11 place-items-center rounded-xl ${s.accent}`}>
              <s.icon className="h-5 w-5" />
            </span>
            <p className="mt-3 font-display text-2xl font-extrabold text-navy-900">
              {s.value}
            </p>
            <p className="text-sm text-navy-500">{s.label}</p>
          </Link>
        ))}
      </div>

      {/* Commandes recentes */}
      <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-navy-900">
            {t("dash.recentOrders")}
          </h2>
          <Link href="/compte/commandes" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-red">
            {t("dash.viewAll")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-100 text-left text-xs uppercase tracking-wide text-navy-400">
                  <th className="pb-3 font-semibold">{t("dash.ref")}</th>
                  <th className="pb-3 font-semibold">{t("dash.status")}</th>
                  <th className="pb-3 text-right font-semibold">{t("dash.total")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td className="py-3 font-medium text-navy-900">{o.reference}</td>
                    <td className="py-3">
                      <span className="rounded-full bg-navy-50 px-2.5 py-1 text-xs font-medium text-navy-700">
                        {statusLabelKeys[o.status] ?? o.status}
                      </span>
                    </td>
                    <td className="py-3 text-right font-semibold text-navy-900">
                      {formatCFA(Number(o.total))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-navy-200 bg-navy-50/50 py-10 text-center">
            <p className="text-sm text-navy-500">{t("dash.noOrders")}</p>
            <Link href="/produits" className="btn mt-4 h-10 bg-navy-900 px-5 text-sm text-white hover:bg-navy-800">
              {t("dash.browse")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
