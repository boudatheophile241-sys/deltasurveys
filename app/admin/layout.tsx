import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion?redirect=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") redirect("/compte");

  return (
    <div className="min-h-screen bg-navy-950">
      <div className="border-b border-white/10">
        <div className="container-page flex h-16 items-center justify-between">
          <div className="flex items-center gap-3 text-white">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-red">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <span className="font-display font-bold">Delta Surveys — Administration</span>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-white/60 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Retour au site
          </Link>
        </div>
      </div>
      <div className="border-b border-white/10">
        <div className="container-page flex gap-1 overflow-x-auto py-2">
          <AdminLink href="/admin">Tableau de bord</AdminLink>
          <AdminLink href="/admin/produits">Produits</AdminLink>
          <AdminLink href="/admin/categories">Categories</AdminLink>
          <AdminLink href="/admin/marques">Marques</AdminLink>
          <AdminLink href="/admin/services">Services</AdminLink>
          <AdminLink href="/admin/commandes">Commandes</AdminLink>
          <AdminLink href="/admin/devis">Devis</AdminLink>
          <AdminLink href="/admin/messages">Messages</AdminLink>
          <AdminLink href="/admin/carrieres">Carrières</AdminLink>
          <AdminLink href="/admin/clients">Clients</AdminLink>
          <AdminLink href="/admin/blog">Blog</AdminLink>
          <AdminLink href="/admin/promotions">Promotions</AdminLink>
          <AdminLink href="/admin/contenu">Contenu</AdminLink>
        </div>
      </div>

      <div className="container-page py-10">{children}</div>
    </div>
  );
}

function AdminLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
    >
      {children}
    </Link>
  );
}
