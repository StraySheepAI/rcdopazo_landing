# Base de DIMA

## Flujo implementado

Plus y la colección del libro autentican su acceso → comprueba que puede abrir la base → devuelve una ficha editorial o busca una respuesta previa con el mismo contexto → si hace falta, consulta archivos y genera → valida las dos capas, incluida la morfología → guarda ficha y registro de consulta de forma atómica → responde con `registro.guardado=true`.

Los borradores no aparecen en el catálogo gratuito ni habilitan accesos del libro. Las respuestas mal formadas o truncadas no se guardan como lecturas válidas. Las fallas de almacenamiento devuelven 503 y no afirman que la respuesta quedó guardada. La base no guarda el código de acceso ni la cookie. El contexto, cuando se envía, queda en el archivo privado y forma parte de la clave de reutilización.

## Tablas

`dima_readings`: identificador de versión por hash, palabra, clave normalizada (conserva acentos), contexto y su hash, respuesta JSON completa, estado editorial, origen, modelo, versión del prompt, fechas de creación y actualización.

`dima_consultations`: identificador de consulta, referencia a la lectura y fecha. Una respuesta idéntica puede tener múltiples consultas sin duplicar su contenido. Las dos inserciones son atómicas. Los parámetros SQL se envían separados de la consulta.

Estados: `seleccion` identifica una copia de las fichas que ya forman la gratuita; no certifica aprobación académica. `pendiente`, `revisada` y `descartada` conservan el proceso de revisión. La revisión no publica automáticamente y no convierte en verificada una etimología sin evidencia.

## Uso local

Configurar en `.env.local`:

```dotenv
DIMA_SQLITE_PATH=.dima-data/dima.sqlite
DIMA_LOCAL_REVIEW=1
```

Ejecutar `npm run db:dima`. El directorio queda privado y excluido de Git; el archivo tiene permisos 0600. La vista local está en `/dima/base`, con lista paginada, lectura completa, estados y descarga JSON. Las 44 fichas ya se importaron en la prueba de esta computadora. No se agregan entradas ficticias a esa base para simular consultas de IA.

SQLite usa WAL, claves foráneas y un tiempo de espera ante escrituras concurrentes. Para un respaldo completo hay que usar la función de backup de SQLite o detener la aplicación y copiar la base junto con su WAL; la descarga JSON es una exportación de contenido y metadatos. No eliminar `.dima-data` al limpiar compilaciones.

## Sitio alojado

La publicación autorizada utiliza el almacenamiento privado Blob que ya está conectado al proyecto. `DIMA_STORAGE=blob` habilita un archivo JSON privado, `dima/v1/base.json`, separado de los archivos del campus por su ruta. Se importa la selección de 44 palabras al crear el archivo. Cada consulta actualiza ficha y registro juntos mediante una escritura condicional con ETag; ante concurrencia, vuelve a leer y reintenta sin sobrescribir cambios ajenos. La lectura evita la caché del CDN. No hay archivos de base públicos ni almacenamiento en el disco temporal de una función.

Este archivo sirve para el volumen inicial. Cada operación lee el documento completo; si el corpus o la concurrencia crecen, migrar a Postgres. No ofrece consultas SQL ni las prestaciones de una base relacional. El conector de Postgres sigue disponible y tiene prioridad cuando se configura `DIMA_DATABASE_URL`.

El catálogo protegido de Plus reúne la selección gratuita, las formas del libro disponibles y las nuevas palabras guardadas. La gratuita conserva sus 44 palabras. Tanto Plus como el libro guardan antes de responder y comparten la reutilización de una versión con el mismo contexto y modelo.

La generación conserva la conexión directa de Anthropic cuando ya existe. La alternativa de alojamiento usa `DIMA_GATEWAY_MODEL`, verificado contra el catálogo del proveedor, y autentica las solicitudes con la identidad del despliegue en Vercel; no requiere copiar una clave personal del proveedor. La disponibilidad real depende de la autorización y el saldo del equipo. No se certifican etimologías generadas sin evidencia revisada.

### Alternativa Postgres

Usar una base Neon Postgres persistente y `DIMA_DATABASE_URL` solo en el servidor. El conector usa el driver oficial `@neondatabase/serverless`, consultas parametrizadas y transacciones. Las tablas se crean al inicializar; la selección se importa explícitamente con el mismo comando. No se escribe en el Airtable histórico.

No se creó una cuenta de base adicional. La administración local no se habilita en el alojamiento: requiere una sesión editorial privada antes de ofrecerla en línea. Los códigos de lectores no conceden permisos de edición. La clave impresa del libro se conserva. La prueba local sigue usando SQLite y no requiere iniciar sesión en Vercel.

## Morfología

Las 44 entradas incluyen `inside.linguistica`: categoría, formación y flexión. Se conserva separada de la raíz histórica y de `inside.morfologia`, que contiene los movimientos simbólicos. La generación debe incluir esa descripción; si falta, se rechaza la salida. Para palabras arbitrarias la descripción generada sigue siendo una propuesta que requiere revisión; no recibe certificación por haber sido guardada.

Referencias de implementación: [SQLite de Node](https://nodejs.org/api/sqlite.html), [driver oficial de Neon](https://neon.com/docs/serverless/serverless-driver). Criterio gramatical: [morfología, RAE-ASALE](https://www.rae.es/gtg/morfolog%C3%ADa) y [plural, DPD](https://www.rae.es/dpd/plural). Las fuentes léxicas específicas siguen vinculadas en cada ficha.
