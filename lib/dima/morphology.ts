import { normalize } from "./text.ts";

export type LinguisticMorphology = { categoria: string; formacion: string; flexion: string };
const noun = (gender: string, word: string, plural: string, formacion: string): LinguisticMorphology => ({
  categoria: `Sustantivo ${gender}.`, formacion, flexion: `Singular: ${word}. Plural: ${plural}.`,
});
const simple = (word: string) => `En el español actual, «${word}» se toma como base léxica. Su terminación no basta para atribuirle un sufijo derivativo. Su procedencia histórica se explica en «Palabra raíz».`;
const verb = (word: string, base: string, theme: string, examples: string): LinguisticMorphology => ({
  categoria: "Verbo en infinitivo.", formacion: `${base}- + -${theme}- + -r: base verbal, vocal de la conjugación y marca de infinitivo.`,
  flexion: `${word} no marca persona ni tiempo en el infinitivo. Al conjugarlo aparecen esas diferencias: ${examples}.`,
});

// Present grammatical structure; historical ancestry and symbolic movements
// are described separately. Each entry retains its dictionary reference.
const MORPHOLOGY: Record<string, LinguisticMorphology> = {
  molde: noun("masculino", "molde", "moldes", "Base léxica: molde. En moldes se reconoce molde + -s, marca de plural. Molde no presenta un prefijo ni un sufijo derivativo español identificable: mol- y -de no son piezas con significado propio."),
  devocion: noun("femenino", "devoción", "devociones", "Es un sustantivo heredado del latín, no una creación española de de + voción. La terminación -ción coincide con la de muchos nombres de acción, pero no demuestra por sí sola su formación histórica. Devoto y devota pertenecen a su familia léxica."),
  ambicion: noun("femenino", "ambición", "ambiciones", "Es un sustantivo heredado del latín. Se relaciona con ambicioso y ambicionar; esa relación no demuestra que se haya creado a partir del verbo español. No contiene un componente español bición."),
  ausencia: noun("femenino", "ausencia", "ausencias", "Es un sustantivo heredado, relacionado con ausente. La terminación -encia aparece en nombres de estado o cualidad; eso no convierte aus- en una palabra española independiente."),
  control: noun("masculino", "control", "controles", simple("control") + " Se relaciona con controlar y controlador. Con- no se interpreta aquí como un prefijo español dentro del préstamo."),
  deber: verb("deber", "deb", "e", "debo, debés, debía. También se usa como sustantivo masculino: el deber, los deberes"),
  deseo: noun("masculino", "deseo", "deseos", "Base de la forma actual: deseo. Comparte familia con desear y deseoso. Su comienzo des- no funciona como el prefijo de negación de deshacer."),
  educar: verb("educar", "educ", "a", "educo, educás, educaba"),
  ego: noun("masculino", "ego", "egos", "Préstamo latino que funciona en español como sustantivo. Es una base simple: no se analiza e- como prefijo ni -go como sufijo."),
  embole: noun("masculino", "embole", "emboles", "El DLE lo relaciona con embolar. Es un nombre vinculado al verbo, con base embol- y terminación nominal -e. Esa relación no equivale a dividirlo en dos palabras em + bole."),
  empezar: verb("empezar", "empez", "a", "empiezo, empezás, empezaba; la base alterna empez- y empiez-"),
  esfuerzo: noun("masculino", "esfuerzo", "esfuerzos", "Nombre relacionado con esforzar. La base esfuerz- alterna con esforz- en esforzar. No se obtiene su origen separando es + fuerzo."),
  exito: noun("masculino", "éxito", "éxitos", simple("éxito") + " Su terminación -o no lo convierte en una forma verbal española."),
  fama: noun("femenino", "fama", "famas", simple("fama")),
  fracaso: noun("masculino", "fracaso", "fracasos", "Nombre relacionado con fracasar. La familia comparte la base fracas-: fracaso, fracasar, fracasado. No se identifica un prefijo español fra-."),
  ganar: verb("ganar", "gan", "a", "gano, ganás, ganaba"),
  juego: noun("masculino", "juego", "juegos", "La familia presenta la alternancia jueg- / jug-: juego, jugar, jugador. Juego también coincide con una forma verbal —yo juego—; la función se distingue por la oración."),
  merito: noun("masculino", "mérito", "méritos", simple("mérito") + " La terminación no funciona como un diminutivo -ito."),
  miedo: noun("masculino", "miedo", "miedos", simple("miedo") + " Miedoso es una palabra derivada de esta familia, no una pieza dentro de miedo."),
  obediencia: noun("femenino", "obediencia", "obediencias", "Pertenece a la familia de obedecer y obediente. Se reconoce la relación obediente / obediencia, con terminaciones -nte / -ncia. Esa relación actual no sustituye su procedencia latina."),
  orgullo: noun("masculino", "orgullo", "orgullos", simple("orgullo") + " Orgulloso se relaciona con esta base."),
  patrana: noun("femenino", "patraña", "patrañas", simple("patraña") + " La ñ forma parte de la base."),
  perder: verb("perder", "perd", "e", "pierdo, perdés, perdía; aparecen las bases perd- y pierd-"),
  persona: noun("femenino", "persona", "personas", "Es un sustantivo femenino incluso al referirse a un varón: una persona. No se forma en español dividiendo per + sona. Personaje, personal y personificar pertenecen a su familia."),
  productividad: noun("femenino", "productividad", "productividades", "productiv- + -idad: se forma sobre productivo, cuya vocal final se sustituye al añadir el sufijo. -idad forma aquí un nombre de cualidad."),
  realidad: noun("femenino", "realidad", "realidades", "real + -idad: adjetivo y sufijo que forma un nombre de cualidad o condición. Aquí real significa existente, no relativo a la realeza."),
  rutina: noun("femenino", "rutina", "rutinas", "Préstamo del francés. No se presenta rut + ina como una derivación creada en español. Rutinario se relaciona con esta base."),
  sacrificio: noun("masculino", "sacrificio", "sacrificios", "Sustantivo heredado del latín. Sacrificar y sacrificial pertenecen a su familia; no se lo descompone en palabras españolas como sacri + ficio."),
  sumision: noun("femenino", "sumisión", "sumisiones", "Nombre emparentado con sumiso y someter. La relación presenta cambios en la base; no es una suma de su + misión."),
  tiempo: noun("masculino", "tiempo", "tiempos", simple("tiempo") + " Temporal pertenece a la familia histórica, con una base distinta de la forma visible tiempo."),
  trabajo: noun("masculino", "trabajo", "trabajos", "Nombre relacionado con trabajar: base trabaj- y terminación nominal -o. También puede ser una forma verbal —yo trabajo—. No se divide tra + bajo."),
  transmutacion: noun("femenino", "transmutación", "transmutaciones", "transmuta- + -ción: nombre de acción o resultado relacionado con transmutar. En el verbo se reconoce trans- y mutar. Esta formación describe una relación lingüística; no demuestra efectos personales."),
  virtud: noun("femenino", "virtud", "virtudes", simple("virtud") + " Virtuoso es una palabra relacionada; no se interpreta tud como una palabra española independiente."),
  volver: verb("volver", "volv", "e", "vuelvo, volvés, volvía; aparecen las bases volv- y vuelv-"),
  correcto: { categoria: "Adjetivo.", formacion: "Base correct-, con formas correcto y correcta. Se relaciona con corregir y corrección, que muestran variación en la base. Su formación histórica no se deduce de separar co + recto en español.", flexion: "Correcto, correcta, correctos, correctas: cambian género y número para concordar con el sustantivo." },
  normal: { categoria: "Adjetivo; también puede sustantivarse: lo normal.", formacion: "Adjetivo heredado del latín, relacionado con norma. Se reconoce la relación norma / normal y la terminación adjetiva -al; eso no implica que la voz se haya creado por primera vez en español.", flexion: "La forma no cambia por género: un ritmo normal, una respuesta normal. Plural: normales, con -es." },
  presente: { categoria: "Adjetivo; también sustantivo masculino al nombrar el tiempo actual.", formacion: "Pertenece a la familia de presencia y presentar. Es una forma heredada del latín; no se explica históricamente cortándola en pre + sente dentro del español.", flexion: "El adjetivo no cambia por género: él está presente, ella está presente. Plural: presentes. Como sustantivo: el presente, los presentes." },
  common: { categoria: "Adjetivo inglés; puede significar compartido, frecuente u ordinario, según la frase.", formacion: "Common funciona como una base simple en el inglés actual. Llegó a través del francés antiguo comun, procedente del latín communis. Ese recorrido histórico no equivale a dividir la palabra inglesa en com + mon. En commoner y commonest sí se añaden a common las terminaciones de comparación -er y -est. También se usan more common y most common; estas construcciones de varias palabras no son sufijos dentro de common.", flexion: "No cambia por género ni número: a common interest / common interests. Comparación: more common / commoner; most common / commonest. Las formas con more y most son más frecuentes." },
  right: { categoria: "Voz inglesa con usos de adjetivo, sustantivo, adverbio y verbo; aquí se exploran correcto y derecho según el contexto.", formacion: "Base simple right. Rightness añade el sufijo nominal -ness; rights puede ser el plural del sustantivo. No se divide ri + ght.", flexion: "El adjetivo no cambia por género ni número. El sustantivo distingue right / rights. El contexto decide la función." },
  work: { categoria: "Sustantivo y verbo ingleses.", formacion: "Base simple work. Working se forma con work + -ing; worker, con work + -er. Esos sufijos pertenecen a las nuevas formas, no a una división interna de work.", flexion: "Como actividad, work suele ser incontable. Works puede nombrar obras o ciertos establecimientos. Como verbo: work, works, worked, working." },
  influencer: { categoria: "Nombre de agente inglés, usado también como préstamo en español.", formacion: "influence + -er: el sufijo inglés forma un nombre de agente; la e final de influence no se conserva ante -er. No se divide en piezas españolas como in + flu + encer.", flexion: "En español puede combinarse con el o la sin cambiar la forma. El préstamo presenta el plural influencers." },
  adultus: { categoria: "Adjetivo latino; también participio de adolescere.", formacion: "adult- + -us: base y terminación de nominativo singular masculino. Adulta y adultum muestran otras terminaciones. La historia del participio se explica por separado.", flexion: "Adultus, adulta, adultum varían por género; el latín cambia también la terminación según número y caso." },
  puer: { categoria: "Sustantivo latino masculino de segunda declinación.", formacion: "Puer es el nominativo singular; pueri, el genitivo singular. La base puer- se mantiene en formas como puerum. No se divide pu + er.", flexion: "Puer, pueri y puerum son formas de caso. Pueri también puede ser nominativo plural; la oración permite distinguirlo." },
  infans: { categoria: "Adjetivo latino de una terminación, empleado también como sustantivo.", formacion: "in- —negación— + fans, participio de fari —hablar—. La referencia es infans, genitivo infantis: la base de la declinación es infant-. Esta historia lingüística no define la agencia de una persona.", flexion: "Infans es el nominativo singular; infantis e infantem son otras formas de caso. Infantes es una forma de plural." },
};

export function getMorphology(word: string): LinguisticMorphology | undefined {
  const value = MORPHOLOGY[normalize(word)];
  return value ? { ...value } : undefined;
}
