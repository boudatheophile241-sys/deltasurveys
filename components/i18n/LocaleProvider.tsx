"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import {
  dictionaries,
  defaultLocale,
  LOCALE_COOKIE,
  type Locale,
  type DictKey,
} from "@/lib/i18n/dictionaries";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: DictKey) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  initialLocale = defaultLocale,
  children,
}: {
  initialLocale?: Locale;
  children: ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      document.cookie = `${LOCALE_COOKIE}=${l};path=/;max-age=31536000`;
      localStorage.setItem(LOCALE_COOKIE, l);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback(
    (key: DictKey) => dictionaries[locale][key] ?? dictionaries.fr[key] ?? key,
    [locale],
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useTranslation doit être utilisé dans un LocaleProvider");
  return ctx;
}
