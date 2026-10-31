import { normalize } from "./text.ts";

export type WordMap = {
  origen?: { lengua: string; forma: string };
  recorrido?: { lengua: string; forma: string }[];
  piezas?: { forma: string; funcion: string }[];
  ramas: { titulo: string; formas: string[] }[];
};
const noun = (plural: string, family: string[] = []): WordMap => ({ ramas: [
  { titulo: "Plural", formas: [plural] },
  ...(family.length ? [{ titulo: "Familia de palabras", formas: family }] : []),
] });
const verb = (base: string, theme: string, forms: string[]): WordMap => ({
  piezas: [{ forma: `${base}-`, funcion: "Base verbal" }, { forma: `-${theme}-`, funcion: "Vocal de la conjugación" }, { forma: "-r", funcion: "Infinitivo" }],
  ramas: [{ titulo: "Al conjugar", formas: forms }],
});

// Explicit editorial data. Never infer word parts by cutting a prose paragraph
// or treat a lexical relative as an ancestor. The full evidence stays in the reading.
const maps: Record<string, WordMap> = {
  devocion: noun("devociones", ["devoto", "devota"]),
  molde: noun("moldes"),
  ambicion: noun("ambiciones", ["ambicioso", "ambicionar"]),
  ausencia: noun("ausencias", ["ausente"]),
  control: noun("controles", ["controlar", "controlador"]),
  deseo: noun("deseos", ["desear", "deseoso"]),
  ego: noun("egos"),
  embole: { ...noun("emboles", ["embolar"]), piezas: [{ forma: "embol-", funcion: "Base verbal" }, { forma: "-e", funcion: "Forma el sustantivo" }] },
  esfuerzo: noun("esfuerzos", ["esforzar"]),
  exito: noun("éxitos"), fama: noun("famas"),
  fracaso: noun("fracasos", ["fracasar", "fracasado"]),
  juego: noun("juegos", ["jugar", "jugador"]),
  merito: noun("méritos"), miedo: noun("miedos", ["miedoso"]),
  obediencia: noun("obediencias", ["obedecer", "obediente"]),
  orgullo: noun("orgullos", ["orgulloso"]), patrana: noun("patrañas"),
  persona: noun("personas", ["personaje", "personal", "personificar"]),
  productividad: { ...noun("productividades", ["productivo"]), piezas: [{ forma: "productiv-", funcion: "Base de productivo" }, { forma: "-idad", funcion: "Forma un nombre de cualidad" }] },
  realidad: { ...noun("realidades", ["real"]), piezas: [{ forma: "real", funcion: "Base adjetiva" }, { forma: "-idad", funcion: "Forma un nombre de cualidad" }] },
  rutina: noun("rutinas", ["rutinario"]), sacrificio: noun("sacrificios", ["sacrificar", "sacrificial"]),
  sumision: noun("sumisiones", ["sumiso", "someter"]), tiempo: noun("tiempos", ["temporal"]),
  trabajo: { ...noun("trabajos", ["trabajar"]), piezas: [{ forma: "trabaj-", funcion: "Base verbal" }, { forma: "-o", funcion: "Forma el sustantivo" }] },
  transmutacion: { ...noun("transmutaciones", ["transmutar", "trasmutación"]), piezas: [{ forma: "transmuta-", funcion: "Base del verbo transmutar" }, { forma: "-ción", funcion: "Nombre de acción o resultado" }] },
  virtud: noun("virtudes", ["virtuoso"]),
  deber: verb("deb", "e", ["debo", "debés", "debía"]),
  educar: verb("educ", "a", ["educo", "educás", "educaba"]),
  empezar: verb("empez", "a", ["empiezo", "empezás", "empezaba"]),
  ganar: verb("gan", "a", ["gano", "ganás", "ganaba"]),
  perder: verb("perd", "e", ["pierdo", "perdés", "perdía"]),
  volver: verb("volv", "e", ["vuelvo", "volvés", "volvía"]),
  correcto: { ramas: [{ titulo: "Género y número", formas: ["correcto", "correcta", "correctos", "correctas"] }, { titulo: "Familia de palabras", formas: ["corregir", "corrección"] }] },
  normal: { ramas: [{ titulo: "Singular → plural", formas: ["normal → normales"] }, { titulo: "Familia de palabras", formas: ["norma"] }] },
  presente: { ramas: [{ titulo: "Singular → plural", formas: ["presente → presentes"] }, { titulo: "Familia de palabras", formas: ["presencia", "presentar"] }] },
  common: {
    recorrido: [{ lengua: "Latín", forma: "communis" }, { lengua: "Francés antiguo", forma: "comun" }],
    piezas: [{ forma: "common", funcion: "Base léxica en el inglés actual" }],
    ramas: [
      { titulo: "Comparativo", formas: ["more common", "commoner"] },
      { titulo: "Superlativo", formas: ["most common", "commonest"] },
      { titulo: "Género y número", formas: ["a common interest → common interests"] },
    ],
  },
  right: { ramas: [{ titulo: "Como sustantivo", formas: ["right → rights"] }, { titulo: "Palabra derivada", formas: ["rightness"] }] },
  work: { ramas: [{ titulo: "Como verbo", formas: ["work", "works", "worked", "working"] }, { titulo: "Palabra derivada", formas: ["worker"] }] },
  influencer: { ...noun("influencers"), piezas: [{ forma: "influence", funcion: "Base inglesa; pierde la e final" }, { forma: "-er", funcion: "Nombre de agente" }] },
  adultus: { piezas: [{ forma: "adult-", funcion: "Base" }, { forma: "-us", funcion: "Nominativo singular masculino" }], ramas: [{ titulo: "Según el género, en latín", formas: ["adultus", "adulta", "adultum"] }] },
  puer: { ramas: [{ titulo: "Formas de caso, en latín", formas: ["puer", "pueri", "puerum"] }] },
  infans: { piezas: [{ forma: "in-", funcion: "Negación" }, { forma: "fans", funcion: "Participio de fari: hablar" }], ramas: [{ titulo: "Formas de caso, en latín", formas: ["infans", "infantis", "infantem"] }, { titulo: "Una forma de plural", formas: ["infantes"] }] },
};

