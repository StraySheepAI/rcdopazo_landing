# DIMA · Tres modalidades

Referencia editorial proporcionada por la autora: **INSIDE DIMA · DEVOCIÓN**. La gratuita es una consulta completa y comprensible, con voz, preguntas y activación. No es un formulario técnico ni una ficha de casilleros.

## Referencia visual y recorrido confirmados

La referencia es la página publicada en https://www.rociodopazo.com/dima, confirmada por Rocío mediante capturas el 31 de octubre de 2026. Se recuperó su diseño de cámara, atmósfera, oro antiguo metalizado y portales desde la versión de `app/dima/page.module.css` en `main`, conservada en `app/dima/shell.module.css`. El HTML de entrada mantiene ese diseño y conecta el corpus revisado y la base de consultas.

Sus puertas son **Configuración oculta**, **Análisis Metalquímico** y **Colecciones de obra**. No se confunden con Conjuratio Dominus, Verbum Prime y Sermo Dominus del archivo histórico `legacy-imports/dima/index.html`: ese archivo no es la referencia visual solicitada.

Configuración oculta abre las 44 lecturas completas sin clave. Análisis Metalquímico requiere la clave de DIMA Plus. Colecciones de obra requiere la clave histórica del libro. El informe se recorre en tres capas: **Cómo se construye** —anátesis, origen y morfología dentro del diagrama—, **Cómo se reconfigura** —Pulsus, relaciones, distinciones, agencia y activación— y **Qué revela** —síntesis, definición DIMA, frase, Dictum e integración—. La síntesis se presenta al final, después de desmembrar y reconfigurar; no es una conclusión anticipada en la primera pantalla. Esta corrección metodológica fue confirmada por Rocío el 31 de octubre de 2026. La apertura es acumulativa: los botones agregan la segunda y la tercera capa debajo de lo ya abierto, sin reemplazar ni desmontar las tarjetas anteriores. Volver a una capa abierta solo desplaza el foco; no cierra las siguientes ni restablece sus desplegables. Las tres capas de la gratuita están disponibles sin clave; no se recortó su contenido para crear un desbloqueo artificial.

Las capturas del 31 de octubre de 2026 son referencia para la disposición: tarjeta esencial con «¿Por qué DIMA llega a esta lectura?»; encabezados ATS y ARS M; tarjetas cortas en dos columnas que pasan a una en celular; y cierre opcional «Escuchar el susurro de DIMA». La justificación usa los campos actuales Pulsus y Distinciones. Las tarjetas ATS usan raíz, configuración, movimiento funcional y pregunta de apertura, sin trasladar categorías como «Alta» al campo de morfología. El susurro presenta el cierre ya conservado de cada lectura. Se mantiene el contenido del corpus, no se copian afirmaciones del ejemplo histórico como hechos lingüísticos.

Las puertas protegidas validan las claves en el servidor antes de consultar. No hay un cobro ni una compra integrados: disponer de una clave y procesar un pago son acciones distintas. La conexión real de generación y la base remota siguen pendientes; los avisos de la prueba lo explican.

## DIMA gratuita

Selección pública de palabras con una consulta legible:

1. INSIDE DIMA · palabra y variantes.
2. Pregunta de entrada.
3. Palabra raíz con fuentes visibles. La configuración de la palabra presenta la morfología dentro del diagrama: clase de palabra, componentes con su función y variaciones. Para las fichas editoriales, la primera oración de la explicación se muestra como extracto breve; cuando hay precisiones adicionales, «Ver la explicación completa» conserva el texto íntegro. No se inventan prefijos ni sufijos para forzar una división. Estos contenidos se encuentran en la primera capa del recorrido.
4. La lectura DIMA: nota metodológica visible y tarjetas de movimientos simbólicos con sus preguntas. Las relaciones léxicas no se representan como antepasados históricos.
5. ¿Qué nos dice DIMA?: qué habilita, qué puede limitar y cómo participa la persona con agencia.
6. Frase transmutada.
7. Dictum Mutare.
8. MPI Insight.
9. Activación concreta.
10. Firma de cierre y fuentes consultables.

Los ocho pasos analíticos originales siguen sosteniendo el método internamente. No tienen que convertirse en ocho apartados técnicos para quien consulta gratis. Devoción conserva el texto de referencia de la autora en `lib/dima/devocion.ts`.

Hay 44 entradas públicas: las 43 preparadas más Devoción. Las demás presentaciones usan preguntas y versos editoriales específicos, con lectura simbólica expresamente diferenciada del dato lingüístico. Siguen sujetas a revisión de la autora.

## ¡Qué embole! · Plus Libro

Colección vinculada al libro. Requiere su clave específica y una sesión verificada por el servidor. Su alcance es el glosario de la obra, no cualquier palabra. La vista local muestra las entradas de la colección que ya están preparadas. La colección completa depende del archivo privado y/o de la conexión de generación correspondiente; no se presenta el listado de 25 nombres como 25 análisis terminados si esa conexión falta.

