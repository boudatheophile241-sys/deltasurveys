"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ShieldCheck,
  Globe2,
  Headset,
  ArrowRight,
  FileText,
  Crosshair,
  Satellite,
  Send,
} from "lucide-react";
import { whatsappLink } from "@/lib/utils";
import { useTranslation } from "@/components/i18n/LocaleProvider";
import type { DictKey } from "@/lib/i18n/dictionaries";

const badges: { icon: typeof ShieldCheck; key: DictKey }[] = [
  { icon: ShieldCheck, key: "hero.badge1" },
  { icon: Globe2, key: "hero.badge2" },
  { icon: Headset, key: "hero.badge3" },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.21, 0.5, 0.35, 1] } },
};

export function Hero({
  eyebrow,
  title,
  subtitle,
  image,
}: {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  image?: string;
}) {
  const { t } = useTranslation();
  return (
    <section className="relative overflow-hidden bg-navy-950">
      {/* Fond */}
      {image ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt="Delta Surveys sur le terrain"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950/85 via-navy-950/45 to-navy-950/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/10 to-transparent" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800" />
          <div className="absolute inset-0 bg-grid-navy bg-[size:44px_44px] opacity-[0.15]" />
          <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-brand-red/20 blur-[120px]" />
          <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-navy-500/30 blur-[120px]" />
        </>
      )}

      <div
        className={
          image
            ? "container-page relative flex min-h-[560px] flex-col justify-center py-20 lg:min-h-[680px] lg:py-28"
            : "container-page relative grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24"
        }
      >
        {/* Colonne texte */}
        <motion.div variants={container} initial="hidden" animate="visible" className={image ? "max-w-5xl" : ""}>
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/80 backdrop-blur"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
            {eyebrow || t("hero.badge")}
          </motion.span>

          {title ? (
            <motion.h1
              variants={item}
              className="mt-6 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.55)] sm:text-5xl lg:text-6xl"
            >
              {title}
            </motion.h1>
          ) : (
            <motion.h1
              variants={item}
              className="mt-6 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.55)] sm:text-5xl lg:text-6xl"
            >
              {t("hero.title1")}{" "}
              <span className="text-brand-red">{t("hero.title_topo")}</span> {t("hero.title_and")}{" "}
              <span className="relative whitespace-nowrap">
                {t("hero.title_civil")}
                <svg
                  className="absolute -bottom-2 left-0 h-3 w-full text-brand-red/60"
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                  fill="none"
                >
                  <path d="M2 9C50 3 150 3 198 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
            </motion.h1>
          )}

          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-lg leading-relaxed text-white/90 [text-shadow:0_2px_14px_rgba(0,0,0,0.5)]"
          >
            {subtitle || t("hero.subtitle")}
          </motion.p>

          {/* Badges */}
          <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
            {badges.map((b) => (
              <div
                key={b.key}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/85 backdrop-blur"
              >
                <b.icon className="h-4 w-4 text-brand-red" />
                {t(b.key)}
              </div>
            ))}
          </motion.div>

          {/* Boutons */}
          <motion.div variants={item} className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/produits"
              className="btn h-13 bg-brand-red px-8 text-base text-white shadow-glow hover:bg-brand-red-dark"
            >
              {t("hero.cta_products")}
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href={whatsappLink(
                "Bonjour Delta Surveys, je souhaite demander un devis.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn h-13 border border-white/20 bg-white/5 px-8 text-base text-white backdrop-blur hover:bg-white/10"
            >
              <FileText className="h-5 w-5" />
              {t("hero.cta_quote")}
            </a>
          </motion.div>
        </motion.div>

        {/* Colonne visuelle (uniquement sans photo de fond) */}
        {!image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.21, 0.5, 0.35, 1], delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative mx-auto aspect-square max-w-md">
              {/* Cercles décoratifs */}
              <div className="absolute inset-0 rounded-full border border-white/10" />
              <div className="absolute inset-8 rounded-full border border-white/10" />
              <div className="absolute inset-16 rounded-full border border-dashed border-white/10" />

              {/* Carte instrument centrale */}
              <div className="absolute inset-[22%] grid place-items-center rounded-[2rem] border border-white/15 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl">
                <Crosshair className="h-24 w-24 text-white" strokeWidth={1} />
              </div>

              {/* Chips flottants */}
              <FloatChip className="left-0 top-8" icon={<Satellite className="h-4 w-4 text-brand-red" />} title="Précision RTK" value="8 mm" />
              <FloatChip className="right-0 top-1/3" icon={<Crosshair className="h-4 w-4 text-brand-red" />} title="Portée prisme" value="6 000 m" />
              <FloatChip className="bottom-6 left-4" icon={<Send className="h-4 w-4 text-brand-red" />} title="Autonomie drone" value="55 min" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Vague de transition */}
      <div className="relative">
        <svg className="block h-12 w-full text-white sm:h-16" viewBox="0 0 1440 80" preserveAspectRatio="none" fill="currentColor">
          <path d="M0 80V40c240-40 480-40 720-16s480 24 720-16v72H0Z" />
        </svg>
      </div>
    </section>
  );
}

function FloatChip({
  className = "",
  icon,
  title,
  value,
}: {
  className?: string;
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: [0, -8, 0] }}
      transition={{
        opacity: { duration: 0.6, delay: 0.6 },
        y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
      }}
      className={`absolute flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-lg backdrop-blur-xl ${className}`}
    >
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-white">{icon}</span>
      <span className="flex flex-col leading-tight">
        <span className="text-[11px] text-white/60">{title}</span>
        <span className="font-display text-sm font-bold text-white">{value}</span>
      </span>
    </motion.div>
  );
}
