"use client";

import { createContext, useContext, useCallback } from "react";
import { useRouter } from "next/navigation";
import { t as translate, LOCALE_COOKIE } from "./index";
import type { Locale } from "./index";

interface LocaleContextValue {
  locale: Locale;
  dictionary: Record<string, unknown>;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: "en",
  dictionary: {},
});

export function LocaleProvider({
  locale,
  dictionary,
  children,
}: {
  locale: Locale;
  dictionary: Record<string, unknown>;
  children: React.ReactNode;
}) {
  return (
    <LocaleContext.Provider value={{ locale, dictionary }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext).locale;
}

export function useTranslation() {
  const { locale, dictionary } = useContext(LocaleContext);
  const router = useRouter();

  const tFn = useCallback(
    (key: string, params?: Record<string, string | number>) =>
      translate(dictionary, key, params),
    [dictionary]
  );

  const setLocale = useCallback(
    (newLocale: Locale) => {
      document.cookie = `${LOCALE_COOKIE}=${newLocale};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
      router.refresh();
    },
    [router]
  );

  return { t: tFn, locale, setLocale };
}
