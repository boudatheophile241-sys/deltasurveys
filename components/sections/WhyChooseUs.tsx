"use client";

import { whyChooseUs, stats } from "@/lib/data";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { useTranslation } from "@/components/i18n/LocaleProvider";
import type { DictKey } from "@/lib/i18n/dictionaries";

export function WhyChooseUs() {
  const { t } = useTranslation();
  return (
    <section className="relative overflow-hidden bg-navy-950 py-16 text-white sm:py-20">
      <div className="absolute inset-0 bg-grid-navy bg-[size:44px_44px] opacity-[0.12]" />
      <div className="absolute -right-20 top-0 h-80 w-80 rounded-full bg-brand-red/20 blur-[120px]" />

      <div className="container-page relative">
        <SectionHeading
          light
          align="center"
          eyebrow={t("why.eyebrow")}
          title={t("why.title")}
          description={t("why.desc")}
        />

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.05}>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur">
                <p className="font-display text-3xl font-extrabold text-white sm:text-4xl">
                  {s.value}
                </p>
                <p className="mt-1 text-sm text-white/60">{t(`stat.${i + 1}` as DictKey)}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Avantages */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {whyChooseUs.map((w, i) => (
            <Reveal key={w.title} delay={i * 0.04}>
              <div className="group h-full rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-brand-red/40 hover:bg-white/[0.08]">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-red/15 text-brand-red transition group-hover:bg-brand-red group-hover:text-white">
                  <Icon name={w.icon} className="h-6 w-6" strokeWidth={1.5} />
                </span>
                <h3 className="mt-4 font-display text-base font-bold text-white">
                  {t(`why.t${i + 1}` as DictKey)}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/60">
                  {t(`why.d${i + 1}` as DictKey)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