// Short labels taken from the existing, source-linked linguistic descriptions.
// Missing/uncertain ancestry is left in the detailed text, not drawn as a fact.
const origins: Record<string, [string, string]> = {
  devocion: ["Latín", "devotio"], molde: ["Catalán antiguo", "motle"],
  ambicion: ["Latín", "ambitio"], ausencia: ["Latín", "absentia"],
  control: ["Francés", "contrôle"], correcto: ["Latín", "correctus"],
  deber: ["Latín", "debēre"], deseo: ["Latín vulgar", "desidium"],
  educar: ["Latín", "educāre"], ego: ["Latín", "ego"],
  exito: ["Latín", "exĭtus"], fama: ["Latín", "fama"],
  juego: ["Latín", "iocus"], merito: ["Latín", "merĭtum"],
  miedo: ["Latín", "metus"], normal: ["Latín", "normālis"],
  obediencia: ["Latín", "oboedientia"], orgullo: ["Catalán", "orgull"],
  patrana: ["Forma anterior", "pastraña"], perder: ["Latín", "perdĕre"],
  persona: ["Latín", "persōna"], presente: ["Latín", "praesens"],
  right: ["Inglés antiguo", "riht"], rutina: ["Francés", "routine"],
  sacrificio: ["Latín", "sacrificium"], sumision: ["Latín", "submissio"],
  tiempo: ["Latín", "tempus"], transmutacion: ["Latín", "transmutatio"],
  virtud: ["Latín", "virtus"], volver: ["Latín", "volvĕre"],
  work: ["Inglés antiguo · sustantivo", "weorc"],
};

export function getWordMap(word: string): WordMap | undefined {
  const key = normalize(word);
  const map = maps[key];
  if (!map) return undefined;
  const origin = origins[key];
  return structuredClone({ ...map, ...(origin ? { origen: { lengua: origin[0], forma: origin[1] } } : {}) });
}
