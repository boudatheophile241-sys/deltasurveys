"use client";

import Link from "next/link";
import { MessageCircle, Phone, ArrowRight } from "lucide-react";
import { company } from "@/lib/data";
import { whatsappLink } from "@/lib/utils";
import { useTranslation } from "@/components/i18n/LocaleProvider";

export function CTASection() {
  const { t } = useTranslation();
  return (
    <section className="container-page py-16 sm:py-20">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-red to-brand-red-dark px-6 py-14 text-center shadow-glow sm:px-12">
        <div className="absolute inset-0 bg-grid-navy bg-[size:40px_40px] opacity-10" />
        <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-navy-900/20 blur-3xl" />

        <div className="relative mx-auto max-w-2xl">
          <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
            {t("cta.title")}
          </h2>
          <p className="mt-4 text-lg text-white/85">{t("cta.desc")}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={whatsappLink(
                "Bonjour Delta Surveys, je souhaite un accompagnement pour mon projet.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn h-13 bg-white px-8 text-base text-brand-red hover:bg-navy-50"
            >
              <MessageCircle className="h-5 w-5" />
              {t("cta.contact")}
            </a>
            <a
              href={`tel:${company.phoneHref}`}
              className="btn h-13 border border-white/40 bg-white/10 px-8 text-base text-white backdrop-blur hover:bg-white/20"
            >
              <Phone className="h-5 w-5" />
              {company.phone}
            </a>
          </div>
          <Link
            href="/services"
            className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-white/90 underline-offset-4 hover:underline"
          >
            {t("cta.services")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
