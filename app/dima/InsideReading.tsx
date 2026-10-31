import { DIMA_STEPS, type DimaResult } from "@/lib/dima/schema";
import { getWordMap } from "@/lib/dima/word-map";
import styles from "./page.module.css";

function WordAnatomy({ result }: { result: DimaResult }) {
  const morphology = result.inside?.linguistica;
  const map = getWordMap(result.palabra);
  return <figure className={styles.wordMap} aria-label={`Origen, formación y relaciones de ${result.palabra}`}>
    <figcaption className={styles.srOnly}>El origen histórico, cuando está documentado, conduce a la forma consultada. Las ramas muestran variaciones y relaciones; la familia léxica no representa ascendencia.</figcaption>
    {map?.origen && <><div className={styles.originNode}><span>{map.origen.lengua}</span><strong>{map.origen.forma}</strong></div><div className={styles.mapArrow} aria-hidden="true">↓</div></>}
    {map?.piezas && <><p className={styles.mapLabel}>Componentes gramaticales</p><ol className={styles.wordPieces}>{map.piezas.map((piece) => <li key={piece.forma}><strong>{piece.forma}</strong><span>{piece.funcion}</span></li>)}</ol><div className={styles.mapArrow} aria-hidden="true">↓</div></>}
    <div className={styles.wordNode}><span>La palabra</span><strong>{result.palabra}</strong>{morphology && <small>{morphology.categoria}</small>}</div>
    {map ? <ul className={styles.wordBranches}>{map.ramas.map((branch) => <li key={branch.titulo}><h4>{branch.titulo}</h4><div>{branch.formas.map((form) => <span key={form}>{form}</span>)}</div></li>)}</ul> : morphology && <ul className={styles.wordBranches}><li><h4>Cómo está formada</h4><p>{morphology.formacion}</p></li><li><h4>Cómo varía</h4><p>{morphology.flexion}</p></li></ul>}
  </figure>;
}

export default function InsideReading({ result, ampliado = false }: { result: DimaResult; ampliado?: boolean }) {
  const inside = result.inside;
  if (!inside) return <p role="alert">No pudimos abrir la lectura de esta entrada. Intentá nuevamente.</p>;
  return <article className={styles.inside} aria-labelledby="dima-result-title">
    <header className={styles.insideHead}>
      <p className={styles.eyebrow}>INSIDE DIMA</p><h2 id="dima-result-title">{result.palabra}</h2>
      {inside.variantes && <p className={styles.variants}>{inside.variantes}</p>}
      <p className={styles.opening}>{inside.apertura}</p>
      <p className={styles.consulted}>Consultamos a DIMA, el Dispositivo Inteligente de Magia Alquímica.</p>
    </header>
    <section><h3>Palabra raíz</h3><p>{inside.raiz}</p>
      {result.fuentes.map((source) => <a className={styles.sourceInline} key={source.id} href={source.url} target="_blank" rel="noopener noreferrer">{source.titulo}</a>)}
    </section>
    <section><h3>La palabra por dentro</h3><p className={styles.sectionLead}>Morfología: cómo está formada y cómo varía.</p>
      {inside.linguistica ? <><p><strong>Clase de palabra.</strong> {inside.linguistica.categoria}</p><p><strong>Cómo está formada.</strong> {inside.linguistica.formacion}</p><p><strong>Cómo varía.</strong> {inside.linguistica.flexion}</p></> : <p>Esta entrada todavía necesita una descripción de su formación gramatical.</p>}
      <WordAnatomy result={result} />
    </section>
    <section><h3>La lectura DIMA</h3><p className={styles.sectionLead}>Explorá estos movimientos y las preguntas que abren.</p>
      <p>{inside.morfologia.nota}</p>
      <ul className={styles.movementCards} aria-label="Movimientos de la lectura simbólica DIMA">{inside.morfologia.movimientos.map((movement, index) => <li key={movement.nombre}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><h4>{movement.nombre}</h4><p>{movement.pregunta}</p></li>)}</ul>
    </section>
    <section><h3>¿Qué nos dice DIMA?</h3>{inside.lectura.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</section>
    <section><h3>Frase transmutada</h3><blockquote>{inside.fraseTransmutada}</blockquote></section>
    <section><h3>Dictum Mutare</h3><p className={styles.dictum}>{inside.dictum.map((line, index) => <span key={index}>{line}</span>)}</p></section>
    <section className={styles.insight}><h3>MPI Insight</h3><p>{inside.insight}</p></section>
    <section><h3>Activación</h3><p>{inside.activacion}</p></section>
    <p className={styles.signature}>{inside.cierre}</p>
    <details className={styles.sourceNotes}><summary>Fuentes y notas de esta lectura</summary>
      <p>La raíz conserva la información lingüística disponible y su alcance. La morfología mágica y la lectura DIMA son interpretativas.</p>
      <p>La descripción gramatical distingue formación y flexión, siguiendo el alcance de la <a href="https://www.rae.es/gtg/morfolog%C3%ADa" target="_blank" rel="noopener noreferrer">morfología</a>. Para las voces españolas, pueden consultarse también las <a href="https://www.rae.es/dpd/plural" target="_blank" rel="noopener noreferrer">reglas de plural</a>. Las relaciones históricas conservan la referencia propia de cada entrada.</p>
      {result.fuentes.length ? <ul>{result.fuentes.map((source) => <li key={source.id}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.titulo}</a><span>Referencia consultada el {source.consulta}.</span></li>)}</ul> : <p>El origen no cuenta con una fuente lingüística revisada para esta entrada. Esa limitación se conserva en la lectura.</p>}
    </details>
    {ampliado && <details className={styles.sourceNotes}><summary>Ver el análisis ampliado</summary><ol>{DIMA_STEPS.map((step) => <li key={step.id}><h4>{step.title}</h4><p>{result.analisis[step.id].texto}</p></li>)}</ol></details>}
  </article>;
}
