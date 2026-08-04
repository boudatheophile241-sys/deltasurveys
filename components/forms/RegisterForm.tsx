"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  User,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { register, type AuthState } from "@/lib/actions/auth";
import { SocialAuth } from "./SocialAuth";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn h-12 w-full bg-brand-red text-white hover:bg-brand-red-dark"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" /> Creation...
        </>
      ) : (
        <>
          Créer mon compte <ArrowRight className="h-4 w-4" />
        </>
      )}
    </button>
  );
}

export function RegisterForm() {
  const [state, formAction] = useActionState<AuthState, FormData>(register, null);

  if (state?.success) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-emerald-100 bg-emerald-50 p-6 text-center">
        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
        <p className="mt-3 text-sm text-navy-700">{state.success}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SocialAuth />
      <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </div>
      )}

      <div className="relative">
        <User className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-navy-400" />
        <input name="fullName" required className="input-field pl-11" placeholder="Nom complet" />
      </div>
      <div className="relative">
        <Mail className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-navy-400" />
        <input name="email" type="email" required className="input-field pl-11" placeholder="Adresse email" />
      </div>
      <div className="relative">
        <Phone className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-navy-400" />
        <input name="phone" required className="input-field pl-11" placeholder="Téléphone" />
      </div>
      <div className="relative">
        <Lock className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-navy-400" />
        <input name="password" type="password" required minLength={6} className="input-field pl-11" placeholder="Mot de passe (6 caracteres min.)" />
      </div>

      <SubmitButton />
      </form>
    </div>
  );
}
