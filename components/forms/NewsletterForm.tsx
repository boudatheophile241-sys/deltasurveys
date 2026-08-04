"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { subscribeNewsletter, type LeadState } from "@/lib/actions/leads";
import { useTranslation } from "@/components/i18n/LocaleProvider";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn h-12 shrink-0 bg-brand-red px-6 text-sm font-semibold text-white hover:bg-brand-red-dark"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : label}
      {!pending && <ArrowRight className="h-4 w-4" />}
    </button>
  );
}

export function NewsletterForm() {
  const { t } = useTranslation();
  const [state, formAction] = useActionState<LeadState, FormData>(
    subscribeNewsletter,
    null,
  );

  if (state?.status === "success") {
    return (
      <div className="flex w-full max-w-md items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-5 py-3 text-sm text-emerald-300">
        <CheckCircle2 className="h-4 w-4 shrink-0" /> {state.message}
      </div>
    );
  }

  return (
    <form action={formAction} className="w-full max-w-md">
      <div className="flex items-center gap-2">
        <input
          type="email"
          name="email"
          required
          placeholder={t("common.email")}
          className="h-12 w-full rounded-full border border-white/15 bg-white/5 px-5 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/40 focus:bg-white/10"
        />
        <SubmitButton label={t("footer.subscribe")} />
      </div>
      {state?.status === "error" && (
        <p className="mt-2 pl-4 text-xs text-red-300">{state.message}</p>
      )}
    </form>
  );
}
