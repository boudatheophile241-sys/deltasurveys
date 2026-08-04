import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { CTASection } from "@/components/sections/CTASection";
import { BrandsMarquee } from "@/components/sections/BrandsMarquee";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { stats, whyChooseUs } from "@/lib/data";
import { getBrands } from "@/lib/queries";
import { Target, Eye, HeartHandshake } from "lucide-react";

export const metadata: Metadata = {
  title: "A propos",
  description:
    "Delta Surveys, la reference de la vente d'équipements de topographie et de génie civil au Burkina Faso et en Afrique.",
};

const values = [
  {
    icon: Target,
    title: "Notre mission",
    text: "Rendre accessible aux professionnels africains le meilleur de la technologie topographique, avec un accompagnement de proximité.",
  },
  {
    icon: Eye,
    title: "Notre vision",
    text: "Devenir la reference incontournable de la topographie et du génie civil en Afrique de l'Ouest et au-dela.",
  },
  {
    icon: HeartHandshake,
    title: "Nos valeurs",
    text: "Fiabilité, expertise et proximité : nous batissons des relations durables fondees sur la confiance et la performance.",
  },
];

export default async function AProposPage() {
  const brands = await getBrands();
  return (
    <>
      <PageHero
        eyebrow="A propos"
        title="La reference topographie au service de l'Afrique"
        description="Depuis plus de 15 ans, Delta Surveys équipe et accompagne les geometres, ingenieurs et entreprises de BTP avec passion et exigence."
        breadcrumbs={[{ label: "Accueil", href: "/" }, { label: "A propos" }]}
      />

      {/* Intro */}
      <section className="container-page py-16 sm:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <span className="eyebrow mb-3">
              <span className="h-px w-6 bg-brand-red" /> Notre histoire
            </span>
            <h2 className="font-display text-3xl font-bold text-navy-900 sm:text-4xl">
              Une expertise nee du terrain
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-navy-600">
              <p>
                Delta Surveys est nee de la conviction que les professionnels
                africains meritent un accès simple et fiable aux meilleurs
                équipements de topographie et de génie civil.
              </p>
              <p>
                Distributeur agree des plus grandes marques mondiales — Leica,
                Trimble, DJI, Topcon — nous mettons a disposition un matériel
                certifié, un support technique pointu et un service après-vente
                reactif partout en Afrique de l&apos;Ouest.
              </p>
              <p>
                Notre équipe d&apos;ingenieurs topographes et de techniciens
                accompagne chaque client, de la sélection de l&apos;équipement a
                la formation et la maintenance.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-navy-100 bg-white p-6 text-center shadow-card"
                >
                  <p className="font-display text-3xl font-extrabold text-brand-red sm:text-4xl">
                    {s.value}
                  </p>
                  <p className="mt-1 text-sm text-navy-500">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Valeurs */}
      <section className="bg-navy-50/50 py-16 sm:py-20">
        <div className="container-page grid gap-5 md:grid-cols-3">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.06}>
              <div className="h-full rounded-2xl border border-navy-100 bg-white p-7 shadow-card">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-brand-red">
                  <v.icon className="h-7 w-7" strokeWidth={1.5} />
                </span>
                <h3 className="mt-5 font-display text-xl font-bold text-navy-900">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-500">{v.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Engagements */}
      <section className="container-page py-16 sm:py-20">
        <Reveal className="mb-10 text-center">
          <h2 className="font-display text-3xl font-bold text-navy-900 sm:text-4xl">
            Nos engagements envers vous
          </h2>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {whyChooseUs.map((w, i) => (
            <Reveal key={w.title} delay={i * 0.04}>
              <div className="h-full rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-navy-50 text-navy-700">
                  <Icon name={w.icon} className="h-6 w-6" strokeWidth={1.5} />
                </span>
                <h3 className="mt-4 font-display text-base font-bold text-navy-900">
                  {w.title}
                </h3>
                <p className="mt-1.5 text-sm text-navy-500">{w.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <BrandsMarquee items={brands} />
      <CTASection />
    </>
  );
}
