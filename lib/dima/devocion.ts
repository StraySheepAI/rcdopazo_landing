import { type DimaResult } from "./schema.ts";
import { DIMA_SIGNATURE } from "./inside-schema.ts";

// Editorial reference supplied by the author. Preserve its voice and sequence.
export const DEVOCION: DimaResult = {
  version: 2, palabra: "Devoción", origen: "archivo", estado: "completo", archivo: [],
  fuentes: [{ id: "dle-devocion", titulo: "RAE-ASALE · DLE: devoción", url: "https://dle.rae.es/devoción", consulta: "2026-10-31" }],
  analisis: {
    morfologia: { texto: "Devoción procede del latín devotio, -ōnis. Comprende el fervor religioso y también la afición especial hacia alguien o algo. No corresponde dividir la forma española en de y voción con significados independientes.", estado: "documentado", fuentes: ["dle-devocion"] },
    pulsus: { texto: "Orientación de una entrega hacia alguien o algo que se valora.", estado: "interpretacion", fuentes: [] },
    configuracion: { texto: "La dedicación se expresa en tiempo, atención y acciones sostenidas, incluso cuando pasa el entusiasmo inicial.", estado: "interpretacion", fuentes: [] },
    distinciones: { texto: "Entrega elegida y entrega incuestionable no son equivalentes. Amar una actividad o un vínculo no exige silenciar las propias necesidades.", estado: "interpretacion", fuentes: [] },
    nodus: { texto: "Quien se entrega conserva agencia al revisar su participación, poner límites y reconocer cuándo una forma de entrega dejó de corresponderle.", estado: "interpretacion", fuentes: [] },
    transmutacion: { texto: "Elegí algo que merezca tu dedicación hoy. Nombrá un acto concreto para cuidarlo y un límite que te permita participar sin abandonarte.", estado: "interpretacion", fuentes: [] },
    definicion: { texto: "La devoción conserva su potencia cuando podés entregarte y seguir ejerciendo tu agencia.", estado: "interpretacion", fuentes: [] },
    sintesis: { texto: "Me entrego a lo que amo con presencia, discernimiento y capacidad de elección.", estado: "interpretacion", fuentes: [] },
  },
  inside: {
    variantes: "Devoto · Devota",
    apertura: "¿A qué te entregás con tanta dedicación… y qué lugar ocupás vos en esa entrega?",
    raiz: "Devoción procede del latín devotio, -ōnis. Su significado comprende el fervor religioso, la disposición al culto y también la afición especial hacia alguien o algo. Por eso podemos hablar de devoción por una divinidad, una persona o una actividad.",
    morfologia: {
      nota: "La palabra llega al español desde un sustantivo latino: no corresponde dividirla en «de» + «voción» y atribuirles significados independientes. Como lectura simbólica DIMA, podemos explorar tres movimientos:",
      movimientos: [
        { nombre: "Orientación", pregunta: "¿Hacia quién o hacia qué dirijo mi entrega?" },
        { nombre: "Dedicación", pregunta: "¿Cómo se expresa en mi tiempo, atención y acciones?" },
        { nombre: "Discernimiento", pregunta: "¿Sigo eligiendo esta entrega o ya no me permito cuestionarla?" },
      ],
    },
    lectura: [
      "La devoción puede convertir lo que valorás en una práctica sostenida. Aquello que amás recibe presencia, cuidado y continuidad, incluso cuando pasa el entusiasmo inicial.",
      "Su peligro aparece cuando la entrega se vuelve incuestionable: cuando para sostener un vínculo, una creencia o una obra necesitás silenciar tus necesidades.",
      "En esta lectura MPA, la devoción conserva su potencia cuando podés entregarte y seguir ejerciendo tu agencia. Podés revisar cómo participás, poner límites y reconocer cuándo una forma de entrega dejó de corresponderte.",
    ],
    fraseTransmutada: "Me entrego a lo que amo con presencia, discernimiento y capacidad de elección.",
    dictum: ["Que mi entrega tenga dirección,", "que mi presencia sostenga mi elección."],
    insight: "¿Qué estás sosteniendo por devoción y qué sostenés por miedo a dejar de ser quien prometiste ser?",
    activacion: "Elegí algo que merezca tu dedicación hoy. Nombrá un acto concreto para cuidarlo y un límite que te permita participar sin abandonarte.",
    cierre: DIMA_SIGNATURE,
  },
};
