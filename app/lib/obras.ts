// Fuente única de configuración de OBRAS — consumida por Home (destacadas)
// y por /obras (catálogo completo con filtros). Sin CMS/base de datos
// todavía: es TypeScript simple para no tener que reescribir Home ni
// /obras cuando eso llegue (ver app/admin/README.md para el plan de
// administración real).
//
// Todo lo que una futura administración necesitará controlar (obras,
// categorías, imágenes, botones/links, featured, orden general, orden de
// destacadas, published, filiaciones) ya vive acá, no hardcodeado en los
// componentes visuales.

export interface ObraCategory {
  id: string;
  label: string;
  /** microdescripción del territorio, usada en los filtros de /obras */
  description: string;
  /** símbolo/ícono propio del filtro (texto corto, no un ícono genérico) */
  glyph: string;
}

// Categorías centralizadas y reordenables sin tocar el resto del código.
// Taxonomía inicial, explícitamente NO definitiva — se puede agregar,
// quitar, renombrar o reordenar acá sin reconstruir ninguna página.
// IMPORTANTE: categoría (qué tipo de obra es) es un concepto distinto de
// filiación (a qué línea/ecosistema pertenece, ej. Stray Sheep, MPA
// Publishing House). Las filiaciones nunca se derivan de esta lista.
export const OBRA_CATEGORIES: ObraCategory[] = [
  { id: "libros", label: "Libros", description: "Palabra escrita, publicada o en camino", glyph: "I" },
  { id: "musica", label: "Música", description: "Piezas y proyectos sonoros", glyph: "II" },
  { id: "juegos", label: "Juegos", description: "Mecánicas, mundos jugables", glyph: "III" },
  { id: "apps-experiencias", label: "Apps & Experiencias", description: "Herramientas y experiencias interactivas", glyph: "IV" },
];

export function getCategoryLabel(categoryId: string): string {
  return OBRA_CATEGORIES.find((c) => c.id === categoryId)?.label ?? categoryId;
}

export interface ObraLink {
  /** texto visible del botón — configurable por obra, no genérico */
  label: string;
  /** ruta interna ("/obras/...") o URL externa completa */
  url: string;
  /** true = enlace externo, se abre en pestaña nueva; false/omitido = ruta interna */
  external?: boolean;
}

export interface ObraImages {
  /** portada — usada en el catálogo /obras */
  cover: string;
  /** composición usada cuando la obra aparece destacada en Home; si no
   *  está definida, se reutiliza cover. */
  featured?: string;
}

export interface Obra {
  id: string;
  title: string;
  slug: string;
  /** qué tipo de obra es — NO se confunde con filiación/ecosistema */
  category: string;
  /** descripción breve del cuerpo de la tarjeta */
  description: string;
  /** bajada corta (no todas las obras la van a tener) */
  tagline?: string;
  /** nota chica al pie (ej. "Próximamente en Amazon...") */
  note?: string;
  // Líneas/ecosistemas a los que pertenece la obra — DISTINTO de category.
  // Una obra tiene una categoría y puede tener una o varias filiaciones
  // (Stray Sheep, MPA Publishing House, Lude, etc.), sin que esas
  // filiaciones se conviertan en categorías del catálogo.
  affiliations: string[];
  images: ObraImages;
  /** uno o varios botones, cada uno con su propio texto/destino/apertura */
  links: ObraLink[];
  /** si el público puede verla */
  published: boolean;
  /** decisión editorial explícita: si aparece en la vidriera de destacadas.
   *  Filtrar una categoría NUNCA marca una obra como featured — es siempre
   *  un campo aparte, elegido a mano acá. */
  featured: boolean;
  /** posición dentro del catálogo completo (vista "Todas" y categorías) */
  catalogOrder: number;
  /** posición dentro de la selección destacada (Home y vista "Destacadas") */
  featuredOrder: number;
}

export const OBRAS: Obra[] = [
  {
    id: "que-embole",
    title: "¡Qué Embole!",
    slug: "que-embole",
    category: "libros",
    description:
      "Qué pasa cuando la rutina cómoda se vuelve rígida. Este libro no promete motivación ni organización — promete perspectiva.",
    tagline: "El arte de reconocer la bola antes del colapso.",
    note: "Próximamente en Amazon, Google Play Books, Apple Books y Kobo.",
    affiliations: ["Stray Sheep", "MPA Publishing House"],
    images: {
      cover: "/book-cover.jpg",
      featured: "/book-cover.jpg",
    },
    links: [
      { label: "Edición física (preventa)", url: "https://queembolebook.magiaparaatrevidos.com", external: true },
      { label: "Edición digital", url: "https://store.magiaparaatrevidos.com", external: true },
    ],
    published: true,
    featured: true,
    catalogOrder: 1,
    featuredOrder: 1,
  },
];

/** /obras vista "Destacadas" (default) y Home: selección editorial. */
export function getFeaturedObras(): Obra[] {
  return OBRAS.filter((o) => o.featured && o.published).sort((a, b) => a.featuredOrder - b.featuredOrder);
}

/** /obras vista "Todas": catálogo completo, sin importar si están destacadas. */
export function getPublishedObras(): Obra[] {
  return OBRAS.filter((o) => o.published).sort((a, b) => a.catalogOrder - b.catalogOrder);
}

/** /obras por categoría: solo obras publicadas de esa categoría. */
export function getObrasByCategory(categoryId: string): Obra[] {
  return OBRAS.filter((o) => o.published && o.category === categoryId).sort(
    (a, b) => a.catalogOrder - b.catalogOrder
  );
}
