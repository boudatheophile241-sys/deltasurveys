import type { Metadata } from "next";
import { GraduationCap, TrendingUp, Users, HeartHandshake } from "lucide-react";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { CareersForm } from "@/components/forms/CareersForm";
import { getT } from "@/lib/i18n/server";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Carrières",
  description:
    "Rejoignez Delta Surveys : déposez votre candidature ou votre demande de stage. Étudiants et professionnels de la topographie, du génie civil et de la géomatique.",
};

const perks = [
  { icon: GraduationCap, tk: "careers.p1t", dk: "careers.p1d" },
  { icon: TrendingUp, tk: "careers.p2t", dk: "careers.p2d" },
  { icon: Users, tk: "careers.p3t", dk: "careers.p3d" },
  { icon: HeartHandshake, tk: "careers.p4t", dk: "careers.p4d" },
] as const;

export default async function CarrieresPage() {
  const t = await getT();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <>
      <PageHero
        eyebrow={t("careersPage.eyebrow")}
        title={t("careersPage.title")}
        description={t("careersPage.desc")}
        breadcrumbs={[{ label: t("nav.home"), href: "/" }, { label: t("nav.careers") }]}
      />

      <section className="container-page py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Pourquoi nous rejoindre */}
          <div>
            <h2 className="font-display text-2xl font-bold text-navy-900">{t("careers.why")}</h2>
            <p className="mt-2 text-sm text-navy-500">{t("careers.whyDesc")}</p>
            <div className="mt-6 space-y-4">
              {perks.map((p) => (
                <div key={p.tk} className="flex items-start gap-4 rounded-2xl border border-navy-100 bg-white p-4 shadow-card">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-rose-50 text-brand-red">
                    <p.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-navy-900">{t(p.tk)}</p>
                    <p className="mt-0.5 text-sm text-navy-500">{t(p.dk)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Formulaire (compte requis) */}
          <div className="rounded-3xl border border-navy-100 bg-white p-6 shadow-card sm:p-8">
            <h2 className="font-display text-2xl font-bold text-navy-900">{t("careers.apply")}</h2>
            <p className="mt-1 mb-6 text-sm text-navy-500">{t("careers.applyDesc")}</p>
            {user ? (
              <CareersForm />
            ) : (
              <div className="flex flex-col items-center rounded-2xl border border-dashed border-navy-200 bg-navy-50/50 px-6 py-12 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-rose-50 text-brand-red">
                  <LogIn className="h-7 w-7" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-navy-900">
                  {t("careers.authRequired")}
                </h3>
                <p className="mt-2 max-w-sm text-sm text-navy-500">{t("careers.authDesc")}</p>
                <Link
                  href="/connexion?redirect=/carrieres"
                  className="btn mt-6 h-12 bg-brand-red px-8 text-sm text-white hover:bg-brand-red-dark"
                >
                  <LogIn className="h-4 w-4" /> {t("careers.signInApply")}
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
