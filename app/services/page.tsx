import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { CTASection } from "@/components/sections/CTASection";
import { getServices } from "@/lib/queries";
import { getT } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Topographie, géomatique, expertise foncière, BTP, gestion immobilière, formation et maintenance : l'expertise complète de Delta Surveys.",
};

export default async function ServicesPage() {
  const [services, t] = await Promise.all([getServices(), getT()]);
  return (
    <>
      <PageHero
        eyebrow={t("servicesPage.eyebrow")}
        title={t("servicesPage.title")}
        description={t("servicesPage.desc")}
        breadcrumbs={[{ label: t("nav.home"), href: "/" }, { label: t("nav.services") }]}
      />
      <ServicesSection items={services} />
      <CTASection />
    </>
  );
}
