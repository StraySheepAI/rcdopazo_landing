# Consulta DIMA

La pantalla ofrece una consulta directa y una ficha de ocho pasos, sin las tres puertas previas ni navegación obligatoria entre capas:

morfología/etimología → Pulsus → configuración/operación → distinciones → Nodus/relación/agencia → transmutación → definición DIMA → frase síntesis.

## Corrección del catálogo incompleto

La primera implementación anunciaba todos los nombres de la planilla aunque solo Patraña y Embole tenían el nuevo análisis. Esto producía ocho casilleros con el mismo mensaje de pendiente. Esa entrega no constituía una lectura útil.

El catálogo público ahora contiene **43 fichas con contenido específico**: las 42 entradas de la selección anterior más Embole. Se normaliza `persona` a `Persona` y se corrige `Rigth` a `Right`. Cada ficha contiene los ocho pasos y una referencia lingüística. La pantalla ofrece solo fichas completas del corpus, no todas las filas en preparación de Google Sheets.

Las referencias documentan el alcance del primer paso: DLE para español, Online Etymology Dictionary para inglés y Lewis & Short a través de Perseus/Logeion para latín. Si una entrada no desarrolla toda su genealogía, el texto lo dice; no se completa una historia ausente mediante cortes arbitrarios de letras. Las hipótesis, como la procedencia que el DLE propone para ganar, conservan su carácter posible.

Los otros siete pasos son propuestas editoriales DIMA para revisión de la autora. La referencia lingüística no certifica esas interpretaciones, ni se presenta su síntesis como una verdad universal. Completo significa que hay contenido en los ocho pasos; no equivale a una revisión filológica exhaustiva ni a aprobación editorial de la autora.

## Archivos principales

- `lib/dima/schema.ts`: contrato compartido por API y pantalla.
- `lib/dima/corpus.ts` y `editorial.ts`: lecturas y referencias de la selección pública.
- `lib/dima/adapter.ts`: conservación de datos heredados con sus nombres originales.
- `lib/dima/service.ts`: consulta y generación, separadas de la ruta HTTP.
- `lib/dima/prompt.ts`: instrucciones del método y validación de generación.

Cada etapa tiene texto, estado (`documentado`, `interpretacion`, `pendiente`) y referencias por identificador. Documentado indica que el texto lingüístico cita una referencia consultada en el alcance señalado; no convierte una hipótesis etimológica en una certeza. La pantalla usa la etiqueta «Con fuente lingüística».

## Consulta y generación

`GET /api/dima` devuelve únicamente la selección completa, disponible sin claves, Google Sheets ni llamadas a un modelo. Cada palabra de esa lista debe poder devolver ocho pasos con contenido mediante `POST` en modalidad `free`.

Para una entrada fuera de la selección, el modo ampliado puede recuperar Google Sheets y Airtable como contexto y generar con Anthropic si existe una clave. Una ficha parcial de Airtable se usa como material de trabajo; ya no evita la generación devolviendo ocho casilleros vacíos. Si no hay análisis ni generación configurada, se muestra un mensaje de indisponibilidad, sin simular una ficha terminada.

Se mantiene la API Messages de Anthropic y el modelo existente `claude-haiku-4-5-20251001`. `DIMA_MODEL` permite una configuración explícita posterior. `ANTHROPIC_API_KEY` y `AIRTABLE_TOKEN` permanecen en el servidor. El método va en `system`; el término, contexto y material de archivo van como datos en `user`. El servidor valida las ocho etapas y rechaza truncamiento. Sin evidencia lingüística revisada, la generación no puede autocertificar el origen ni inventar enlaces visibles.

La generación no escribe automáticamente en Airtable y no llama al servicio antiguo. Los archivos de `legacy-imports/dima/`, la planilla, sus permisos y la configuración del alojamiento permanecen fuera del alcance de esta corrección.

Pulsus se utiliza como movimiento funcional propuesto, no como escala moral ni como el contador `Pulsus`. Nodus explicita participantes, relación, margen de acción y límites. Estas pautas operativas y las lecturas deben poder refinarse editorialmente.

## Migración de material heredado

No se renombran `Gradus Vibrationi` como Verbus Prime ni `Natura Vibrationis` como configuración. `Radix Aucta` y las demás columnas conservan su etiqueta dentro del material de archivo cuando se usan como contexto. Las columnas duplicadas del CSV se conservan juntas, sin sobrescribir silenciosamente el primer valor.

El adaptador admite columnas nuevas explícitas: `Morfologia_Etimologia`, `Pulsus_DIMA`, `Configuracion_Operacion`, `Distinciones_DIMA`, `Nodus_DIMA`, `Transmutacion_DIMA`, `Definicion_DIMA`, `Frase_Sintesis`. Completar una columna no otorga verificación ni publica automáticamente esa fila. Para ampliar la selección pública se agrega una ficha con sus ocho pasos y referencias al corpus y se ejecutan las pruebas.

## Verificación y publicación

`npm run test:dima` comprueba individualmente cada una de las 43 palabras ofrecidas, además del contrato, los archivos heredados, los fallos y la generación simulada. Ninguna palabra anunciada puede contener el mensaje repetido de pendiente.

`npx tsc --noEmit` y `npm run build` comprueban la integración. El recorrido local debe permitir elegir una palabra, consultar, leer los ocho pasos, ver la fuente y consultar otra. Cambiar el término cancela la consulta anterior y retira su resultado.

Las credenciales reales del proveedor y el entorno de producción no se dan por probados con respuestas simuladas. La publicación sigue detenida hasta la revisión de la autora. No se requiere iniciar sesión en Vercel para revisar la copia local.
