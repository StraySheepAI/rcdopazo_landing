"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReadingSummary, StoredReading, ReviewState } from "@/lib/dima/database";
import InsideReading from "../InsideReading";
import styles from "../page.module.css";

const labels: Record<ReviewState, string> = { seleccion: "Selección gratuita", pendiente: "Por revisar", revisada: "Revisada", descartada: "Descartada" };
export default function BaseView() {
  const [page, setPage] = useState(0);
  const [revision, setRevision] = useState(0);
  const [entries, setEntries] = useState<ReadingSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [id, setId] = useState("");
  const [entry, setEntry] = useState<StoredReading | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError("");
    fetch(`/api/dima/base?pagina=${page}`, { signal: controller.signal }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      if (!controller.signal.aborted) { setEntries(data.entradas); setTotal(data.total); }
    }).catch((cause) => { if (!controller.signal.aborted) setError(cause.message || "No pudimos abrir la base."); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [page, revision]);
  useEffect(() => {
    setEntry(null);
    if (!id) return;
    const controller = new AbortController();
    fetch(`/api/dima/base?id=${id}`, { signal: controller.signal }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      if (!controller.signal.aborted) setEntry(data);
    }).catch((cause) => { if (!controller.signal.aborted) setError(cause.message || "No pudimos abrir la lectura."); });
    return () => controller.abort();
  }, [id]);
  async function review(state: "pendiente" | "revisada" | "descartada") {
    if (!entry) return;
    setSaving(true); setError("");
    try {
      const response = await fetch("/api/dima/base", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: entry.id, estado: state }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setEntry(data); setRevision((value) => value + 1);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "No pudimos guardar la revisión."); }
    finally { setSaving(false); }
  }
  return <main className={styles.page}>
    <header className={styles.header}><Link href="/dima">← Volver a DIMA</Link><span>ARCHIVO PRIVADO · PRUEBA LOCAL</span></header>
    <section className={styles.intro}><p className={styles.eyebrow}>LA BASE DE DIMA</p><h1>Las palabras que vamos abriendo.</h1><p className={styles.lead}>Acá se conservan las lecturas de la selección y las consultas de Plus. Una lectura nueva queda por revisar; revisarla no la publica en la gratuita.</p><div className={styles.reviewActions}><button type="button" onClick={() => setRevision((value) => value + 1)} disabled={loading}>Actualizar</button><a href="/api/dima/base?exportar=1" download>Descargar copia de la base</a></div>
      {error && <p className={styles.error} role="alert">{error}</p>}<p role="status">{loading ? "Abriendo la base…" : `${total} lecturas guardadas.`}</p>
      <div className={styles.reviewList}>{entries.map((item) => <button type="button" key={item.id} disabled={saving} onClick={() => { if (id !== item.id) setEntry(null); setId(item.id); setError(""); }} aria-pressed={id === item.id}><strong>{item.palabra}</strong><span>{labels[item.estado]} · {item.consultas} consultas</span><small>{new Date(item.actualizada).toLocaleString("es-AR")}</small></button>)}</div>
      <div className={styles.reviewActions}><button type="button" disabled={page === 0 || loading} onClick={() => setPage((value) => value - 1)}>Anterior</button><span>Página {page + 1}</span><button type="button" disabled={(page + 1) * 50 >= total || loading} onClick={() => setPage((value) => value + 1)}>Siguiente</button></div>
    </section>
    {entry && <section className={styles.reading}><div className={styles.reviewActions}><strong>{labels[entry.estado]}</strong>{entry.modelo && <span>Modelo: {entry.modelo}</span>}{entry.estado !== "seleccion" && <><button type="button" disabled={saving || entry.estado === "revisada"} onClick={() => review("revisada")}>Marcar revisada</button><button type="button" disabled={saving || entry.estado === "pendiente"} onClick={() => review("pendiente")}>Dejar por revisar</button><button type="button" disabled={saving || entry.estado === "descartada"} onClick={() => review("descartada")}>Descartar</button></>}</div>{entry.contexto && <p>Contexto de esta consulta: {entry.contexto}</p>}<InsideReading result={entry.resultado} ampliado /></section>}
  </main>;
}
