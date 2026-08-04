import Link from "next/link";
import { Plus, Pencil, Trash2, Tag, Check, X } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { deletePromotion } from "@/lib/actions/admin";

export default async function AdminPromotionsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("promotions")
    .select("id,title,code,discount_percent,active,ends_at")
    .order("created_at", { ascending: false });
  const promos = data ?? [];

  return (
    <div className="space-y-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Promotions</h1>
          <p className="mt-1 text-sm text-white/60">{promos.length} promotion(s)</p>
        </div>
        <Link href="/admin/promotions/nouveau" className="btn h-11 bg-brand-red px-5 text-sm text-white hover:bg-brand-red-dark">
          <Plus className="h-4 w-4" /> Nouvelle promotion
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white">
        <table className="w-full text-sm text-navy-800">
          <thead>
            <tr className="border-b border-navy-100 bg-navy-50/60 text-left text-xs uppercase tracking-wide text-navy-400">
              <th className="px-4 py-3 font-semibold">Titre</th>
              <th className="px-4 py-3 font-semibold">Code</th>
              <th className="px-4 py-3 font-semibold">Reduction</th>
              <th className="px-4 py-3 font-semibold">Active</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-50">
            {promos.map((p) => (
              <tr key={p.id} className="hover:bg-navy-50/40">
                <td className="px-4 py-3 font-medium text-navy-900">{p.title}</td>
                <td className="px-4 py-3 text-navy-500">{p.code || "—"}</td>
                <td className="px-4 py-3 text-navy-500">{p.discount_percent ? `${p.discount_percent}%` : "—"}</td>
                <td className="px-4 py-3">
                  {p.active ? (
                    <Check className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <X className="h-4 w-4 text-navy-300" />
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/promotions/${p.id}/modifier`} className="grid h-8 w-8 place-items-center rounded-lg border border-navy-200 text-navy-600 hover:bg-navy-50" aria-label="Modifier">
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <form action={deletePromotion}>
                      <input type="hidden" name="id" value={p.id} />
                      <button className="grid h-8 w-8 place-items-center rounded-lg border border-navy-200 text-navy-600 hover:border-brand-red hover:text-brand-red" aria-label="Supprimer">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {promos.length === 0 && (
          <div className="py-12 text-center text-navy-500">
            <Tag className="mx-auto h-10 w-10 text-navy-300" />
            <p className="mt-3 text-sm">Aucune promotion.</p>
          </div>
        )}
      </div>
    </div>
  );
}
