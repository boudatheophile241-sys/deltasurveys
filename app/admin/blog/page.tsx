import Link from "next/link";
import { Plus, Pencil, Trash2, Newspaper, Check, X } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { deleteBlogPost } from "@/lib/actions/admin";

export default async function AdminBlogPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("id,title,category,published,created_at")
    .order("created_at", { ascending: false });
  const posts = data ?? [];

  return (
    <div className="space-y-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Blog</h1>
          <p className="mt-1 text-sm text-white/60">{posts.length} article(s)</p>
        </div>
        <Link href="/admin/blog/nouveau" className="btn h-11 bg-brand-red px-5 text-sm text-white hover:bg-brand-red-dark">
          <Plus className="h-4 w-4" /> Nouvel article
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white">
        <table className="w-full text-sm text-navy-800">
          <thead>
            <tr className="border-b border-navy-100 bg-navy-50/60 text-left text-xs uppercase tracking-wide text-navy-400">
              <th className="px-4 py-3 font-semibold">Titre</th>
              <th className="px-4 py-3 font-semibold">Categorie</th>
              <th className="px-4 py-3 font-semibold">Publie</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-50">
            {posts.map((p) => (
              <tr key={p.id} className="hover:bg-navy-50/40">
                <td className="px-4 py-3 font-medium text-navy-900">{p.title}</td>
                <td className="px-4 py-3 text-navy-500">{p.category}</td>
                <td className="px-4 py-3">
                  {p.published ? (
                    <Check className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <X className="h-4 w-4 text-navy-300" />
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/blog/${p.id}/modifier`} className="grid h-8 w-8 place-items-center rounded-lg border border-navy-200 text-navy-600 hover:bg-navy-50" aria-label="Modifier">
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <form action={deleteBlogPost}>
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
        {posts.length === 0 && (
          <div className="py-12 text-center text-navy-500">
            <Newspaper className="mx-auto h-10 w-10 text-navy-300" />
            <p className="mt-3 text-sm">Aucun article.</p>
          </div>
        )}
      </div>
    </div>
  );
}
