"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Save, Loader2, AlertCircle } from "lucide-react";
import { saveCategory, type AdminState } from "@/lib/actions/admin";

const inputCls =
  "h-11 w-full rounded-xl border border-navy-200 bg-white px-3 text-sm text-navy-900 outline-none focus:border-navy-400";
const labelCls = "mb-1.5 block text-sm font-medium text-navy-700";

export type CategoryData = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  accent: string | null;
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

export function CategoryForm({ category }: { category?: CategoryData }) {
  const [state, formAction] = useActionState<AdminState, FormData>(saveCategory, null);

  return (
    <form action={formAction} className="space-y-5">
      {category?.id && <input type="hidden" name="id" value={category.id} />}
      {state?.error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" /> {state.error}
        </div>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Nom *</label>
          <input name="name" required defaultValue={category?.name} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Slug (auto si vide)</label>
          <input name="slug" defaultValue={category?.slug} className={inputCls} placeholder="ex: stations-totales" />
        </div>
        <div>
          <label className={labelCls}>Icone (nom Lucide)</label>
          <input name="icon" defaultValue={category?.icon ?? "Boxes"} className={inputCls} placeholder="ex: Crosshair, Satellite" />
        </div>
        <div>
          <label className={labelCls}>Couleur d&apos;accent</label>
          <select name="accent" defaultValue={category?.accent ?? "navy"} className={inputCls}>
            <option value="navy">Bleu (navy)</option>
            <option value="red">Rouge</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Description</label>
          <input name="description" defaultValue={category?.description ?? ""} className={inputCls} />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <SubmitButton />
        <Link href="/admin/categories" className="btn h-11 border border-navy-200 bg-white px-6 text-sm text-navy-700 hover:bg-navy-50">
          Annuler
        </Link>
      </div>
    </form>
  );
}
