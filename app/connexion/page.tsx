import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { LoginForm } from "@/components/forms/LoginForm";
import { getT } from "@/lib/i18n/server";
import { getSiteSettings } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous a votre espace client Delta Surveys.",
};

export default async function ConnexionPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;
  const t = await getT();
  const settings = await getSiteSettings();
  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-navy-50/50 py-16">
      <div className="absolute inset-0 bg-grid-navy bg-[size:44px_44px] opacity-40" />
      <div className="container-page relative flex justify-center">
        <div className="w-full max-w-md rounded-3xl border border-navy-100 bg-white p-8 shadow-card">
          <div className="mb-8 flex flex-col items-center text-center">
            <Logo src={settings.site_logo || undefined} imgClassName="h-20" />
            <h1 className="mt-6 font-display text-2xl font-bold text-navy-900">
              {t("auth.loginTitle")}
            </h1>
            <p className="mt-1 text-sm text-navy-500">{t("auth.loginSub")}</p>
          </div>

          <LoginForm redirectTo={redirect} />

          <p className="mt-6 text-center text-sm text-navy-500">
            {t("auth.noAccount")}{" "}
            <Link href="/inscription" className="font-semibold text-brand-red hover:underline">
              {t("header.register")}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
