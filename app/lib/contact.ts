// Fuente única de datos de contacto de la página PERSONAL de R.C. Dopazo.
// No se comparte con MPA Flow (canal profesional propio) ni con el
// portfolio laboral (puede tener otro correo/LinkedIn): cada contexto
// tiene su propio contacto, este archivo es solo el de esta página.
//
// Pensado para que un futuro administrador pueda activar/desactivar
// canales, editar su texto, su destino y su orden sin tocar componentes.

export type ContactChannelType =
  | "email"
  | "whatsapp"
  | "form"
  | "linkedin"
  | "instagram"
  | "other"
  | "coming-soon";

export interface ContactChannel {
  id: string;
  type: ContactChannelType;
  /** true = visible en la página; false = canal oculto (configurado pero no publicado) */
  enabled: boolean;
  /** posición de aparición */
  order: number;
  /** texto visible (label corto, ej. "Email") */
  label: string;
  /** valor visible principal (ej. la dirección, o "Próximamente") */
  value: string;
  /** destino del enlace, si el canal es clickeable */
  href?: string;
}

// Único correo público de la página personal. Centralizado acá para no
// repetirlo hardcodeado en ningún componente.
export const PERSONAL_EMAIL = "egosumrcdopazo@gmail.com";

export const CONTACT_CHANNELS: ContactChannel[] = [
  {
    id: "email",
    type: "email",
    enabled: true,
    order: 1,
    label: "Email",
    value: PERSONAL_EMAIL,
    href: `mailto:${PERSONAL_EMAIL}`,
  },
  {
    id: "redes",
    type: "coming-soon",
    enabled: true,
    order: 2,
    label: "Redes",
    value: "Próximamente",
  },
];

export function getVisibleContactChannels(): ContactChannel[] {
  return CONTACT_CHANNELS.filter((c) => c.enabled).sort((a, b) => a.order - b.order);
}
