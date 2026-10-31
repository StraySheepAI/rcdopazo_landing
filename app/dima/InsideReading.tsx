import { DIMA_STEPS, type DimaResult } from "@/lib/dima/schema";
import { getWordMap } from "@/lib/dima/word-map";
import styles from "./page.module.css";

function WordAnatomy({ result }: { result: DimaResult }) {
  const morphology = result.inside?.linguistica;
  const map = getWordMap(result.palabra);
  const related = map?.ramas.filter((branch) => ["Familia de palabras", "Palabra derivada"].includes(branch.titulo)) || [];
  const variations = map?.ramas.filter((branch) => !related.includes(branch)) || [];
  return <figure className={styles.wordMap} aria-label={`Origen, formación y relaciones de ${result.palabra}`}>
    <figcaption className={styles.srOnly}>El origen histórico, cuando está documentado, conduce a la forma consultada. Las ramas muestran variaciones y relaciones; la familia léxica no representa ascendencia.</figcaption>
    {map?.origen && <><div className={styles.originNode}><span>{map.origen.lengua}</span><strong>{map.origen.forma}</strong></div><div className={styles.mapArrow} aria-hidden="true">↓</div></>}
    <div className={styles.wordNode}><span>La palabra</span><strong>{result.palabra}</strong>{morphology && <small><b>Clase de palabra.</b> {morphology.categoria}</small>}</div>
    {morphology && <ul className={styles.configurationBranches}>
      <li><h4>Cómo está formada</h4>
        {map?.piezas && <ol className={styles.wordPieces} aria-label="Componentes y función gramatical">{map.piezas.map((piece) => <li key={piece.forma}><strong>{piece.forma}</strong><span>{piece.funcion}</span></li>)}</ol>}
        <p>{morphology.formacion}</p>
      </li>
      <li><h4>Cómo varía</h4>{variations.map((branch) => <div className={styles.variationGroup} key={branch.titulo}><span>{branch.titulo}</span><div>{branch.formas.map((form) => <strong key={form}>{form}</strong>)}</div></div>)}<p>{morphology.flexion}</p></li>
    </ul>}
    {related.length > 0 && <ul className={styles.relatedWords}>{related.map((branch) => <li key={branch.titulo}><h4>{branch.titulo}</h4><div>{branch.formas.map((form) => <span key={form}>{form}</span>)}</div></li>)}</ul>}
  </figure>;
}

export default function InsideReading({ result, ampliado = false, layer = "all", showTitle = true }: { result: DimaResult; ampliado?: boolean; layer?: "all" | 1 | 2 | 3; showTitle?: boolean }) {
  const inside = result.inside;
  if (!inside) return <p role="alert">No pudimos abrir la lectura de esta entrada. Intentá nuevamente.</p>;
  const meaning = layer === "all" || layer === 1;
  const structure = layer === "all" || layer === 2;
  const practice = layer === "all" || layer === 3;
  return <article className={styles.inside} aria-label={`Consulta DIMA de ${result.palabra}`}>
    <header className={styles.insideHead}>
      <p className={styles.eyebrow}>INSIDE DIMA</p>{showTitle && <h2 id="dima-result-title">{result.palabra}</h2>}
      {inside.variantes && <p className={styles.variants}>{inside.variantes}</p>}
      <p className={styles.opening}>{inside.apertura}</p>
      <p className={styles.consulted}>Consultamos a DIMA, el Dispositivo Inteligente de Magia Alquímica.</p>
    </header>
    {structure && <><section><h3>Palabra raíz</h3><p>{inside.raiz}</p>
      {result.fuentes.map((source) => <a className={styles.sourceInline} key={source.id} href={source.url} target="_blank" rel="noopener noreferrer">{source.titulo}</a>)}
    </section>
    <section><h3>Configuración de la palabra</h3><p className={styles.sectionLead}>Su estructura, sus componentes y sus relaciones.</p>
      <WordAnatomy result={result} />
    </section></>}
    {meaning && <><section><h3>La lectura DIMA</h3><p className={styles.sectionLead}>Explorá estos movimientos y las preguntas que abren.</p>
      <p>{inside.morfologia.nota}</p>
      <ul className={styles.movementCards} aria-label="Movimientos de la lectura simbólica DIMA">{inside.morfologia.movimientos.map((movement, index) => <li key={movement.nombre}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><h4>{movement.nombre}</h4><p>{movement.pregunta}</p></li>)}</ul>
    </section>
    <section><h3>¿Qué nos dice DIMA?</h3>{inside.lectura.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</section></>}
    {practice && <><section><h3>Frase transmutada</h3><blockquote>{inside.fraseTransmutada}</blockquote></section>
    <section><h3>Dictum Mutare</h3><p className={styles.dictum}>{inside.dictum.map((line, index) => <span key={index}>{line}</span>)}</p></section>
    <section className={styles.insight}><h3>MPI Insight</h3><p>{inside.insight}</p></section>
    <section><h3>Activación</h3><p>{inside.activacion}</p></section>
    <p className={styles.signature}>{inside.cierre}</p></>}
    {structure && <details className={styles.sourceNotes}><summary>Fuentes y notas de esta lectura</summary>
      <p>La raíz conserva la información lingüística disponible y su alcance. La morfología mágica y la lectura DIMA son interpretativas.</p>
      <p>La descripción gramatical distingue formación y flexión, siguiendo el alcance de la <a href="https://www.rae.es/gtg/morfolog%C3%ADa" target="_blank" rel="noopener noreferrer">morfología</a>. Para las voces españolas, pueden consultarse también las <a href="https://www.rae.es/dpd/plural" target="_blank" rel="noopener noreferrer">reglas de plural</a>. Las relaciones históricas conservan la referencia propia de cada entrada.</p>
      {result.fuentes.length ? <ul>{result.fuentes.map((source) => <li key={source.id}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.titulo}</a><span>Referencia consultada el {source.consulta}.</span></li>)}</ul> : <p>El origen no cuenta con una fuente lingüística revisada para esta entrada. Esa limitación se conserva en la lectura.</p>}
    </details>}
    {ampliado && practice && <details className={styles.sourceNotes}><summary>Ver el análisis ampliado</summary><ol>{DIMA_STEPS.map((step) => <li key={step.id}><h4>{step.title}</h4><p>{result.analisis[step.id].texto}</p></li>)}</ol></details>}
  </article>;
}
