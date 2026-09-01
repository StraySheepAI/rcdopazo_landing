import { NextRequest, NextResponse } from "next/server";

const BASE_ID = "app8LodC87ProKbQp";
const TABLE_ID = "tblg4NxTxNfoZGTxS";
const BOOK_WORDS = [
  "bola", "embole", "patranas", "disolucion", "vibracion", "resonancia", "potencia",
  "nigredo", "forma", "estructura", "transmutacion", "conciencia", "percepcion", "patrana",
  "umbral", "quiebre", "grieta", "reconfiguracion", "separacion", "sombra", "espejo",
  "retorno", "punctum non reditus", "no poder desver", "la incomodidad que despierta",
];

const normalize = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

export async function POST(request: NextRequest) {
  try {
    const { palabra, nivel } = await request.json();
    if (!palabra) return NextResponse.json({ error: "Falta la palabra" }, { status: 400 });

    const airtableToken = process.env.AIRTABLE_TOKEN;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (!airtableToken || !anthropicKey) {
      return NextResponse.json({ error: "DIMA está actualizando su conexión. Intentá nuevamente en unos minutos." }, { status: 503 });
    }

    const normalizedWord = normalize(String(palabra));
    const formula = encodeURIComponent(`LOWER(SUBSTITUTE({Forma}," ",""))="${normalizedWord.replace(/ /g, "")}"`);
    const searchRes = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}?filterByFormula=${formula}&maxRecords=1`, {
      headers: { Authorization: `Bearer ${airtableToken}` },
      cache: "no-store",
    });
    const searchData = await searchRes.json();

    if (searchData.records?.length) {
      const record = searchData.records[0];
      const fields = record.fields;
      if (nivel === "libro" && !BOOK_WORDS.includes(normalize(fields.Forma || ""))) {
        return NextResponse.json({ error: "Esta palabra no está en el repositorio del libro. Probá con otra del universo Qué Embole." }, { status: 404 });
      }

      await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}/${record.id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${airtableToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ fields: { Pulsus: (parseInt(fields.Pulsus) || 0) + 1 } }),
      });

      return NextResponse.json({
        fuente: "base",
        bloque1: { titulo: "🔐 Sigillum Verbi", forma: fields.Forma || palabra, indicia: fields.Indicia_Obscura || "—", ludum_mpae: fields.Ludum_MPAe || "—", causa_mpae: fields.Causa_MPAe || "—", ordo: fields.Ordo_MPAe || "—" },
        bloque2: { titulo: "▽ Decodificatio Vibratoria", initium: fields.Initium_DIMA || "—", lectio: fields.Lectio_Vibrationis || "—", gradus: fields.Gradus_Vibrationi || "—", natura: fields.Natura_Vibrationis || "—" },
        bloque3: { titulo: "✨ Resonantia Ultima", viae: fields.ViaeVersus || "—", dictum: fields.Dictum_Mutare || "—", provocatio: fields.Provocatio_MPAe || "—", sussurro: fields.Sussurro_MPAe || "—", activatio: fields.Activatio_Verbi || "—", cierre: fields.Cierre || "—" },
      });
    }

    if (nivel === "libro" && !BOOK_WORDS.includes(normalizedWord)) {
      return NextResponse.json({ error: "Esta palabra no está en el repositorio del libro. Probá con otra del universo Qué Embole." }, { status: 404 });
    }

    const prompt = `Eres DIMA — Diccionario Inteligente de Magia Alquímica, parte del universo Magia para Atrevidos (MPA). Analizá: "${palabra}". Respondé SOLO JSON sin texto extra: {"bloque1":{"titulo":"🔐 Sigillum Verbi","forma":"${palabra}","indicia":"sospecha de MPA","ludum_mpae":"apuesta de MPA","causa_mpae":"justificación","ordo":"Evigela/Lude/Translude/Transmuta"},"bloque2":{"titulo":"▽ Decodificatio Vibratoria","initium":"frase ritual","lectio":"lectura vibracional","gradus":"Alta/Moderata/Gravis con explicación","natura":"naturaleza funcional"},"bloque3":{"titulo":"✨ Resonantia Ultima","viae":"alternativas alta vibración","dictum":"frase poética que rime","provocatio":"golpecito MPA directo","sussurro":"murmullo — pregunta suave final","activatio":"cómo activar con conciencia","cierre":"cierre ritual"}}`;
    const aiRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": anthropicKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: "claude-haiku-4-5-20251001", max_tokens: 1200, messages: [{ role: "user", content: prompt }] }),
    });
    const aiData = await aiRes.json();
    const text = aiData.content?.[0]?.text || "";
    const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());

    await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${airtableToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ fields: {
        Forma: palabra, Tipo: "CD", Ordo_MPAe: parsed.bloque1.ordo, Pulsus: 1,
        Indicia_Obscura: parsed.bloque1.indicia, Ludum_MPAe: parsed.bloque1.ludum_mpae,
        Causa_MPAe: parsed.bloque1.causa_mpae, Initium_DIMA: parsed.bloque2.initium,
        Lectio_Vibrationis: parsed.bloque2.lectio, Gradus_Vibrationi: parsed.bloque2.gradus,
        Natura_Vibrationis: parsed.bloque2.natura, ViaeVersus: parsed.bloque3.viae,
        Dictum_Mutare: parsed.bloque3.dictum, Provocatio_MPAe: parsed.bloque3.provocatio,
        Sussurro_MPAe: parsed.bloque3.sussurro, Activatio_Verbi: parsed.bloque3.activatio,
        Cierre: parsed.bloque3.cierre, Generado_IA: "Si", Nivel: "",
      } }),
    });

    return NextResponse.json({ fuente: "ia", ...parsed });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error inesperado";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
