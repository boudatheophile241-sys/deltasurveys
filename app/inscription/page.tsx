import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { RegisterForm } from "@/components/forms/RegisterForm";
import { getT } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Créer un compte",
  description: "Créez votre compte client Delta Surveys pour commander et suivre vos devis.",
};

export default async function InscriptionPage() {
  const t = await getT();
  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-navy-50/50 py-16">
      <div className="absolute inset-0 bg-grid-navy bg-[size:44px_44px] opacity-40" />
      <div className="container-page relative flex justify-center">
        <div className="w-full max-w-md rounded-3xl border border-navy-100 bg-white p-8 shadow-card">
          <div className="mb-8 flex flex-col items-center text-center">
            <Logo />
            <h1 className="mt-6 font-display text-2xl font-bold text-navy-900">
              {t("auth.registerTitle")}
            </h1>
            <p className="mt-1 text-sm text-navy-500">{t("auth.registerSub")}</p>
          </div>

          <RegisterForm />

          <p className="mt-6 text-center text-sm text-navy-500">
            {t("auth.haveAccount")}{" "}
            <Link href="/connexion" className="font-semibold text-brand-red hover:underline">
              {t("auth.signin")}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
