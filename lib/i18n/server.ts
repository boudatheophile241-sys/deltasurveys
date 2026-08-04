import { cookies } from "next/headers";
import {
  getDictionary,
  defaultLocale,
  LOCALE_COOKIE,
  type Locale,
  type Dict,
} from "./dictionaries";

/** Lit la langue courante depuis le cookie (côté serveur). */
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  return store.get(LOCALE_COOKIE)?.value === "en" ? "en" : defaultLocale;
}

/** Renvoie la fonction de traduction pour un composant serveur. */
export async function getT(): Promise<(key: keyof Dict) => string> {
  const dict = getDictionary(await getLocale());
  return (key) => dict[key] ?? key;
}
