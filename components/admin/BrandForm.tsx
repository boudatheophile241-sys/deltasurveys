"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Save, Loader2, AlertCircle } from "lucide-react";
import { saveBrand, type AdminState } from "@/lib/actions/admin";
import { ImageUploader } from "./ImageUploader";

const inputCls =
  "h-11 w-full rounded-xl border border-navy-200 bg-white px-3 text-sm text-navy-900 outline-none focus:border-navy-400";
const labelCls = "mb-1.5 block text-sm font-medium text-navy-700";

export type BrandData = {
  id: string;
  name: string;
  slug: string;
  origin: string | null;
  monogram: string | null;
  logo: string | null;
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

export function BrandForm({ brand }: { brand?: BrandData }) {
  const [state, formAction] = useActionState<AdminState, FormData>(saveBrand, null);
  const [logo, setLogo] = useState(brand?.logo ?? "");

  return (
    <form action={formAction} className="space-y-5">
      {brand?.id && <input type="hidden" name="id" value={brand.id} />}
      {state?.error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" /> {state.error}
        </div>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Nom *</label>
          <input name="name" required defaultValue={brand?.name} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Slug (auto si vide)</label>
          <input name="slug" defaultValue={brand?.slug} className={inputCls} placeholder="ex: leica" />
        </div>
        <div>
          <label className={labelCls}>Origine</label>
          <input name="origin" defaultValue={brand?.origin ?? ""} className={inputCls} placeholder="ex: Suisse" />
        </div>
        <div>
          <label className={labelCls}>Monogramme (repli si pas de logo)</label>
          <input name="monogram" defaultValue={brand?.monogram ?? ""} className={inputCls} placeholder="ex: LG" maxLength={4} />
        </div>
      </div>

      <div>
        <label className={labelCls}>Logo de la marque</label>
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt="Logo" className="mb-2 h-12 w-auto rounded-lg border border-navy-100 bg-white object-contain p-1" />
        ) : null}
        <div className="mb-2">
          <ImageUploader folder="brands" onUploaded={setLogo} />
        </div>
        <input name="logo" value={logo} onChange={(e) => setLogo(e.target.value)} className={inputCls} placeholder="URL du logo (PNG/SVG, fond transparent conseillé)" />
        <p className="mt-1 text-xs text-navy-400">Sans logo, le monogramme est affiché.</p>
      </div>

      <div className="flex items-center gap-3">
        <SubmitButton />
        <Link href="/admin/marques" className="btn h-11 border border-navy-200 bg-white px-6 text-sm text-navy-700 hover:bg-navy-50">
          Annuler
        </Link>
      </div>
    </form>
  );
}
