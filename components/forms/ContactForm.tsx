"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Send, CheckCircle2, AlertCircle, Loader2, MessageCircle } from "lucide-react";
import { submitMessage, submitQuote, type LeadState } from "@/lib/actions/leads";
import { whatsappLink } from "@/lib/utils";
import { useTranslation } from "@/components/i18n/LocaleProvider";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn h-12 w-full bg-brand-red text-white hover:bg-brand-red-dark"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" /> Envoi...
        </>
      ) : (
        <>
          <Send className="h-4 w-4" /> {label}
        </>
      )}
    </button>
  );
}

export function ContactForm({
  variant = "message",
  productSlug,
}: {
  variant?: "message" | "quote";
  productSlug?: string;
}) {
  const { t } = useTranslation();
  const action = variant === "quote" ? submitQuote : submitMessage;
  const [state, formAction] = useActionState<LeadState, FormData>(action, null);

  if (state?.status === "success") {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 p-10 text-center">
        <CheckCircle2 className="h-14 w-14 text-emerald-500" />
        <h3 className="mt-4 font-display text-xl font-bold text-navy-900">
          {state.message}
        </h3>
        <p className="mt-2 max-w-sm text-sm text-navy-600">{t("f.successNote")}</p>
        <a
          href={whatsappLink(
            "Bonjour Delta Surveys, je viens de vous envoyer une demande via le site.",
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="btn mt-5 h-11 bg-[#25D366] px-6 text-sm text-white hover:bg-[#1eb257]"
        >
          <MessageCircle className="h-4 w-4" /> {t("f.whatsapp")}
        </a>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {productSlug && <input type="hidden" name="productSlug" value={productSlug} />}

      {state?.status === "error" && (
        <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" /> {state.message}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("f.fullName")} required>
          <input name="name" required className="input-field" placeholder={t("f.name")} />
        </Field>
        <Field label={t("f.phone")} required>
          <input name="phone" required className="input-field" placeholder="+226 ..." />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("f.email")}>
          <input name="email" type="email" className="input-field" placeholder="vous@exemple.com" />
        </Field>
        <Field label={t("f.subject")} required>
          <input
            name="subject"
            required
            defaultValue={variant === "quote" ? "Demande de devis" : ""}
            className="input-field"
            placeholder="Objet de votre demande"
          />
        </Field>
      </div>
      <Field label={t("f.message")} required>
        <textarea
          name="message"
          required
          rows={5}
          className="input-field resize-none"
          placeholder={
            variant === "quote"
              ? "Decrivez le matériel souhaite, les quantites, votre projet..."
              : "Decrivez votre besoin, votre projet ou votre demande..."
          }
        />
      </Field>
      <SubmitButton label={variant === "quote" ? t("f.sendQuote") : t("f.send")} />
      <p className="text-center text-xs text-navy-400">{t("f.securedNote")}</p>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-navy-700">
        {label} {required && <span className="text-brand-red">*</span>}
      </span>
      {children}
    </label>
  );
}
