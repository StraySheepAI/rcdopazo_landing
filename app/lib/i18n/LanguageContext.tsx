"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { translations, type Locale, type TranslationShape } from "./translations";

const STORAGE_KEY = "rcdopazo-locale";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationShape;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

// Español es el idioma inicial (SSR y primer render siempre arrancan en
// "es" para que no haya salto de contenido entre servidor y cliente). Una
// vez montado en el cliente, se lee la preferencia guardada en
// localStorage (si existe) y se aplica — con eso queda persistida entre
// visitas, en este navegador/dispositivo.
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("es");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "es" || saved === "en") {
        setLocaleState(saved);
      }
    } catch {
      // localStorage no disponible (modo privado, etc.) — se queda en "es".
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // no persiste, pero el cambio de idioma en la sesión actual sigue funcionando.
    }
  };

  const value = useMemo(
    () => ({ locale, setLocale, t: translations[locale] }),
    [locale]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage debe usarse dentro de <LanguageProvider>");
  }
  return ctx;
}
