import type { Metadata } from "next";
import { FileText, Check } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { getT } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Demander un devis",
  description:
    "Demandez un devis gratuit et personnalisé pour vos équipements de topographie et de génie civil.",
};

export default async function DevisPage({
  searchParams,
}: {
  searchParams: Promise<{ produit?: string }>;
}) {
  const { produit } = await searchParams;
  const t = await getT();
  const steps = [t("devis.step1"), t("devis.step2"), t("devis.step3"), t("devis.step4")];
  return (
    <>
      <PageHero
        eyebrow={t("devisPage.eyebrow")}
        title={t("devisPage.title")}
        description={t("devisPage.desc")}
        breadcrumbs={[{ label: t("nav.home"), href: "/" }, { label: t("hero.cta_quote") }]}
      />

      <section className="container-page py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-brand-red">
              <FileText className="h-7 w-7" />
            </span>
            <h2 className="mt-5 font-display text-2xl font-bold text-navy-900">
              {t("devis.how")}
            </h2>
            <ol className="mt-6 space-y-4">
              {steps.map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-navy-900 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 text-sm text-navy-600">{s}</span>
                </li>
              ))}
            </ol>
            <div className="mt-8 rounded-2xl border border-navy-100 bg-navy-50/50 p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-navy-900">
                <Check className="h-4 w-4 text-brand-red" /> {t("devis.free")}
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-navy-100 bg-white p-6 shadow-card sm:p-8">
            <ContactForm variant="quote" productSlug={produit} />
          </div>
        </div>
      </section>
    </>
  );
}
