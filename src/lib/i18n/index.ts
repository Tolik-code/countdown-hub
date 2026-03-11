export type Locale = "en" | "uk";
export const SUPPORTED_LOCALES: Locale[] = ["en", "uk"];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "locale";
export const DATE_LOCALE_MAP: Record<Locale, string> = { en: "en-US", uk: "uk-UA" };

import enDict from "./en.json";
import ukDict from "./uk.json";

const dictionaries: Record<Locale, Record<string, unknown>> = {
  en: enDict,
  uk: ukDict,
};

export function getDictionary(locale: Locale): Record<string, unknown> {
  return dictionaries[locale] ?? dictionaries.en;
}

/** Dot-path lookup with interpolation and plural support */
export function t(
  dict: Record<string, unknown>,
  key: string,
  params?: Record<string, string | number>
): string {
  const keys = key.split(".");
  let value: unknown = dict;
  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key; // fallback to key
    }
  }

  // Plural support: value is { one, few, many }
  if (value && typeof value === "object" && "one" in (value as Record<string, unknown>)) {
    const plural = value as Record<string, string>;
    const count = params?.count;
    if (count !== undefined) {
      const rules = new Intl.PluralRules(
        dict === dictionaries.uk ? "uk" : "en"
      );
      const form = rules.select(Number(count));
      value = plural[form] ?? plural.many ?? plural.one;
    } else {
      value = plural.many ?? plural.one;
    }
  }

  if (typeof value !== "string") return key;

  // Interpolation: {placeholder}
  if (params) {
    return value.replace(/\{(\w+)\}/g, (_, p) =>
      params[p] !== undefined ? String(params[p]) : `{${p}}`
    );
  }
  return value;
}
