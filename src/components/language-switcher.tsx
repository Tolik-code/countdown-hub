"use client";

import { useTranslation } from "@/lib/i18n/locale-context";
import type { Locale } from "@/lib/i18n";

const locales: { code: Locale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "uk", label: "UA" },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  return (
    <div className="flex items-center rounded-md border text-xs">
      {locales.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => setLocale(code)}
          className={`px-2 py-1 transition-colors ${
            locale === code
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          } ${code === "en" ? "rounded-l-md" : "rounded-r-md"}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
