import type { DimaResult } from "@/lib/dima/schema";
import InsideReading from "./InsideReading";
import shell from "./shell.module.css";

export type ReadingDepth = 1 | 2 | 3;

export default function ReadingJourney({ result, depth, ampliado, onAdvance, onRestart }: {
  result: DimaResult; depth: ReadingDepth; ampliado: boolean;
  onAdvance: (depth: ReadingDepth) => void; onRestart: () => void;
}) {
  return <>
    <p className={shell.journeyStatus} role="status">{depth} de 3 capas abiertas. Lo que ya abriste permanece en la lectura.</p>
    <div className={shell.report} id="dima-layer-1" tabIndex={-1}><InsideReading result={result} layer={1} showTitle={false} /></div>
    <nav className={shell.depthNav} aria-label="Capas del informe DIMA">{([
      { id: 1, title: "Qué contiene", detail: "Lectura esencial" },
      { id: 2, title: "Cómo se construye", detail: "ATS · Morfología y Verbus Prime" },
      { id: 3, title: "Qué puede abrir", detail: "ARS M · Reconfiguración" },
    ] as const).map((item, index) => <div className={shell.depthItem} key={item.id}>{index > 0 && <i aria-hidden="true" />}<button type="button" className={depth >= item.id ? shell.done : ""} aria-expanded={depth >= item.id} aria-controls={`dima-layer-${item.id}`} onClick={() => onAdvance(item.id)}><b>0{item.id}</b><span>{item.title}</span><small>{item.detail}</small></button></div>)}</nav>
    {depth === 1 && <button type="button" className={shell.nextDepth} onClick={() => onAdvance(2)}>VER CÓMO ESTÁ CONSTRUIDA →</button>}
    {depth >= 2 && <div className={shell.reportLayer} id="dima-layer-2" tabIndex={-1}><InsideReading result={result} layer={2} showTitle={false} />{depth === 2 && <button type="button" className={shell.nextDepth} onClick={() => onAdvance(3)}>VER LA RECONFIGURACIÓN →</button>}</div>}
    {depth >= 3 && <div className={shell.reportLayer} id="dima-layer-3" tabIndex={-1}><InsideReading result={result} layer={3} ampliado={ampliado} showTitle={false} /><button type="button" className={shell.nextDepth} onClick={onRestart}>ABRIR OTRA PALABRA ↑</button></div>}
  </>;
}
