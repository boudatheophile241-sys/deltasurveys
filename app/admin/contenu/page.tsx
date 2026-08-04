import { getSiteSettings } from "@/lib/queries";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function AdminContenuPage() {
  const settings = await getSiteSettings();
  return (
    <div className="text-white">
      <h1 className="font-display text-2xl font-bold sm:text-3xl">Contenu du site</h1>
      <p className="mt-1 mb-6 text-sm text-white/60">
        Modifiez la bannière et les textes d&apos;accueil. Les changements sont visibles
        immédiatement sur le site.
      </p>
      <div className="rounded-2xl bg-white p-6 sm:p-8">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
