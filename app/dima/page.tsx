export default function DimaPage() {
  return (
    <main className="dima-live-shell">
      <iframe
        className="dima-live-frame"
        src="/dima-app/index.html"
        title="DIMA — Diccionario Inteligente de Magia Alquímica"
        allow="clipboard-write"
      />
    </main>
  );
}
