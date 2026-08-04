"use client";

import { Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "./LocaleProvider";
import { locales, type Locale } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useTranslation();
  const router = useRouter();

  const change = (l: Locale) => {
    setLocale(l);
    // Rafraîchit les composants serveur (pages, en-têtes) dans la nouvelle langue.
    router.refresh();
  };

  return (
    <div className={cn("inline-flex items-center gap-1 rounded-full border border-navy-100 bg-navy-50 p-0.5", className)}>
      <Globe className="ml-1.5 h-3.5 w-3.5 text-navy-400" />
      {locales.map((l: Locale) => (
        <button
          key={l}
          onClick={() => change(l)}
          className={cn(
            "rounded-full px-2 py-1 text-xs font-bold uppercase transition",
            locale === l ? "bg-navy-900 text-white" : "text-navy-500 hover:text-navy-800",
          )}
          aria-pressed={locale === l}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
