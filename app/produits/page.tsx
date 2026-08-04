import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { ProductsExplorer } from "@/components/product/ProductsExplorer";
import { getProducts, getCategories, getBrands, getFavoriteIds } from "@/lib/queries";
import { getT } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Produits",
  description:
    "Decouvrez notre catalogue d'équipements de topographie, geomatique et génie civil : stations totales, GPS GNSS, drones, niveaux, lasers et accessoires.",
};

export default async function ProduitsPage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string; q?: string }>;
}) {
  const { categorie = "", q = "" } = await searchParams;
  const [products, categories, brands, favoriteIds, t] = await Promise.all([
    getProducts(),
    getCategories(),
    getBrands(),
    getFavoriteIds(),
    getT(),
  ]);
  const cat = categories.find((c) => c.slug === categorie);

  return (
    <>
      <PageHero
        eyebrow={t("page.catalog")}
        title={cat ? cat.name : t("produits.title")}
        description={cat ? cat.description : t("produits.desc")}
        breadcrumbs={[
          { label: t("nav.home"), href: "/" },
          { label: t("nav.products"), href: "/produits" },
          ...(cat ? [{ label: cat.name }] : []),
        ]}
      />
      <ProductsExplorer
        initialCategory={categorie}
        initialQuery={q}
        products={products}
        categories={categories}
        brands={brands}
        favoriteIds={favoriteIds}
      />
    </>
  );
}
