import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { CartView } from "@/components/cart/CartView";
import { getT } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Mon panier",
  description: "Consultez les articles de votre panier et passez commande.",
};

export default async function PanierPage() {
  const t = await getT();
  return (
    <>
      <PageHero
        eyebrow={t("cartPage.eyebrow")}
        title={t("cartPage.title")}
        breadcrumbs={[{ label: t("nav.home"), href: "/" }, { label: t("cartPage.eyebrow") }]}
      />
      <section className="container-page py-12 sm:py-16">
        <CartView />
      </section>
    </>
  );
}
