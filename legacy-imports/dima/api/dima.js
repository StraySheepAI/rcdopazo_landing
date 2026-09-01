export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { palabra, nivel } = body || {};
    if (!palabra) return res.status(400).json({ error: 'Falta la palabra' });

    const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
    const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
    const BASE_ID = 'app8LodC87ProKbQp';
    const TABLE_ID = 'tblg4NxTxNfoZGTxS';
    const norm = s => (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();

    const PALABRAS_LIBRO = ['bola','embole','patranas','disolucion','vibracion','resonancia','potencia','nigredo','forma','estructura','transmutacion','conciencia','percepcion','patrana','umbral','quiebre','grieta','reconfiguracion','separacion','sombra','espejo','retorno','punctum non reditus','no poder desver','la incomodidad que despierta'];

    const formula = encodeURIComponent(`LOWER(SUBSTITUTE({Forma}," ",""))="${norm(palabra).replace(/ /g,'')}"`)
    const searchRes = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}?filterByFormula=${formula}&maxRecords=1`, {
      headers: { 'Authorization': `Bearer ${AIRTABLE_TOKEN}` }
    });
    const searchData = await searchRes.json();

    if (searchData.records && searchData.records.length > 0) {
      const rec = searchData.records[0];
      const f = rec.fields;

      if (nivel === 'libro' && !PALABRAS_LIBRO.includes(norm(f.Forma||''))) {
        return res.status(404).json({ error: 'Esta palabra no está en el repositorio del libro. Probá con otra del universo Qué Embole.' });
      }

      fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}/${rec.id}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${AIRTABLE_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: { Pulsus: (parseInt(f.Pulsus)||0) + 1 } })
      });

      return res.status(200).json({
        fuente: 'base',
        bloque1: { titulo: '🔐 Sigillum Verbi', forma: f.Forma||palabra, indicia: f.Indicia_Obscura||'—', ludum_mpae: f.Ludum_MPAe||'—', causa_mpae: f.Causa_MPAe||'—', ordo: f.Ordo_MPAe||'—' },
        bloque2: { titulo: '▽ Decodificatio Vibratoria', initium: f.Initium_DIMA||'—', lectio: f.Lectio_Vibrationis||'—', gradus: f.Gradus_Vibrationi||'—', natura: f.Natura_Vibrationis||'—' },
        bloque3: { titulo: '✨ Resonantia Ultima', viae: f.ViaeVersus||'—', dictum: f.Dictum_Mutare||'—', provocatio: f.Provocatio_MPAe||'—', sussurro: f.Sussurro_MPAe||'—', activatio: f.Activatio_Verbi||'—', cierre: f.Cierre||'—' }
      });
    }

    if (nivel === 'libro' && !PALABRAS_LIBRO.includes(norm(palabra))) {
      return res.status(404).json({ error: 'Esta palabra no está en el repositorio del libro. Probá con otra del universo Qué Embole.' });
    }

    const prompt = `Eres DIMA — Diccionario Inteligente de Magia Alquímica, parte del universo Magia para Atrevidos (MPA).
SISTEMA DIMA: Conjuratio (palabra como entidad activa), Verbus (estructura etimológica), Sermo (frase con intención).
ORDO MPAE: Evigela (palabras llave), Lude (alta vibración), Translude (media, depende del contexto), Transmuta (densa, conviene alternar).
Analizá: "${palabra}"
Respondé SOLO JSON sin texto extra:
{"bloque1":{"titulo":"🔐 Sigillum Verbi","forma":"${palabra}","indicia":"sospecha de MPA","ludum_mpae":"apuesta de MPA","causa_mpae":"justificación","ordo":"Evigela/Lude/Translude/Transmuta"},"bloque2":{"titulo":"▽ Decodificatio Vibratoria","initium":"frase ritual","lectio":"lectura vibracional","gradus":"Alta/Moderata/Gravis con explicación","natura":"naturaleza funcional"},"bloque3":{"titulo":"✨ Resonantia Ultima","viae":"alternativas alta vibración","dictum":"frase poética que rime","provocatio":"golpecito MPA directo","sussurro":"murmullo — pregunta suave final","activatio":"cómo activar con conciencia","cierre":"cierre ritual"}}`;

    const aiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 1200, messages: [{ role: 'user', content: prompt }] })
    });

    const aiData = await aiRes.json();
    const text = aiData.content?.[0]?.text || '';
    const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());

    fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${AIRTABLE_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: {
        Forma: palabra, Tipo: 'CD', Ordo_MPAe: parsed.bloque1.ordo, Pulsus: 1,
        Indicia_Obscura: parsed.bloque1.indicia, Ludum_MPAe: parsed.bloque1.ludum_mpae,
        Causa_MPAe: parsed.bloque1.causa_mpae, Initium_DIMA: parsed.bloque2.initium,
        Lectio_Vibrationis: parsed.bloque2.lectio, Gradus_Vibrationi: parsed.bloque2.gradus,
        Natura_Vibrationis: parsed.bloque2.natura, ViaeVersus: parsed.bloque3.viae,
        Dictum_Mutare: parsed.bloque3.dictum, Provocatio_MPAe: parsed.bloque3.provocatio,
        Sussurro_MPAe: parsed.bloque3.sussurro, Activatio_Verbi: parsed.bloque3.activatio,
        Cierre: parsed.bloque3.cierre, Generado_IA: 'Si', Nivel: ''
      }})
    });

    return res.status(200).json({ fuente: 'ia', ...parsed });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
