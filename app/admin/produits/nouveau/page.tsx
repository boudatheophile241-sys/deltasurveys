import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NouveauProduitPage() {
  const supabase = await createClient();
  const [{ data: categories }, { data: brands }] = await Promise.all([
    supabase.from("categories").select("id,name").order("name"),
    supabase.from("brands").select("id,name").order("name"),
  ]);

  return (
    <div className="text-white">
      <Link
        href="/admin/produits"
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-white/60 transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Retour aux produits
      </Link>
      <h1 className="mb-6 font-display text-2xl font-bold sm:text-3xl">Nouveau produit</h1>
      <div className="rounded-2xl bg-white p-6 sm:p-8">
        <ProductForm categories={categories ?? []} brands={brands ?? []} />
      </div>
    </div>
  );
}
