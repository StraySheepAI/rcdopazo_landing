// Configuración de destinos "pendientes de decisión" — para no inventar
// silenciosamente una navegación que todavía no fue confirmada.

export interface ConfigurableCta {
  label: string;
  /** null = todavía no tiene destino confirmado; el botón se muestra pero
   *  no navega a ningún lado hasta que se defina acá. */
  href: string | null;
  external?: boolean;
}

// CTA principal de la página personal hacia la puerta progresiva de MPA.
export const EXPLORAR_UNIVERSO_CTA: ConfigurableCta = {
  label: "Explorar el universo",
  href: "/mpa/universe",
};
