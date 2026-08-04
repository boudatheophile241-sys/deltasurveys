"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Send, Loader2, CheckCircle2, AlertCircle, Paperclip } from "lucide-react";
import { submitApplication, type CareerState } from "@/lib/actions/careers";
import { useTranslation } from "@/components/i18n/LocaleProvider";
import type { DictKey } from "@/lib/i18n/dictionaries";

const inputCls = "input-field";
const labelCls = "mb-1.5 block text-sm font-medium text-navy-700";

function SubmitButton({ label, sending }: { label: string; sending: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn h-12 w-full bg-brand-red text-white hover:bg-brand-red-dark">
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" /> {sending}
        </>
      ) : (
        <>
          <Send className="h-4 w-4" /> {label}
        </>
      )}
    </button>
  );
}

function FileField({ label, name, required }: { label: string; name: string; required?: boolean }) {
  return (
    <label className="block">
      <span className={labelCls}>
        {label} {required && <span className="text-brand-red">*</span>}
      </span>
      <div className="flex items-center gap-2 rounded-xl border border-dashed border-navy-200 bg-navy-50/50 px-3 py-2.5">
        <Paperclip className="h-4 w-4 shrink-0 text-navy-400" />
        <input
          type="file"
          name={name}
          required={required}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          multiple={name === "other_docs"}
          className="w-full text-sm text-navy-600 file:mr-3 file:rounded-full file:border-0 file:bg-navy-900 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-navy-800"
        />
      </div>
    </label>
  );
}

export function CareersForm() {
  const { t } = useTranslation();
  const [state, formAction] = useActionState<CareerState, FormData>(submitApplication, null);

  if (state?.status === "success") {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-emerald-100 bg-emerald-50 p-10 text-center">
        <CheckCircle2 className="h-14 w-14 text-emerald-500" />
        <h3 className="mt-4 font-display text-xl font-bold text-navy-900">{t("careers.successTitle")}</h3>
        <p className="mt-2 max-w-md text-sm text-navy-600">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {state?.status === "error" && (
        <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" /> {state.message}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={labelCls}>{t("f.fullName")} <span className="text-brand-red">*</span></span>
          <input name="full_name" required className={inputCls} placeholder={t("f.name")} />
        </label>
        <label className="block">
          <span className={labelCls}>{t("f.phone")} <span className="text-brand-red">*</span></span>
          <input name="phone" required className={inputCls} placeholder="+226 ..." />
        </label>
        <label className="block">
          <span className={labelCls}>{t("f.email")} <span className="text-brand-red">*</span></span>
          <input name="email" type="email" required className={inputCls} placeholder="vous@exemple.com" />
        </label>
        <label className="block">
          <span className={labelCls}>{t("careers.type")} <span className="text-brand-red">*</span></span>
          <select name="type" required defaultValue="stage" className={inputCls}>
            <option value="stage">{t("careers.typeStage")}</option>
            <option value="emploi">{t("careers.typeEmploi")}</option>
            <option value="spontanee">{t("careers.typeSpont")}</option>
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className={labelCls}>{t("careers.position")}</span>
          <input name="position" className={inputCls} placeholder={t("careers.positionPh")} />
        </label>
      </div>

      <label className="block">
        <span className={labelCls}>{t("careers.msg")}</span>
        <textarea name="message" rows={4} className={`${inputCls} resize-none`} placeholder={t("careers.msgPh")} />
      </label>

      <div className="rounded-2xl border border-navy-100 bg-navy-50/40 p-4">
        <p className="mb-4 text-sm font-semibold text-navy-900">{t("careers.docs")}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <FileField label={t("careers.cv")} name="cv" required />
          <FileField label={t("careers.coverLetter")} name="cover_letter" />
          <FileField label={t("careers.internship")} name="internship_request" />
          <FileField label={t("careers.other")} name="other_docs" />
        </div>
      </div>

      <SubmitButton label={t("careers.submit")} sending={t("careers.submitting")} />
      <p className="text-center text-xs text-navy-400">{t("careers.docsNote")}</p>
    </form>
  );
}
