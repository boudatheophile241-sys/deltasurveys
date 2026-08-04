import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ProductForm, type ProductFormData } from "@/components/admin/ProductForm";

export default async function ModifierProduitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: product }, { data: categories }, { data: brands }] =
    await Promise.all([
      supabase
        .from("products")
        .select(
          "id,name,slug,brand_id,category_id,price,old_price,stock_qty,in_stock,warranty,delivery,icon,accent,short_description,description,specs,badges,images,is_featured",
        )
        .eq("id", id)
        .maybeSingle(),
      supabase.from("categories").select("id,name").order("name"),
      supabase.from("brands").select("id,name").order("name"),
    ]);

  if (!product) notFound();

  const formData: ProductFormData = {
    ...product,
    specs: Array.isArray(product.specs)
      ? (product.specs as { label: string; value: string }[])
      : [],
    badges: product.badges ?? [],
  };

  return (
    <div className="text-white">
      <Link
        href="/admin/produits"
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-white/60 transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Retour aux produits
      </Link>
      <h1 className="mb-6 font-display text-2xl font-bold sm:text-3xl">
        Modifier : {product.name}
      </h1>
      <div className="rounded-2xl bg-white p-6 sm:p-8">
        <ProductForm
          categories={categories ?? []}
          brands={brands ?? []}
          product={formData}
        />
      </div>
    </div>
  );
}
