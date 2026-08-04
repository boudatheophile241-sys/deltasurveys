"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Mail, Lock, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { login, type AuthState } from "@/lib/actions/auth";
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
          <Loader2 className="h-4 w-4 animate-spin" /> Connexion...
        </>
      ) : (
        <>
          Se connecter <ArrowRight className="h-4 w-4" />
        </>
      )}
    </button>
  );
}

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const [state, formAction] = useActionState<AuthState, FormData>(login, null);

  return (
    <div className="space-y-4">
      <SocialAuth redirectTo={redirectTo} />
      <form action={formAction} className="space-y-4">
      {redirectTo && <input type="hidden" name="redirect" value={redirectTo} />}

      {state?.error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </div>
      )}

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-navy-700">Email</span>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-navy-400" />
          <input name="email" type="email" required className="input-field pl-11" placeholder="vous@exemple.com" />
        </div>
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-navy-700">Mot de passe</span>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-navy-400" />
          <input name="password" type="password" required className="input-field pl-11" placeholder="••••••••" />
        </div>
      </label>

      <SubmitButton />
      </form>
    </div>
  );
}
