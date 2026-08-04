"use client";

import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Linkedin,
  Youtube,
  Instagram,
  Clock,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { PaymentIcons } from "@/components/ui/PaymentIcons";
import { company, categories } from "@/lib/data";
import { useTranslation } from "@/components/i18n/LocaleProvider";
import type { DictKey } from "@/lib/i18n/dictionaries";

const quickLinks: { key: DictKey; href: string }[] = [
  { key: "nav.home", href: "/" },
  { key: "nav.products", href: "/produits" },
  { key: "nav.solutions", href: "/solutions" },
  { key: "nav.about", href: "/a-propos" },
  { key: "nav.blog", href: "/blog" },
  { key: "nav.careers", href: "/carrieres" },
  { key: "nav.contact", href: "/contact" },
];

export function Footer({ logoSrc }: { logoSrc?: string }) {
  const { t } = useTranslation();
  return (
    <footer className="bg-navy-950 text-white">
      {/* Bandeau newsletter */}
      <div className="border-b border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-6 py-10 lg:flex-row">
          <div className="max-w-md text-center lg:text-left">
            <h3 className="font-display text-2xl font-bold">{t("footer.newsletter")}</h3>
            <p className="mt-1 text-sm text-white/60">{t("footer.newsletterDesc")}</p>
          </div>
          <NewsletterForm />
        </div>
      </div>

      {/* Corps du footer */}
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo variant="light" src={logoSrc} />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
            {t("footer.about")}
          </p>
          <div className="mt-6 flex gap-3">
            <Social href={company.socials.facebook} label="Facebook">
              <Facebook className="h-4.5 w-4.5" />
            </Social>
            <Social href={company.socials.linkedin} label="LinkedIn">
              <Linkedin className="h-4.5 w-4.5" />
            </Social>
            <Social href={company.socials.youtube} label="YouTube">
              <Youtube className="h-4.5 w-4.5" />
            </Social>
            <Social href={company.socials.instagram} label="Instagram">
              <Instagram className="h-4.5 w-4.5" />
            </Social>
          </div>
        </div>

        <div className="lg:col-span-2">
          <FooterTitle>{t("footer.quickLinks")}</FooterTitle>
          <ul className="space-y-2.5">
            {quickLinks.map((l) => (
              <li key={l.key}>
                <FooterLink href={l.href}>{t(l.key)}</FooterLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <FooterTitle>{t("footer.categories")}</FooterTitle>
          <ul className="space-y-2.5">
            {categories.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <FooterLink href={`/produits?categorie=${c.slug}`}>{c.name}</FooterLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-4">
          <FooterTitle>{t("footer.contact")}</FooterTitle>
          <ul className="space-y-4 text-sm">
            <ContactItem icon={<Phone className="h-4.5 w-4.5" />}>
              <a href={`tel:${company.phoneHref}`} className="hover:text-white">
                {company.phone}
              </a>
            </ContactItem>
            <ContactItem icon={<Mail className="h-4.5 w-4.5" />}>
              <a href={`mailto:${company.email}`} className="hover:text-white">
                {company.email}
              </a>
            </ContactItem>
            <ContactItem icon={<MapPin className="h-4.5 w-4.5" />}>
              {company.addressLong}
            </ContactItem>
            <ContactItem icon={<Clock className="h-4.5 w-4.5" />}>
              {company.hours}
            </ContactItem>
          </ul>

          <FooterTitle className="mt-8">{t("footer.payments")}</FooterTitle>
          <PaymentIcons />
          <p className="mt-2 text-xs text-white/40">
            Paiement en ligne bientôt disponible. Commande via WhatsApp ou à la livraison.
          </p>
        </div>
      </div>

      {/* Bas de page */}
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/50 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {company.legalName}. {t("footer.rights")}
          </p>
          <p>{t("footer.tagline")}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterTitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h4
      className={`mb-4 text-sm font-semibold uppercase tracking-wider text-white ${className}`}
    >
      {children}
    </h4>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm text-white/60 transition hover:translate-x-0.5 hover:text-white inline-block"
    >
      {children}
    </Link>
  );
}

function ContactItem({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3 text-white/60">
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/5 text-brand-red">
        {icon}
      </span>
      <span className="pt-1">{children}</span>
    </li>
  );
}

function Social({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:border-brand-red hover:bg-brand-red hover:text-white"
    >
      {children}
    </a>
  );
}
