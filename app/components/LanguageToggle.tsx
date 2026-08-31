"use client";

import { useLanguage } from "../lib/i18n/LanguageContext";

// Selector ES/EN — se usa tanto en el header desktop como dentro del menú
// mobile (mismo componente, dos lugares de montaje).
export function LanguageToggle({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div className={`lang-toggle lang-toggle-${variant}`} role="group" aria-label={t.nav.idioma}>
      <button
        type="button"
        className={locale === "es" ? "active" : ""}
        aria-pressed={locale === "es"}
        onClick={() => setLocale("es")}
      >
        ES
      </button>
      <span aria-hidden="true">/</span>
      <button
        type="button"
        className={locale === "en" ? "active" : ""}
        aria-pressed={locale === "en"}
        onClick={() => setLocale("en")}
      >
        EN
      </button>
    </div>
  );
}
