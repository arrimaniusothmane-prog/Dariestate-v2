"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { translations } from "@/lib/i18n";

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const LOCALE_KEY = "darestimate-locale";

function readLocale(): Locale {
  if (typeof window === "undefined") return "fr";
  try {
    const stored = localStorage.getItem(LOCALE_KEY);
    if (stored === "fr" || stored === "ar" || stored === "en") return stored;
  } catch {
    /* ignore */
  }
  return "fr";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fr");

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(LOCALE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const stored = readLocale();
    if (stored !== "fr") setLocaleState(stored);
  }, []);

  const t = useCallback(
    (key: string) => {
      const dict = translations[locale] as Record<string, unknown>;
      return key.split(".").reduce<unknown>((acc, part) => {
        if (acc && typeof acc === "object") {
          return (acc as Record<string, unknown>)[part];
        }
        return undefined;
      }, dict) as string ?? key;
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
