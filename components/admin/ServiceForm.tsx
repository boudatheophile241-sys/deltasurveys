"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Save, Loader2, AlertCircle } from "lucide-react";
import { saveService, type AdminState } from "@/lib/actions/admin";

const inputCls =
  "h-11 w-full rounded-xl border border-navy-200 bg-white px-3 text-sm text-navy-900 outline-none focus:border-navy-400";
const labelCls = "mb-1.5 block text-sm font-medium text-navy-700";

export type ServiceData = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  icon: string | null;
  accent: string | null;
  features: string[] | null;
  sort_order: number | null;
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

export function ServiceForm({ service }: { service?: ServiceData }) {
  const [state, formAction] = useActionState<AdminState, FormData>(saveService, null);
  const featuresText = (service?.features ?? []).join("\n");

  return (
    <form action={formAction} className="space-y-5">
      {service?.id && <input type="hidden" name="id" value={service.id} />}
      {state?.error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" /> {state.error}
        </div>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelCls}>Titre *</label>
          <input name="title" required defaultValue={service?.title} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Slug (auto si vide)</label>
          <input name="slug" defaultValue={service?.slug} className={inputCls} placeholder="ex: topographie" />
        </div>
        <div>
          <label className={labelCls}>Icône (nom Lucide)</label>
          <input name="icon" defaultValue={service?.icon ?? "Wrench"} className={inputCls} placeholder="ex: Map, Landmark, Building2" />
        </div>
        <div>
          <label className={labelCls}>Couleur d&apos;accent</label>
          <select name="accent" defaultValue={service?.accent ?? "navy"} className={inputCls}>
            <option value="navy">Bleu</option>
            <option value="red">Rouge</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Ordre d&apos;affichage</label>
          <input name="sort_order" type="number" defaultValue={service?.sort_order ?? 0} className={inputCls} />
        </div>
      </div>
      <div>
        <label className={labelCls}>Description</label>
        <textarea name="description" rows={2} defaultValue={service?.description ?? ""} className={`${inputCls} h-auto py-2`} />
      </div>
      <div>
        <label className={labelCls}>Points clés (un par ligne)</label>
        <textarea name="features" rows={4} defaultValue={featuresText} className={`${inputCls} h-auto py-2`} placeholder={"Levés topographiques\nImplantation d'ouvrages"} />
      </div>
      <div className="flex items-center gap-3">
        <SubmitButton />
        <Link href="/admin/services" className="btn h-11 border border-navy-200 bg-white px-6 text-sm text-navy-700 hover:bg-navy-50">
          Annuler
        </Link>
      </div>
    </form>
  );
}
