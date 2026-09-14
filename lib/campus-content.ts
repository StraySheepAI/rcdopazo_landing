export type CampusLanguage = "es" | "en";
export type CampusBlock = { id: string; type: "text" | "image" | "video" | "audio" | "download" | "prompt"; content: string; url?: string };
export type CampusStage = { id: string; name: string; label: string; title: string; body: string; mediaUrl: string; blocks: CampusBlock[] };
export type CampusLocaleContent = { eyebrow: string; hero: string; subtitle: string; stages: CampusStage[] };
export type CampusExperience = {
  slug: "principios-universales";
  version: number;
  updatedAt: string;
  updatedBy: "editor" | "architect" | "system";
  locales: Record<CampusLanguage, CampusLocaleContent>;
};

const ids = ["preparacion", "umbral", "siete-lentes", "hacer-hablar", "laboratorio", "el-tercero", "integracion"];
const es = [
  ["Preparación", "Antes del encuentro · 5 minutos", "Prepará una realidad que hoy te esté ocupando.", "No hace falta que sea extraordinaria. Elegí una conversación, una decisión, un vínculo o una situación que parezca tener una sola explicación."],
  ["Umbral", "Minutos 0–8", "¿Creamos la realidad o participamos en las configuraciones que la vuelven posible?", "Crear tu realidad no significa controlar todo lo que sucede. Significa reconocer que observamos, elegimos y actuamos dentro de relaciones que también nos configuran."],
  ["Siete lentes", "Biblioteca de las siete lentes", "Leé, abrí y probá cada principio", "No hace falta memorizar. Cada lente contiene una lectura completa, una precisión MPA y una pregunta para llevar a tu propia experiencia."],
  ["Hacer hablar", "Imagen · minutos 18–28", "Hacer hablar sin explicar demasiado pronto.", "Durante el encuentro vas a recibir una imagen sin explicación previa. Tu tarea no es adivinar qué significa: es observar cómo tu mirada completa lo que la imagen no dice."],
  ["Laboratorio", "Minutos 28–38", "La relación produce una función que ninguna parte contiene sola.", "Vas a ver cómo piezas que por separado no iluminan nada producen una función cuando entran en relación."],
  ["El tercero", "Experiencia central · minutos 38–52", "El tercero que no estabas mirando", "Tomá la situación inicial y separá las dos fuerzas que estabas tratando como únicas. Después observá qué sistema producen juntas."],
  ["Integración", "Minutos 52–60", "No salgas con una respuesta. Salí con una observación más precisa.", "Registrá un movimiento posible que haya aparecido después de observar la configuración."],
];
const en = [
  ["Preparation", "Before the session · 5 minutes", "Bring one reality that is occupying you today.", "Choose a conversation, decision, relationship or situation that seems to have only one explanation."],
  ["Threshold", "Minutes 0–8", "Do we create reality, or take part in the configurations that make it possible?", "Creating your reality does not mean controlling everything. It means recognizing how we observe, choose and act within relationships that also configure us."],
  ["Seven lenses", "Library of the seven lenses", "Read, open and test each principle", "You do not need to memorize. Each lens contains a complete reading, an MPA clarification and a question to bring into your own experience."],
  ["Make it speak", "Image · minutes 18–28", "Make the image speak without explaining too soon.", "During the live session you will receive an image with no previous explanation. Observe how your gaze completes what the image does not say."],
  ["Laboratory", "Minutes 28–38", "A relationship produces a function that no part contains alone.", "Pieces that cannot illuminate anything on their own produce a function when they enter into relationship."],
  ["The third", "Core experience · minutes 38–52", "The third you were not looking at", "Return to your initial situation, separate the two forces you were treating as the only ones, and observe the system they produce together."],
  ["Integration", "Minutes 52–60", "Do not leave with an answer. Leave with a more precise observation.", "Record one possible movement that appeared after observing the configuration."],
];

function stages(source: string[][]): CampusStage[] {
  return source.map(([name, label, title, body], index) => ({ id: ids[index], name, label, title, body, mediaUrl: "", blocks: [] }));
}

export const DEFAULT_CAMPUS_EXPERIENCE: CampusExperience = {
  slug: "principios-universales",
  version: 1,
  updatedAt: "",
  updatedBy: "system",
  locales: {
    es: { eyebrow: "Introducción a los principios universales", hero: "Su papel en la creación de tu realidad", subtitle: "Una perspectiva metalkímica de MPA", stages: stages(es) },
    en: { eyebrow: "Introduction to universal principles", hero: "Their role in creating your reality", subtitle: "An MPA metalkimical perspective", stages: stages(en) },
  },
};

export function isCampusExperience(value: unknown): value is CampusExperience {
  if (!value || typeof value !== "object") return false;
  const data = value as Partial<CampusExperience>;
  return data.slug === "principios-universales" && Boolean(data.locales?.es?.stages?.length) && Boolean(data.locales?.en?.stages?.length);
}