El API rechaza una petición directa `nivel=libro` sin la sesión adecuada, incluso si se ocultan o alteran controles de pantalla. Una clave Plus no se interpreta como una licencia del libro.

## DIMA Plus · Plus VIP en el código anterior

Acceso con su propia clave para consultar una palabra o expresión libre y abrir el análisis ampliado. Requiere la conexión real al proveedor de IA. La clave de libro no lo habilita.

La versión local reconoce el acceso, pero mantiene explícita la indisponibilidad de la consulta libre mientras no existe `ANTHROPIC_API_KEY`. No se simula una respuesta de IA ni se describe esa conexión como comprobada mediante pruebas con respuestas simuladas.

No se agregan promesas de historial, descarga, cobro o límites comerciales sin implementarlas y revisarlas.

## Estado de los accesos

`POST /api/dima/access` valida el código en el servidor y genera una cookie firmada, `HttpOnly` y `SameSite=Strict`, con `Secure` en HTTPS. La sesión vence a los siete días y queda invalidada al cambiar el hash de la clave. `DELETE` elimina la cookie del dispositivo. No se guardan claves en URLs ni en el almacenamiento del navegador.

Las claves se configuran como hashes normalizados mediante `DIMA_BOOK_CODE_HASH` y `DIMA_PLUS_CODE_HASH`. `DIMA_SESSION_SECRET` es obligatorio, aleatorio y exclusivo del servidor; no hay un secreto de reserva fijo. En la copia local se conservaron las claves históricas mediante sus hashes en `.env.local`, que está excluido de Git. No se cargaron nuevas variables en Vercel.

La clave del libro debe conservarse: está impresa en ejemplares ya distribuidos y cambiarla dejaría sin acceso a sus lectores. No se reemplaza ni se elimina por una rotación técnica. La copia local conserva la clave original del código heredado mediante su hash; no se copia el valor en nuevos archivos públicos. Rocío confirmó el 31 de octubre de 2026 que esa clave original es la que corresponde al libro. La confirmación proviene de la autora; las páginas de Notion consultadas no mostraron la clave escrita.

Las claves históricas figuraban en el HTML público heredado; esa exposición no autoriza a invalidar la clave del libro. La limitación de intentos incluida opera por instancia; para un límite global entre instancias hace falta almacenamiento compartido o una regla del alojamiento. No se presume que el límite en memoria sea global.

La publicación permanece en pausa hasta la revisión de la autora. La prueba local no requiere entrar a Vercel ni crear cuentas para visitantes.

## Base de lecturas y consultas

Las 44 fichas, incluida su morfología lingüística, se importaron en la base local. El corpus editorial sigue siendo la fuente de la selección gratuita; la importación conserva también una copia en la base. No se amplía automáticamente el catálogo público al recibir consultas de Plus.

Cada respuesta de Plus, incluso una lectura que ya estaba preparada, debe guardarse antes de responder. Las versiones nuevas quedan `pendiente`, con palabra, contexto, respuesta completa, fuentes, origen, modelo cuando corresponde, versión del prompt y fechas. Se registra cada consulta sin almacenar claves, cookies, direcciones IP ni identidad del visitante. Las respuestas idénticas en un mismo contexto no duplican la ficha; las consultas sí se cuentan individualmente.

Para una palabra no incluida en la selección, Plus busca una versión guardada del mismo término, contexto, modelo y versión del prompt. Puede reutilizar una propuesta pendiente dentro de Plus; eso no la convierte en una ficha revisada. Las descartadas no se reutilizan. Si no encuentra una versión, consulta los archivos disponibles, genera, valida y guarda. Una base ausente o con error impide devolver un falso éxito de guardado. La gratuita no depende de la disponibilidad de la base.

La vista `/dima/base` permite abrir lecturas, marcar propuestas como revisadas o descartadas y descargar una copia JSON. Es una herramienta privada de la prueba local, habilitada solo con `DIMA_LOCAL_REVIEW=1` y un host de loopback. En Vercel permanece deshabilitada; hace falta una sesión de edición propia antes de ofrecer esa administración en línea. La clave del libro y la clave de Plus no otorgan permisos de edición. Marcar revisada no publica ni modifica la selección de 44 palabras.

El archivo SQLite local está en `.dima-data/dima.sqlite`, fuera de Git y de los archivos públicos. Es persistente en esta computadora, no una base compartida en la nube. Para el sitio alojado está preparado el conector Neon Postgres mediante `DIMA_DATABASE_URL`; esa base externa y su conexión real todavía no están provisionadas. El sistema rechaza SQLite cuando corre en Vercel para evitar perder consultas en un disco temporal. La conexión de IA sigue pendiente de `ANTHROPIC_API_KEY`.

`npm run db:dima` crea las tablas e importa la selección de forma idempotente. No reemplaza ni borra versiones existentes. Un cambio editorial en una ficha produce otra versión. La copia JSON permite conservar contenido y metadatos, pero no sustituye un respaldo completo del archivo SQLite o del proveedor Postgres.
