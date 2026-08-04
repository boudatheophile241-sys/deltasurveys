"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories as fallback, type Category } from "@/lib/data";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/components/i18n/LocaleProvider";

export function CategoriesGrid({ items }: { items?: Category[] }) {
  const { t } = useTranslation();
  const categories = items && items.length > 0 ? items : fallback;
  return (
    <section className="container-page py-16 sm:py-20">
      <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <SectionHeading
          eyebrow={t("cat.eyebrow")}
          title={t("cat.title")}
          description={t("cat.desc")}
        />
        <Link
          href="/produits"
          className="link-underline hidden shrink-0 text-sm font-semibold text-brand-red sm:inline-flex"
        >
          {t("cat.viewAll")}
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
        {categories.map((cat, i) => (
          <Reveal key={cat.slug} delay={i * 0.04}>
            <Link
              href={`/produits?categorie=${cat.slug}`}
              className="group relative flex h-full items-center gap-4 overflow-hidden rounded-2xl border border-navy-100 bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-navy-200 hover:shadow-card-hover"
            >
              <span
                className={cn(
                  "grid h-14 w-14 shrink-0 place-items-center rounded-2xl transition-transform duration-300 group-hover:scale-110",
                  cat.accent === "red"
                    ? "bg-rose-50 text-brand-red"
                    : "bg-navy-50 text-navy-700",
                )}
              >
                <Icon name={cat.icon} className="h-7 w-7" strokeWidth={1.5} />
              </span>
              <div className="min-w-0">
                <h3 className="truncate font-display text-base font-bold text-navy-900">
                  {cat.name}
                </h3>
                <p className="truncate text-xs text-navy-500">{cat.description}</p>
                <span className="mt-1 inline-block text-xs font-semibold text-navy-400">
                  {cat.count} {t("cat.count")}
                </span>
              </div>
              <ArrowUpRight className="ml-auto h-5 w-5 shrink-0 text-navy-300 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-red" />
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
