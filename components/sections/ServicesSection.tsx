"use client";

import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { services as fallbackServices, type Service } from "@/lib/data";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/components/i18n/LocaleProvider";

type ServicesSectionProps = {
  limit?: number;
  items?: Service[];
};

export function ServicesSection({ limit, items }: ServicesSectionProps) {
  const { t } = useTranslation();
  const services = items && items.length > 0 ? items : fallbackServices;
  const list = limit ? services.slice(0, limit) : services;

  return (
    <section className="container-page py-16 sm:py-20">
      <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <SectionHeading
          eyebrow={t("services.eyebrow")}
          title={t("services.title")}
          description={t("services.desc")}
        />
        <Link
          href="/services"
          className="link-underline hidden shrink-0 text-sm font-semibold text-brand-red sm:inline-flex"
        >
          {t("services.all")}
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s, i) => (
          <Reveal key={s.slug} delay={i * 0.05}>
            <div
              id={s.slug}
              className="group flex h-full flex-col rounded-2xl border border-navy-100 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
            >
              <span
                className={cn(
                  "grid h-14 w-14 place-items-center rounded-2xl transition-transform duration-300 group-hover:scale-110",
                  s.accent === "red" ? "bg-rose-50 text-brand-red" : "bg-navy-50 text-navy-700",
                )}
              >
                <Icon name={s.icon} className="h-7 w-7" strokeWidth={1.5} />
              </span>
              <h3 className="mt-5 font-display text-lg font-bold text-navy-900">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-500">
                {s.description}
              </p>
              <ul className="mt-4 space-y-2">
                {s.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-navy-600">
                    <Check className="h-4 w-4 shrink-0 text-brand-red" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-navy-900 transition group-hover:text-brand-red"
              >
                {t("common.learnMore")}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
