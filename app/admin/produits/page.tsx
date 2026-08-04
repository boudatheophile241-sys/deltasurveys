import Link from "next/link";
import { Plus, Pencil, Trash2, Star, Package } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatCFA } from "@/lib/utils";
import { deleteProduct, toggleFeatured } from "@/lib/actions/admin";

type Row = {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock_qty: number | null;
  in_stock: boolean | null;
  is_featured: boolean | null;
  brands: { name: string } | null;
  categories: { name: string } | null;
};

export default async function AdminProduitsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("id,name,slug,price,stock_qty,in_stock,is_featured,brands(name),categories(name)")
    .order("created_at", { ascending: false });

  const products = (data as unknown as Row[] | null) ?? [];

  return (
    <div className="space-y-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Produits</h1>
          <p className="mt-1 text-sm text-white/60">{products.length} produit(s) au catalogue</p>
        </div>
        <Link
          href="/admin/produits/nouveau"
          className="btn h-11 bg-brand-red px-5 text-sm text-white hover:bg-brand-red-dark"
        >
          <Plus className="h-4 w-4" /> Nouveau produit
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-navy-800">
            <thead>
              <tr className="border-b border-navy-100 bg-navy-50/60 text-left text-xs uppercase tracking-wide text-navy-400">
                <th className="px-4 py-3 font-semibold">Produit</th>
                <th className="px-4 py-3 font-semibold">Marque</th>
                <th className="px-4 py-3 font-semibold">Categorie</th>
                <th className="px-4 py-3 font-semibold">Prix</th>
                <th className="px-4 py-3 font-semibold">Stock</th>
                <th className="px-4 py-3 text-center font-semibold">Vedette</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-navy-50/40">
                  <td className="px-4 py-3 font-medium text-navy-900">{p.name}</td>
                  <td className="px-4 py-3 text-navy-500">{p.brands?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-navy-500">{p.categories?.name ?? "—"}</td>
                  <td className="px-4 py-3 font-semibold text-navy-900">{formatCFA(Number(p.price))}</td>
                  <td className="px-4 py-3">
                    {(p.stock_qty ?? 0) > 0 ? (
                      <span className="text-emerald-600">{p.stock_qty}</span>
                    ) : (
                      <span className="text-navy-400">Rupture</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <form action={toggleFeatured}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="current" value={String(p.is_featured)} />
                      <button
                        className="grid h-8 w-8 place-items-center rounded-lg transition hover:bg-navy-50"
                        aria-label="Basculer vedette"
                      >
                        <Star className={`h-4 w-4 ${p.is_featured ? "fill-amber-400 text-amber-400" : "text-navy-300"}`} />
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/produits/${p.id}/modifier`}
                        className="grid h-8 w-8 place-items-center rounded-lg border border-navy-200 text-navy-600 transition hover:bg-navy-50"
                        aria-label="Modifier"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <form action={deleteProduct}>
                        <input type="hidden" name="id" value={p.id} />
                        <button
                          className="grid h-8 w-8 place-items-center rounded-lg border border-navy-200 text-navy-600 transition hover:border-brand-red hover:text-brand-red"
                          aria-label="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div className="flex flex-col items-center py-16 text-navy-500">
            <Package className="h-10 w-10 text-navy-300" />
            <p className="mt-3 text-sm">Aucun produit. Cliquez sur &quot;Nouveau produit&quot;.</p>
          </div>
        )}
      </div>
    </div>
  );
}
