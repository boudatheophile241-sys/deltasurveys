"use client";

import { brands as fallbackBrands, type Brand } from "@/lib/data";
import { Reveal } from "@/components/ui/Reveal";
import { useTranslation } from "@/components/i18n/LocaleProvider";

export function BrandsMarquee({ items }: { items?: Brand[] }) {
  const { t } = useTranslation();
  const brands = items && items.length > 0 ? items : fallbackBrands;
  const loop = [...brands, ...brands];
  return (
    <section className="border-y border-navy-100 bg-white py-14">
      <div className="container-page">
        <Reveal className="mb-8 text-center">
          <span className="eyebrow justify-center">
            <span className="h-px w-6 bg-brand-red" />
            {t("brands.eyebrow")}
          </span>
          <h2 className="mt-3 font-display text-2xl font-bold text-navy-900 sm:text-3xl">
            {t("brands.title")}
          </h2>
        </Reveal>
      </div>

      {/* Bandeau defilant */}
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent" />
        <div className="flex w-max animate-marquee gap-4">
          {loop.map((b, i) => (
            <div
              key={`${b.name}-${i}`}
              className="flex w-52 shrink-0 items-center gap-4 rounded-2xl border border-navy-100 bg-white px-6 py-5 shadow-sm"
            >
              {b.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={b.logo}
                  alt={b.name}
                  className="h-12 w-12 shrink-0 rounded-xl border border-navy-100 bg-white object-contain p-1"
                />
              ) : (
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-navy-900 font-display text-sm font-extrabold text-white">
                  {b.monogram}
                </span>
              )}
              <span className="flex flex-col leading-tight">
                <span className="font-display text-base font-bold text-navy-900">
                  {b.name}
                </span>
                <span className="text-xs text-navy-400">{b.origin}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
