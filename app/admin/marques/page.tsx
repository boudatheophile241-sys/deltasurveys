import Link from "next/link";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { deleteBrand } from "@/lib/actions/admin";

export default async function AdminMarquesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("brands")
    .select("id,name,slug,origin,monogram")
    .order("name", { ascending: true });
  const brands = data ?? [];

  return (
    <div className="space-y-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Marques</h1>
          <p className="mt-1 text-sm text-white/60">{brands.length} marque(s)</p>
        </div>
        <Link href="/admin/marques/nouveau" className="btn h-11 bg-brand-red px-5 text-sm text-white hover:bg-brand-red-dark">
          <Plus className="h-4 w-4" /> Nouvelle marque
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white">
        <table className="w-full text-sm text-navy-800">
          <thead>
            <tr className="border-b border-navy-100 bg-navy-50/60 text-left text-xs uppercase tracking-wide text-navy-400">
              <th className="px-4 py-3 font-semibold">Monogramme</th>
              <th className="px-4 py-3 font-semibold">Nom</th>
              <th className="px-4 py-3 font-semibold">Origine</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-50">
            {brands.map((b) => (
              <tr key={b.id} className="hover:bg-navy-50/40">
                <td className="px-4 py-3">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-navy-900 text-xs font-bold text-white">
                    {b.monogram}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-navy-900">{b.name}</td>
                <td className="px-4 py-3 text-navy-500">{b.origin || "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/marques/${b.id}/modifier`} className="grid h-8 w-8 place-items-center rounded-lg border border-navy-200 text-navy-600 hover:bg-navy-50" aria-label="Modifier">
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <form action={deleteBrand}>
                      <input type="hidden" name="id" value={b.id} />
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
        {brands.length === 0 && (
          <div className="py-12 text-center text-navy-500">
            <Tag className="mx-auto h-10 w-10 text-navy-300" />
            <p className="mt-3 text-sm">Aucune marque.</p>
          </div>
        )}
      </div>
    </div>
  );
}
