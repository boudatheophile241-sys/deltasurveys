"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Save, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { saveSettings, type AdminState } from "@/lib/actions/admin";
import { ImageUploader } from "./ImageUploader";
import type { SiteSettings } from "@/lib/queries";

const inputCls =
  "h-11 w-full rounded-xl border border-navy-200 bg-white px-3 text-sm text-navy-900 outline-none focus:border-navy-400";
const labelCls = "mb-1.5 block text-sm font-medium text-navy-700";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn h-11 bg-brand-red px-6 text-sm text-white hover:bg-brand-red-dark">
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      Enregistrer les modifications
    </button>
  );
}

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction] = useActionState<AdminState, FormData>(saveSettings, null);
  const [logo, setLogo] = useState(settings.site_logo ?? "");
  const [heroImage, setHeroImage] = useState(settings.hero_image ?? "");
  const [headerSize, setHeaderSize] = useState(settings.logo_header_size || "80");
  const [footerSize, setFooterSize] = useState(settings.logo_footer_size || "44");

  return (
    <form action={formAction} className="space-y-8">
      {/* Logo & photo */}
      <section className="rounded-2xl border border-navy-100 p-5">
        <h2 className="mb-4 font-display text-lg font-bold text-navy-900">Logo & visuels</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Logo du site</label>
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo} alt="Logo" className="mb-2 h-14 w-auto rounded-lg border border-navy-100 bg-white object-contain p-1" />
            ) : null}
            <div className="mb-2">
              <ImageUploader folder="branding" onUploaded={setLogo} />
            </div>
            <input name="site_logo" value={logo} onChange={(e) => setLogo(e.target.value)} className={inputCls} placeholder="URL du logo (PNG/SVG)" />
            <p className="mt-1 text-xs text-navy-400">Laissez vide pour utiliser le logo par défaut.</p>
          </div>
          <div>
            <label className={labelCls}>Photo d&apos;accueil (Hero)</label>
            {heroImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={heroImage} alt="Hero" className="mb-2 h-24 w-full rounded-lg border border-navy-100 object-cover" />
            ) : null}
            <div className="mb-2">
              <ImageUploader folder="hero" onUploaded={setHeroImage} />
            </div>
            <input name="hero_image" value={heroImage} onChange={(e) => setHeroImage(e.target.value)} className={inputCls} placeholder="URL de la photo d'accueil" />
            <p className="mt-1 text-xs text-navy-400">Affichée dans la section d&apos;accueil.</p>
          </div>
        </div>

        {/* Taille des logos (zoom réglable) */}
        <div className="mt-6 border-t border-navy-100 pt-6">
          <h3 className="mb-1 text-sm font-semibold text-navy-800">Taille des logos</h3>
          <p className="mb-4 text-xs text-navy-400">
            Faites glisser pour agrandir ou réduire. L&apos;aperçu est en direct ; cliquez sur « Enregistrer » pour appliquer au site.
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Logo de l&apos;en-tête — {headerSize} px</label>
              <input
                type="range"
                min={32}
                max={140}
                value={headerSize}
                onChange={(e) => setHeaderSize(e.target.value)}
                className="w-full accent-brand-red"
              />
              <input type="hidden" name="logo_header_size" value={headerSize} />
              <div className="mt-3 flex min-h-[6rem] items-center justify-center rounded-xl border border-navy-100 bg-white p-3">
                {logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logo} alt="Aperçu logo en-tête" style={{ height: `${headerSize}px` }} className="w-auto object-contain" />
                ) : (
                  <span className="text-xs text-navy-400">Ajoutez un logo pour l&apos;aperçu</span>
                )}
              </div>
            </div>
            <div>
              <label className={labelCls}>Logo du pied de page (fond bleu) — {footerSize} px</label>
              <input
                type="range"
                min={32}
                max={140}
                value={footerSize}
                onChange={(e) => setFooterSize(e.target.value)}
                className="w-full accent-brand-red"
              />
              <input type="hidden" name="logo_footer_size" value={footerSize} />
              <div className="mt-3 flex min-h-[6rem] items-center justify-center rounded-xl border border-navy-900 bg-navy-950 p-3">
                {logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logo} alt="Aperçu logo pied de page" style={{ height: `${footerSize}px` }} className="w-auto object-contain" />
                ) : (
                  <span className="text-xs text-white/40">Ajoutez un logo pour l&apos;aperçu</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      {state?.error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" /> {state.error}
        </div>
      )}
      {state?.success && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" /> Contenu mis à jour — le site est actualisé immédiatement.
        </div>
      )}

      {/* Bannière */}
      <section className="rounded-2xl border border-navy-100 p-5">
        <h2 className="mb-4 font-display text-lg font-bold text-navy-900">Bannière d&apos;annonce (haut du site)</h2>
        <label className="mb-4 flex items-center gap-2 text-sm text-navy-700">
          <input type="checkbox" name="banner_enabled" defaultChecked={settings.banner_enabled === "true"} className="h-4 w-4 rounded border-navy-300" />
          Afficher la bannière
        </label>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Texte de la bannière</label>
            <input name="banner_text" defaultValue={settings.banner_text} className={inputCls} placeholder="Ex: Livraison 48h à Ouagadougou · Devis gratuit" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Lien du bouton (optionnel)</label>
              <input name="banner_link" defaultValue={settings.banner_link} className={inputCls} placeholder="/devis" />
            </div>
            <div>
              <label className={labelCls}>Texte du bouton (optionnel)</label>
              <input name="banner_link_label" defaultValue={settings.banner_link_label} className={inputCls} placeholder="Demander un devis" />
            </div>
          </div>
        </div>
      </section>

      {/* Hero */}
      <section className="rounded-2xl border border-navy-100 p-5">
        <h2 className="mb-1 font-display text-lg font-bold text-navy-900">Section d&apos;accueil (Hero)</h2>
        <p className="mb-4 text-xs text-navy-400">Laissez vide pour conserver le texte par défaut du site.</p>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Sur-titre</label>
            <input name="hero_eyebrow" defaultValue={settings.hero_eyebrow} className={inputCls} placeholder="Référence topographie en Afrique de l'Ouest" />
          </div>
          <div>
            <label className={labelCls}>Titre principal</label>
            <input name="hero_title" defaultValue={settings.hero_title} className={inputCls} placeholder="Les meilleures solutions de topographie et de génie civil" />
          </div>
          <div>
            <label className={labelCls}>Sous-titre</label>
            <textarea name="hero_subtitle" defaultValue={settings.hero_subtitle} rows={3} className={`${inputCls} h-auto py-2`} placeholder="Au Burkina Faso et partout en Afrique..." />
          </div>
        </div>
      </section>

      <SubmitButton />
    </form>
  );
}
