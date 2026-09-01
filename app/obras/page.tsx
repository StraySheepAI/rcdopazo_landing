"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Cosmos } from "../components/Cosmos";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { ObraCard } from "../components/ObraCard";
import { CosmicMotion } from "../components/CosmicMotion";
import { useLanguage } from "../lib/i18n/LanguageContext";
import {
  OBRA_CATEGORIES,
  getFeaturedObras,
  getPublishedObras,
  getObrasByCategory,
  type Obra,
} from "../lib/obras";

// Portada + catálogo transversal de Obras. Una sola grilla dinámica: el
// filtro seleccionado decide qué obras se muestran, nunca hay dos
// listados largos repitiendo Destacadas y después Todas. "Destacadas" es
// la vista inicial por default. Los datos vienen siempre de lib/obras.ts
// — misma fuente que consume Home.
type FilterId = "destacadas" | "todas" | string;

interface FilterOption {
  id: FilterId;
  label: string;
  glyph: string;
  description?: string;
}

export default function ObrasPage() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<FilterId>("destacadas");

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("filtro");
    const allowed = ["destacadas", "todas", ...OBRA_CATEGORIES.map((category) => category.id)];
    if (requested && allowed.includes(requested)) setFilter(requested);
  }, []);

  const filters = useMemo<FilterOption[]>(
    () => [
      { id: "destacadas", label: t.obrasPage.filtroDestacadas, glyph: "★" },
      { id: "todas", label: t.obrasPage.filtroTodas, glyph: "◆" },
      ...OBRA_CATEGORIES.map((c) => ({ id: c.id, label: c.label, glyph: c.glyph, description: c.description })),
    ],
    [t]
  );

  const { obras, emptyMessage } = useMemo<{ obras: Obra[]; emptyMessage: string }>(() => {
    if (filter === "destacadas") {
      return { obras: getFeaturedObras(), emptyMessage: t.obrasPage.vacioDestacadas };
    }
    if (filter === "todas") {
      return { obras: getPublishedObras(), emptyMessage: t.obrasPage.vacioTodas };
    }
    return { obras: getObrasByCategory(filter), emptyMessage: t.obrasPage.vacioCategoria };
  }, [filter, t]);

  const activeFilter = filters.find((f) => f.id === filter);

  return (
    <>
      <Cosmos />
      <CosmicMotion />
      <SiteHeader />

      <main>
        <section className="page-hero">
          <div className="container">
            <nav className="breadcrumb">
              <Link href="/">{t.nav.inicio}</Link>
              <span className="sep">/</span>
              <span className="current">{t.nav.obras}</span>
            </nav>
            <h1>{t.obrasPage.title}</h1>
          </div>
        </section>

        <section className="page-body">
          <div className="container">
            <p>{t.obrasPage.intro}</p>

            <div className="obras-filters" role="tablist" aria-label={t.nav.obras}>
              {filters.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={filter === f.id}
                  className={`filter-chip${filter === f.id ? " active" : ""}`}
                  onClick={() => setFilter(f.id)}
                >
                  <span className="filter-glyph" aria-hidden="true">
                    {f.glyph}
                  </span>
                  <span className="filter-label">{f.label}</span>
                </button>
              ))}
            </div>

            {activeFilter?.description && (
              <p className="filter-description">{activeFilter.description}</p>
            )}

            {obras.length > 0 ? (
              <div className="obras-catalog">
                {obras.map((obra) => (
                  <ObraCard key={obra.id} obra={obra} variant={filter === "destacadas" ? "featured" : "catalog"} />
                ))}
              </div>
            ) : (
              <p className="obras-empty">{emptyMessage}</p>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
