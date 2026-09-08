import { NextResponse } from "next/server";

const BASE_ID = "app8LodC87ProKbQp";
const TABLE_ID = "tblg4NxTxNfoZGTxS";
const PUBLIC_DIMA_SHEET = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT3ENMxScg8YKXXTyIIYwkxF7Hh2VHP8f3Rlo8VSsigr420Q_alu8cU2Ft5j3vyyqEib3mlb9tvZ4Lt/pub?gid=1680193813&single=true&output=csv";
const BOOK_WORDS = ["bola", "embole", "patranas", "disolucion", "vibracion", "resonancia", "potencia", "nigredo", "forma", "estructura", "transmutacion", "conciencia", "percepcion", "patrana", "umbral", "quiebre", "grieta", "reconfiguracion", "separacion", "sombra", "espejo", "retorno", "punctum non reditus", "no poder desver", "la incomodidad que despierta"];
const normalize = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

function parseCsv(csv: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < csv.length; index += 1) {
    const char = csv[index];
    if (char === '"') {
      if (quoted && csv[index + 1] === '"') { field += '"'; index += 1; }
      else quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(field); field = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && csv[index + 1] === "\n") index += 1;
      row.push(field); field = "";
      if (row.some(Boolean)) rows.push(row);
      row = [];
    } else field += char;
  }
  if (field || row.length) { row.push(field); rows.push(row); }

  const headers = rows.shift()?.map((header) => header.trim()) || [];
  return rows.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index]?.trim() || ""])));
}

async function getPublicDimaRows() {
  const response = await fetch(PUBLIC_DIMA_SHEET, { cache: "no-store" });
  if (!response.ok) throw new Error("No se pudo abrir la planilla primaria de DIMA.");
  return parseCsv(await response.text());
}

const field = (row: Record<string, string>, ...names: string[]) => names.map((name) => row[name]).find(Boolean) || "—";

function sheetRowToResult(row: Record<string, string>) {
  return {
    fuente: "planilla",
    bloque1: {
      forma: field(row, "Forma"),
      indicia: field(row, "Indicia Obscura"),
      ludum_mpae: field(row, "Ludum MPAe"),
      causa_mpae: field(row, "Causa MPAe"),
      ordo: field(row, "Ordo MPAe"),
    },
    bloque2: {
      initium: field(row, "Initium DIMA"),
      lectio: field(row, "Lectio Vibrationis", "Structura Verbi"),
      gradus: field(row, "Gradus Vibrationi", "Conjuratio Prima"),
      natura: field(row, "Natura Vibrationis", "Descriptio Estructuralis"),
    },
    bloque3: {
      viae: field(row, "ViaeVersus", "ViaeVersus        "),
      dictum: field(row, "Dictum Mutare"),
      provocatio: field(row, "Provocatio MPAe"),
      sussurro: field(row, "Fractale Resonans"),
      activatio: field(row, "Activatio Verbi"),
      cierre: field(row, "Frase transmutada (usando alguna alternativa)"),
    },
  };
}

export async function GET() {
  try {
    const rows = await getPublicDimaRows();
    return NextResponse.json({ palabras: rows.map((row) => row.Forma).filter(Boolean) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo abrir el archivo DIMA." }, { status: 502 });
  }
}

async function consultLegacyDima(palabra: string, nivel: string) {
  let lastError = "DIMA no pudo completar la lectura.";

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch("https://dima.magiaparaatrevidos.com/api/dima", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ palabra, nivel }),
        cache: "no-store",
      });
      const data = await response.json();

      if (response.ok && !data.error) return data;
      lastError = data.error || lastError;
    } catch (error) {
      lastError = error instanceof Error ? error.message : lastError;
    }
  }

  throw new Error(lastError);
}

export async function POST(request: Request) {
  try {
    const { palabra, nivel } = await request.json();
    if (!palabra || typeof palabra !== "string") return NextResponse.json({ error: "Falta la palabra." }, { status: 400 });
    if (nivel === "libro" && !BOOK_WORDS.includes(normalize(palabra))) return NextResponse.json({ error: "Esta forma pertenece a otra colección de DIMA." }, { status: 404 });

    const publicRows = await getPublicDimaRows();
    const publicMatch = publicRows.find((row) => normalize(row.Forma || "") === normalize(palabra));
    if (nivel === "free") {
      if (publicMatch) return NextResponse.json(sheetRowToResult(publicMatch));
      return NextResponse.json({ error: "Esta palabra todavía no forma parte del archivo abierto de DIMA." }, { status: 404 });
    }

    const airtableToken = process.env.AIRTABLE_TOKEN;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (airtableToken) {
      const compact = normalize(palabra).replace(/ /g, "");
      const formula = encodeURIComponent(`LOWER(SUBSTITUTE({Forma}," ",""))="${compact}"`);
      const search = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}?filterByFormula=${formula}&maxRecords=1`, { headers: { Authorization: `Bearer ${airtableToken}` }, cache: "no-store" });
      const data = await search.json();
      const fields = data.records?.[0]?.fields;
      if (fields) return NextResponse.json({ fuente: "base", bloque1: { forma: fields.Forma || palabra, indicia: fields.Indicia_Obscura || "—", ludum_mpae: fields.Ludum_MPAe || "—", causa_mpae: fields.Causa_MPAe || "—", ordo: fields.Ordo_MPAe || "—" }, bloque2: { initium: fields.Initium_DIMA || "—", lectio: fields.Lectio_Vibrationis || "—", gradus: fields.Gradus_Vibrationi || "Por determinar", natura: fields.Natura_Vibrationis || "—" }, bloque3: { viae: fields.ViaeVersus || "—", dictum: fields.Dictum_Mutare || "—", provocatio: fields.Provocatio_MPAe || "—", sussurro: fields.Sussurro_MPAe || "—", activatio: fields.Activatio_Verbi || "—", cierre: fields.Cierre || "—" } });
    }

    if (!anthropicKey) {
      return NextResponse.json(await consultLegacyDima(palabra, nivel));
    }
    const prompt = `Sos DIMA, Dispositivo Inteligente Metalquímico Activo. Analizá la forma "${palabra}" con lenguaje claro, sin presentar inferencias como verdades etimológicas. La entrega debe diferenciar lo que suele creerse que se dice de la configuración que la palabra contiene. Incluí morfología propuesta, cantidad y nombres de Verbus Prime, configuración mínima, ATS (descomposición) y ARS M (reconfiguración). Respondé solamente JSON con esta forma exacta: {"bloque1":{"forma":"","indicia":"","ludum_mpae":"","causa_mpae":"","ordo":""},"bloque2":{"initium":"","lectio":"","gradus":"N Verbus Prime · nombres","natura":""},"bloque3":{"viae":"","dictum":"","provocatio":"","sussurro":"","activatio":"","cierre":""}}`;
    const ai = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json", "x-api-key": anthropicKey, "anthropic-version": "2023-06-01" }, body: JSON.stringify({ model: "claude-haiku-4-5-20251001", max_tokens: 1400, messages: [{ role: "user", content: prompt }] }) });
    const aiData = await ai.json();
    if (!ai.ok) throw new Error(aiData.error?.message || "DIMA no pudo completar la lectura.");
    const text = aiData.content?.[0]?.text || "";
    return NextResponse.json({ fuente: "ia", ...JSON.parse(text.replace(/```json|```/g, "").trim()) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "DIMA no pudo completar la lectura." }, { status: 500 });
  }
}
