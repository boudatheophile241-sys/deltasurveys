"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Save, Loader2, AlertCircle } from "lucide-react";
import { savePromotion, type AdminState } from "@/lib/actions/admin";

const inputCls =
  "h-11 w-full rounded-xl border border-navy-200 bg-white px-3 text-sm text-navy-900 outline-none focus:border-navy-400";
const labelCls = "mb-1.5 block text-sm font-medium text-navy-700";

export type PromotionData = {
  id: string;
  title: string;
  description: string | null;
  code: string | null;
  discount_percent: number | null;
  active: boolean | null;
  starts_at: string | null;
  ends_at: string | null;
};

function toDateInput(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 10);
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn h-11 bg-brand-red px-6 text-sm text-white hover:bg-brand-red-dark">
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      Enregistrer
    </button>
  );
}

export function PromotionForm({ promotion }: { promotion?: PromotionData }) {
  const [state, formAction] = useActionState<AdminState, FormData>(savePromotion, null);

  return (
    <form action={formAction} className="space-y-5">
      {promotion?.id && <input type="hidden" name="id" value={promotion.id} />}
      {state?.error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" /> {state.error}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelCls}>Titre *</label>
          <input name="title" required defaultValue={promotion?.title} className={inputCls} placeholder="Ex: Promo rentree -15%" />
        </div>
        <div>
          <label className={labelCls}>Code promo</label>
          <input name="code" defaultValue={promotion?.code ?? ""} className={inputCls} placeholder="RENTREE15" />
        </div>
        <div>
          <label className={labelCls}>Reduction (%)</label>
          <input name="discount_percent" type="number" min="0" max="100" defaultValue={promotion?.discount_percent ?? 0} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Debut</label>
          <input name="starts_at" type="date" defaultValue={toDateInput(promotion?.starts_at ?? null)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Fin</label>
          <input name="ends_at" type="date" defaultValue={toDateInput(promotion?.ends_at ?? null)} className={inputCls} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Description</label>
          <textarea name="description" rows={3} defaultValue={promotion?.description ?? ""} className={`${inputCls} h-auto py-2`} />
        </div>
      </div>

      <label className="flex items-center gap-2 rounded-xl border border-navy-100 bg-navy-50/50 p-4 text-sm text-navy-700">
        <input type="checkbox" name="active" defaultChecked={promotion?.active ?? true} className="h-4 w-4 rounded border-navy-300" />
        Promotion active
      </label>

      <div className="flex items-center gap-3">
        <SubmitButton />
        <Link href="/admin/promotions" className="btn h-11 border border-navy-200 bg-white px-6 text-sm text-navy-700 hover:bg-navy-50">
          Annuler
        </Link>
      </div>
    </form>
  );
}
