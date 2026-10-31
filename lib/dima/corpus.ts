import { DIMA_STEPS, normalize, readResult, type DimaResult, type Section } from "./schema.ts";
import { EDITORIAL_ENTRIES } from "./editorial.ts";
import { DEVOCION } from "./devocion.ts";
import { makeInside } from "./inside.ts";

// Source-checked public catalogue. Interpretations remain separate from dictionary evidence.
// New entries need editorial review; importing a legacy row does not grant verified status.
const interpretation = (texto: string): Section => ({ texto, estado: "interpretacion", fuentes: [] });
const checked = "2026-10-31";

const entries: DimaResult[] = [
  DEVOCION,
  {
    version: 2, palabra: "Patraña", origen: "archivo", estado: "completo", archivo: [],
    fuentes: [{ id: "dle-patrana", titulo: "RAE-ASALE · DLE: patraña", url: "https://dle.rae.es/patraña", consulta: checked }],
    analisis: {
      morfologia: { texto: "El DLE remite patraña a pastraña. Registra tanto la invención orientada al engaño como un relato breve de carácter novelesco. Esta referencia no documenta una división en patra- y -ña; no se propone esa segmentación como morfología histórica.", estado: "documentado", fuentes: ["dle-patrana"] },
      pulsus: interpretation("En el sentido de engaño, el movimiento propuesto es conducir a alguien desde un relato hacia una creencia. Es una lectura funcional DIMA, no una propiedad física de la palabra."),
      configuracion: interpretation("Un emisor presenta una invención, un destinatario la recibe y un contexto hace posible tomarla como un hecho. La operación depende de esa presentación y recepción; el sentido literario no exige el mismo propósito de engaño."),
      distinciones: interpretation("Invención no equivale siempre a engaño. Distinguimos el relato de su presentación como hecho, la falsedad del error y la intención atribuida de la intención comprobada."),
      nodus: interpretation("El vínculo está entre quien cuenta, quien recibe y aquello que se presenta como cierto. La agencia del receptor puede ejercerse pidiendo evidencia o suspendiendo el juicio; la del emisor, aclarando qué está inventando."),
      transmutacion: interpretation("Pasar de aceptar o rechazar de inmediato a preguntar qué sostiene el relato. Una reconfiguración posible es: recibo esta versión, distingo sus pruebas y decido qué puedo afirmar."),
      definicion: interpretation("En su acepción de engaño, DIMA propone leer patraña como una invención que busca adquirir autoridad de hecho en una relación. La definición no agota su uso literario."),
      sintesis: interpretation("Un relato puede orientar mi mirada; sus pruebas orientan lo que afirmo."),
    },
  },
  {
    version: 2, palabra: "Embole", origen: "archivo", estado: "completo", archivo: [],
    fuentes: [{ id: "dle-embole", titulo: "RAE-ASALE · DLE: embole", url: "https://dle.rae.es/embole", consulta: checked }],
    analisis: {
      morfologia: { texto: "El DLE deriva embole de embolar y -e. En el uso rioplatense registra hastío, molestia o aburrimiento, y también una situación que produce incomodidad o enojo. La división EM + BOLE no queda documentada por esta fuente.", estado: "documentado", fuentes: ["dle-embole"] },
      pulsus: interpretation("En esta lectura, el movimiento es una pérdida de disposición para continuar una actividad. Describe una relación vivida en contexto, no una energía física ni un rasgo permanente de la persona."),
      configuracion: interpretation("Alguien participa de una situación y la vive como molesta o poco convocante. La operación observada es una reducción de su disponibilidad para seguir; la palabra por sí sola no explica la causa."),
      distinciones: interpretation("Aburrimiento, cansancio, dificultad y rechazo pueden coincidir, pero no son equivalentes. Sentir embole tampoco demuestra incapacidad ni define una identidad."),
      nodus: interpretation("El vínculo une a una persona, una actividad y unas condiciones. Su margen de acción puede estar en cambiar una condición, pedir una pausa o decidir cómo continuar; no siempre puede cambiar toda la situación."),
      transmutacion: interpretation("Pasar de una etiqueta global a una observación concreta: qué parte me resulta pesada y qué cambio pequeño está a mi alcance. La alternativa no exige negar el malestar."),
      definicion: interpretation("DIMA propone leer embole como una relación de malestar o desconexión con una situación, cuyas condiciones conviene distinguir antes de convertirla en una definición personal."),
      sintesis: interpretation("Distingo qué me pesa para elegir qué puedo mover."),
    },
  },
];

for (const entry of EDITORIAL_ENTRIES) {
  const id = `lexico-${normalize(entry.palabra).replace(/\s+/g, "-")}`;
  entries.push(readResult({
    version: 2, palabra: entry.palabra, origen: "archivo", archivo: [],
    fuentes: [{ id, titulo: `${entry.diccionario || "RAE-ASALE · DLE"}: ${entry.palabra.toLowerCase()}`, url: entry.url, consulta: checked }],
    analisis: Object.fromEntries(DIMA_STEPS.map((step, index) => [step.id, {
      texto: entry.pasos[index], estado: index === 0 ? "documentado" : "interpretacion", fuentes: index === 0 ? [id] : [],
    }])),
  }));
}

// A word is advertised only if it has a complete reading; a legacy row is not a published entry.
export const REVIEWED_WORDS = entries.filter((entry) => entry.estado === "completo").map((entry) => entry.palabra).sort((a, b) => a.localeCompare(b, "es"));
export function getReviewedAnalysis(palabra: string): DimaResult | undefined {
  const entry = entries.find((candidate) => normalize(candidate.palabra) === normalize(palabra));
  if (!entry) return undefined;
  const result = structuredClone(entry);
  return readResult({ ...result, inside: result.inside || makeInside(result) });
}
