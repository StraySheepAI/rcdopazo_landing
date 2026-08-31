"use client";

import { useEffect, useState } from "react";

export default function PulsusFractumPage() {
  const [hash, setHash] = useState("");

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash);
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  return (
    <main className="pf-original-shell">
      <iframe className="pf-original-frame" src={`/pulsus-fractum-original.html${hash}`} title="Pulsus Fractum · Escuela de Metalkimia" />
    </main>
  );
}
