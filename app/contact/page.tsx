import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { company } from "@/lib/data";
import { whatsappLink } from "@/lib/utils";
import { getT } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez Delta Surveys pour un conseil, un devis ou une commande. Notre équipe vous répond rapidement au Burkina Faso et en Afrique.",
};

export default async function ContactPage() {
  const t = await getT();
  const infos = [
    { icon: Phone, label: t("contact.labelPhone"), value: company.phone, href: `tel:${company.phoneHref}` },
    { icon: Mail, label: t("contact.labelEmail"), value: company.email, href: `mailto:${company.email}` },
    { icon: MapPin, label: t("contact.labelAddress"), value: company.addressLong },
    { icon: Clock, label: t("contact.labelHours"), value: company.hours },
  ];
  return (
    <>
      <PageHero
        eyebrow={t("contactPage.eyebrow")}
        title={t("contactPage.title")}
        description={t("contactPage.desc")}
        breadcrumbs={[{ label: t("nav.home"), href: "/" }, { label: t("nav.contact") }]}
      />

      <section className="container-page py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          {/* Infos */}
          <div>
            <h2 className="font-display text-2xl font-bold text-navy-900">
              {t("contact.coords")}
            </h2>
            <p className="mt-2 text-sm text-navy-500">{t("contact.coordsDesc")}</p>

            <div className="mt-8 space-y-4">
              {infos.map((info) => {
                const content = (
                  <div className="flex items-start gap-4 rounded-2xl border border-navy-100 bg-white p-5 shadow-card transition hover:border-navy-200">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-rose-50 text-brand-red">
                      <info.icon className="h-6 w-6" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">
                        {info.label}
                      </p>
                      <p className="mt-0.5 font-medium text-navy-900">{info.value}</p>
                    </div>
                  </div>
                );
                return info.href ? (
                  <a key={info.label} href={info.href} className="block">
                    {content}
                  </a>
                ) : (
                  <div key={info.label}>{content}</div>
                );
              })}
            </div>

            <a
              href={whatsappLink(
                "Bonjour Delta Surveys, je souhaite obtenir des informations.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn mt-6 h-12 w-full bg-[#25D366] text-white hover:bg-[#1eb257]"
            >
              <MessageCircle className="h-5 w-5" />
              {t("f.whatsapp")}
            </a>
          </div>

          {/* Formulaire */}
          <div className="rounded-3xl border border-navy-100 bg-white p-6 shadow-card sm:p-8">
            <h2 className="font-display text-2xl font-bold text-navy-900">
              {t("contact.sendMsg")}
            </h2>
            <p className="mt-1 mb-6 text-sm text-navy-500">{t("contact.fill")}</p>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
