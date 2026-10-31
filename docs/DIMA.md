# Consulta DIMA · versión 2

El recorrido conserva las tres profundidades de la pantalla y entrega ocho etapas en orden:
morfología/etimología → Pulsus → configuración/operación → distinciones → Nodus/relación/agencia → transmutación → definición DIMA → frase síntesis.

## Contrato y evidencia

`lib/dima/schema.ts` es el contrato compartido por API y pantalla. Cada etapa tiene texto, estado (`documentado`, `interpretacion`, `pendiente`) y referencias por identificador. `completo` significa que las ocho etapas contienen una lectura, **no** una certificación académica del conjunto.

La lingüística documentada y la interpretación DIMA se muestran por separado. La IA no verifica fuentes: el servidor conserva únicamente la evidencia revisada que se le haya suministrado; sin ella, el primer paso queda explícitamente pendiente y el resto se presenta como propuesta provisional. El modelo no puede autocertificarse ni inventar enlaces visibles.

`lib/dima/corpus.ts` incluye dos fichas de referencia: Patraña y Embole. La referencia al DLE respalda solo los datos lingüísticos indicados; los otros siete pasos son propuestas interpretativas para revisión editorial. No se han convertido automáticamente las demás fichas en análisis completos.

Pulsus se usa aquí como descripción funcional del movimiento propuesto; no es una escala moral ni el contador de consultas `Pulsus` del sistema antiguo. Nodus hace explícitos participantes, relación, agencia y límites. Estas pautas operativas pueden refinarse editorialmente sin cambiar el contrato.

## Orígenes y compatibilidad

- Las fichas de referencia se sirven desde el servidor en las tres modalidades, incluida Embole. La pantalla ya no contiene una ficha especial.
- La modalidad pública sigue leyendo Google Sheets. Si la planilla falla, el catálogo ofrece las dos fichas de referencia.
- El modo ampliado consulta Airtable si está configurado. Una caída de Sheets no impide esa consulta.
- Sin registro en Airtable, genera con Anthropic si hay clave y utiliza la ficha pública disponible como contexto no verificado.
- Sin clave, conserva la ficha pública si existe; en otro caso informa que la lectura asistida no está configurada. No llama al generador antiguo ni realiza escrituras en Airtable.

Los campos heredados conservan sus nombres y aparecen en un detalle aparte. `Gradus Vibrationi` no se convierte en Verbus Prime ni `Natura Vibrationis` en configuración. `Radix Aucta` se preserva como material sin verificar. Las columnas duplicadas del CSV se conservan juntas, en su orden original.

Para una migración gradual, se reconocen estas columnas nuevas (también sus etiquetas españolas, ver `adapter.ts`):

| Etapa | Columna |
| --- | --- |
| Morfología/etimología | `Morfologia_Etimologia` |
| Pulsus | `Pulsus_DIMA` |
| Configuración/operación | `Configuracion_Operacion` |
| Distinciones | `Distinciones_DIMA` |
| Nodus | `Nodus_DIMA` |
| Transmutación | `Transmutacion_DIMA` |
| Definición | `Definicion_DIMA` |
| Síntesis | `Frase_Sintesis` |

Completar una columna no le otorga verificación lingüística. Para publicar evidencia revisada, agregar una ficha al corpus con referencias concretas, fecha y alcance, y ejecutar las pruebas. Los campos nuevos de interpretación pueden migrarse sin modificar el material heredado. Esta implementación no modifica la planilla ni sus permisos.

## Generación

Se mantiene la API Messages de Anthropic y el modelo existente `claude-haiku-4-5-20251001`. `DIMA_MODEL` permite una configuración explícita posterior. `ANTHROPIC_API_KEY` y `AIRTABLE_TOKEN` siguen siendo variables exclusivamente del servidor. No se incorporan credenciales ni se modifica la configuración del alojamiento.

Las instrucciones del método se envían en `system`; término, contexto opcional (hasta 1000 caracteres) y archivo son datos en un mensaje `user`. El servidor valida los ocho pasos, rechaza respuestas truncadas, no muestra detalles privados del proveedor y nunca guarda automáticamente la generación.

El servicio externo `dima.magiaparaatrevidos.com` y los archivos de `legacy-imports/dima/` no se modifican. Dejan de formar parte del camino de respaldo de la API actual. Los accesos/códigos y la traducción completa ES/EN requieren trabajo separado; no se amplían ni se prometen en este cambio.

## Verificación

`npm run test:dima` comprueba el servicio HTTP con fuentes simuladas, el adaptador, las fuentes, las tres modalidades, fallos, entradas inválidas y respuestas incompletas, sin usar claves reales ni generar cargos.

`npx tsc --noEmit` y `npm run build` comprueban la integración. El recorrido visual debe verificar los pasos 1–8, fuentes, pendientes, cambio de palabra y cambio de puerta sin mostrar una respuesta anterior. No se considera probado el proveedor real sin sus credenciales.
