"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Save, Loader2, AlertCircle } from "lucide-react";
import { saveBlogPost, type AdminState } from "@/lib/actions/admin";
import { ImageUploader } from "./ImageUploader";

const inputCls =
  "h-11 w-full rounded-xl border border-navy-200 bg-white px-3 text-sm text-navy-900 outline-none focus:border-navy-400";
const labelCls = "mb-1.5 block text-sm font-medium text-navy-700";

export type BlogPostData = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  category: string | null;
  icon: string | null;
  cover_url: string | null;
  read_time: string | null;
  author: string | null;
  published: boolean | null;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn h-11 bg-brand-red px-6 text-sm text-white hover:bg-brand-red-dark">
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      Enregistrer
    </button>
  );
}

export function BlogPostForm({ post }: { post?: BlogPostData }) {
  const [state, formAction] = useActionState<AdminState, FormData>(saveBlogPost, null);
  const [cover, setCover] = useState(post?.cover_url ?? "");

  return (
    <form action={formAction} className="space-y-5">
      {post?.id && <input type="hidden" name="id" value={post.id} />}
      {state?.error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" /> {state.error}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelCls}>Titre *</label>
          <input name="title" required defaultValue={post?.title} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Slug (auto si vide)</label>
          <input name="slug" defaultValue={post?.slug} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Categorie</label>
          <input name="category" defaultValue={post?.category ?? "Article"} className={inputCls} placeholder="Guide d'achat, Technique..." />
        </div>
        <div>
          <label className={labelCls}>Icone (Lucide)</label>
          <input name="icon" defaultValue={post?.icon ?? "Newspaper"} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Temps de lecture</label>
          <input name="read_time" defaultValue={post?.read_time ?? "5 min"} className={inputCls} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Auteur</label>
          <input name="author" defaultValue={post?.author ?? "Delta Surveys"} className={inputCls} />
        </div>
      </div>

      <div>
        <label className={labelCls}>Image de couverture</label>
        <div className="mb-2">
          <ImageUploader folder="blog" onUploaded={setCover} />
        </div>
        <input name="cover_url" value={cover} onChange={(e) => setCover(e.target.value)} className={inputCls} placeholder="URL de l'image de couverture (optionnel)" />
      </div>

      <div>
        <label className={labelCls}>Resume</label>
        <textarea name="excerpt" rows={2} defaultValue={post?.excerpt ?? ""} className={`${inputCls} h-auto py-2`} />
      </div>
      <div>
        <label className={labelCls}>Contenu de l&apos;article</label>
        <textarea name="content" rows={10} defaultValue={post?.content ?? ""} className={`${inputCls} h-auto py-2`} placeholder="Redigez votre article. Une ligne vide separe les paragraphes." />
      </div>

      <label className="flex items-center gap-2 rounded-xl border border-navy-100 bg-navy-50/50 p-4 text-sm text-navy-700">
        <input type="checkbox" name="published" defaultChecked={post?.published ?? true} className="h-4 w-4 rounded border-navy-300" />
        Publier l&apos;article (visible sur le site)
      </label>

      <div className="flex items-center gap-3">
        <SubmitButton />
        <Link href="/admin/blog" className="btn h-11 border border-navy-200 bg-white px-6 text-sm text-navy-700 hover:bg-navy-50">
          Annuler
        </Link>
      </div>
    </form>
  );
}
