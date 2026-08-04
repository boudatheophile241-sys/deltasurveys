import Link from "next/link";
import {
  Package,
  ShoppingCart,
  FileText,
  MessageSquare,
  Users,
  Newspaper,
  Tag,
  Boxes,
  LayoutTemplate,
  Wrench,
  Briefcase,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatCFA } from "@/lib/utils";

export default async function AdminOverview() {
  const supabase = await createClient();

  const [products, orders, quotes, messages, clients, posts, ordersData] =
    await Promise.all([
      supabase.from("products").select("id", { count: "exact", head: true }),
      supabase.from("orders").select("id", { count: "exact", head: true }),
      supabase.from("quotes").select("id", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("messages").select("id", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "client"),
      supabase.from("blog_posts").select("id", { count: "exact", head: true }),
      supabase.from("orders").select("reference,status,total,created_at").order("created_at", { ascending: false }).limit(5),
    ]);

  const kpis = [
    { label: "Produits", value: products.count ?? 0, icon: Package },
    { label: "Commandes", value: orders.count ?? 0, icon: ShoppingCart },
    { label: "Devis en attente", value: quotes.count ?? 0, icon: FileText },
    { label: "Messages non lus", value: messages.count ?? 0, icon: MessageSquare },
    { label: "Clients", value: clients.count ?? 0, icon: Users },
    { label: "Articles blog", value: posts.count ?? 0, icon: Newspaper },
  ];

  const modules = [
    { label: "Produits", icon: Package, href: "/admin/produits" },
    { label: "Categories", icon: Boxes, href: "/admin/categories" },
    { label: "Marques", icon: Tag, href: "/admin/marques" },
    { label: "Services", icon: Wrench, href: "/admin/services" },
    { label: "Commandes", icon: ShoppingCart, href: "/admin/commandes" },
    { label: "Devis", icon: FileText, href: "/admin/devis" },
    { label: "Messages", icon: MessageSquare, href: "/admin/messages" },
    { label: "Carrières", icon: Briefcase, href: "/admin/carrieres" },
    { label: "Clients", icon: Users, href: "/admin/clients" },
    { label: "Blog", icon: Newspaper, href: "/admin/blog" },
    { label: "Promotions", icon: Tag, href: "/admin/promotions" },
    { label: "Contenu du site", icon: LayoutTemplate, href: "/admin/contenu" },
  ];

  const recent = ordersData.data ?? [];

  return (
    <div className="space-y-8 text-white">
      <div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Tableau de bord</h1>
        <p className="mt-1 text-sm text-white/60">
          Vue d&apos;ensemble de l&apos;activite Delta Surveys.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-red/15 text-brand-red">
              <k.icon className="h-5 w-5" />
            </span>
            <p className="mt-3 font-display text-3xl font-extrabold">{k.value}</p>
            <p className="text-sm text-white/60">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Commandes recentes */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <h2 className="mb-5 font-display text-lg font-bold">Commandes recentes</h2>
        {recent.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wide text-white/40">
                  <th className="pb-3 font-semibold">Reference</th>
                  <th className="pb-3 font-semibold">Statut</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recent.map((o) => (
                  <tr key={o.reference}>
                    <td className="py-3 font-medium">{o.reference}</td>
                    <td className="py-3 capitalize text-white/70">{o.status}</td>
                    <td className="py-3 text-white/60">
                      {new Date(o.created_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="py-3 text-right font-semibold">
                      {formatCFA(Number(o.total))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-white/50">Aucune commande pour l&apos;instant.</p>
        )}
      </div>

      {/* Modules a venir */}
      <div>
        <h2 className="mb-4 font-display text-lg font-bold">Modules de gestion</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {modules.map((m) =>
            m.href ? (
              <Link
                key={m.label}
                href={m.href}
                className="flex items-center gap-3 rounded-xl border border-brand-red/40 bg-brand-red/10 px-4 py-3 text-sm font-medium text-white transition hover:bg-brand-red/20"
              >
                <m.icon className="h-4.5 w-4.5 text-brand-red" />
                {m.label}
                <span className="ml-auto rounded-full bg-brand-red px-2 py-0.5 text-[10px] uppercase tracking-wide text-white">
                  Gérer
                </span>
              </Link>
            ) : (
              <div
                key={m.label}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70"
              >
                <m.icon className="h-4.5 w-4.5 text-white/50" />
                {m.label}
                <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white/50">
                  Bientôt
                </span>
              </div>
            ),
          )}
        </div>
        <p className="mt-4 text-xs text-white/40">
          Les modules de gestion complets (CRUD produits, commandes, blog...) arrivent dans la prochaine phase.
        </p>
      </div>

      <Link
        href="/compte"
        className="inline-flex text-sm text-white/60 underline-offset-4 hover:text-white hover:underline"
      >
        Voir l&apos;espace client
      </Link>
    </div>
  );
}
