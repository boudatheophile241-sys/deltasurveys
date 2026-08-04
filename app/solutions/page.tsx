import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { CTASection } from "@/components/sections/CTASection";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { solutions } from "@/lib/data";
import { getT } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Des solutions sur mesure par secteur : cadastre, mines, génie civil, agriculture de précision, amenagement urbain, energie et reseaux.",
};

export default async function SolutionsPage() {
  const t = await getT();
  return (
    <>
      <PageHero
        eyebrow={t("solutionsPage.eyebrow")}
        title={t("solutionsPage.title")}
        description={t("solutionsPage.desc")}
        breadcrumbs={[{ label: t("nav.home"), href: "/" }, { label: t("nav.solutions") }]}
      />

      <section className="container-page py-16 sm:py-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.05}>
              <div className="group h-full overflow-hidden rounded-2xl border border-navy-100 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-navy-900 text-white transition-transform duration-300 group-hover:scale-110">
                  <Icon name={s.icon} className="h-7 w-7" strokeWidth={1.5} />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold text-navy-900">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-500">
                  {s.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {s.sectors.map((sec) => (
                    <span
                      key={sec}
                      className="rounded-full bg-navy-50 px-3 py-1 text-xs font-medium text-navy-600"
                    >
                      {sec}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <CTASection />
    </>
  );
}
