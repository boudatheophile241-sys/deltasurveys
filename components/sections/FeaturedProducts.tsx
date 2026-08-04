"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { featuredProducts as fallback, type Product } from "@/lib/data";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { useTranslation } from "@/components/i18n/LocaleProvider";

export function FeaturedProducts({
  items,
  favoriteIds = [],
}: {
  items?: Product[];
  favoriteIds?: string[];
}) {
  const { t } = useTranslation();
  const featuredProducts = items && items.length > 0 ? items : fallback;
  const favSet = new Set(favoriteIds);
  return (
    <section className="bg-navy-50/50 py-16 sm:py-20">
      <div className="container-page">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow={t("feat.eyebrow")}
            title={t("feat.title")}
            description={t("feat.desc")}
          />
          <Link
            href="/produits"
            className="btn h-11 shrink-0 border border-navy-200 bg-white px-5 text-sm text-navy-800 hover:bg-navy-50"
          >
            {t("feat.all")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06}>
              <ProductCard product={p} initialFavorite={favSet.has(p.id)} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
