import { DIMA_STEPS, type DimaResult } from "@/lib/dima/schema";
import styles from "./page.module.css";

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
    <section><h3>Morfología mágica</h3><p>{inside.morfologia.nota}</p>
      <div className={styles.tableWrap}><table><caption className={styles.srOnly}>Movimientos simbólicos de la lectura DIMA</caption><thead><tr><th scope="col">Movimiento</th><th scope="col">Pregunta que revela</th></tr></thead><tbody>{inside.morfologia.movimientos.map((movement) => <tr key={movement.nombre}><th scope="row">{movement.nombre}</th><td>{movement.pregunta}</td></tr>)}</tbody></table></div>
    </section>
    <section><h3>¿Qué nos dice DIMA?</h3>{inside.lectura.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</section>
    <section><h3>Frase transmutada</h3><blockquote>{inside.fraseTransmutada}</blockquote></section>
    <section><h3>Dictum Mutare</h3><p className={styles.dictum}>{inside.dictum.map((line, index) => <span key={index}>{line}</span>)}</p></section>
    <section className={styles.insight}><h3>MPI Insight</h3><p>{inside.insight}</p></section>
    <section><h3>Activación</h3><p>{inside.activacion}</p></section>
    <p className={styles.signature}>{inside.cierre}</p>
    <details className={styles.sourceNotes}><summary>Fuentes y notas de esta lectura</summary>
      <p>La raíz conserva la información lingüística disponible y su alcance. La morfología mágica y la lectura DIMA son interpretativas.</p>
      {result.fuentes.length ? <ul>{result.fuentes.map((source) => <li key={source.id}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.titulo}</a><span>Referencia consultada el {source.consulta}.</span></li>)}</ul> : <p>El origen no cuenta con una fuente lingüística revisada para esta entrada. Esa limitación se conserva en la lectura.</p>}
    </details>
    {ampliado && <details className={styles.sourceNotes}><summary>Ver el análisis ampliado</summary><ol>{DIMA_STEPS.map((step) => <li key={step.id}><h4>{step.title}</h4><p>{result.analisis[step.id].texto}</p></li>)}</ol></details>}
  </article>;
}
