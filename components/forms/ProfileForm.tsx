"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { updateProfile, type ActionState } from "@/lib/actions/account";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn h-11 bg-brand-red px-6 text-sm text-white hover:bg-brand-red-dark"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" /> Enregistrement...
        </>
      ) : (
        "Enregistrer"
      )}
    </button>
  );
}

export function ProfileForm({
  fullName,
  phone,
  email,
}: {
  fullName: string;
  phone: string;
  email: string;
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    updateProfile,
    null,
  );

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" /> {state.error}
        </div>
      )}
      {state?.success && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-600">
          <CheckCircle2 className="h-4 w-4 shrink-0" /> {state.success}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-navy-700">Nom complet</span>
          <input name="fullName" defaultValue={fullName} required className="input-field" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-navy-700">Téléphone</span>
          <input name="phone" defaultValue={phone} className="input-field" />
        </label>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-navy-700">Email</span>
        <input value={email} disabled className="input-field cursor-not-allowed opacity-60" />
        <span className="mt-1 block text-xs text-navy-400">
          L&apos;email ne peut pas être modifié ici.
        </span>
      </label>

      <SubmitButton />
    </form>
  );
}
