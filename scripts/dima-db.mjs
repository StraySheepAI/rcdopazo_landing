import { createDimaStore } from '../lib/dima/database.ts';
import { REVIEWED_WORDS, getReviewedAnalysis } from '../lib/dima/corpus.ts';

const store = await createDimaStore(process.env);
try {
  await store.initialize();
  for (const word of REVIEWED_WORDS) await store.save(getReviewedAnalysis(word), { seleccion: true, consulta: false });
  const { total } = await store.list();
  console.log(`Base DIMA lista: ${total} lecturas guardadas. La importación conserva las versiones y no duplica las fichas idénticas.`);
} finally { store.close(); }
