import { cookies } from "next/headers";
import { getDictionary, DEFAULT_LOCALE, LOCALE_COOKIE, SUPPORTED_LOCALES } from "./index";
import type { Locale } from "./index";

export async function getLocaleFromCookies(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;
  if (value && SUPPORTED_LOCALES.includes(value as Locale)) {
    return value as Locale;
  }
  return DEFAULT_LOCALE;
}

export async function getServerDictionary() {
  const locale = await getLocaleFromCookies();
  const dictionary = getDictionary(locale);
  return { locale, dictionary };
}

/** Helper for server components: t(dict, key, params) */
export { t } from "./index";
