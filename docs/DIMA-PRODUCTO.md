# DIMA · Tres modalidades

Referencia editorial proporcionada por la autora: **INSIDE DIMA · DEVOCIÓN**. La gratuita es una consulta completa y comprensible, con voz, preguntas y activación. No es un formulario técnico ni una ficha de casilleros.

## DIMA gratuita

Selección pública de palabras con una consulta legible:

1. INSIDE DIMA · palabra y variantes.
2. Pregunta de entrada.
3. Palabra raíz, con referencia y límites documentales.
4. Morfología mágica: lectura simbólica, movimientos y preguntas. No se inventan morfemas ni se presenta esta tabla como etimología.
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

La clave del libro debe conservarse: está impresa en ejemplares ya distribuidos y cambiarla dejaría sin acceso a sus lectores. No se reemplaza ni se elimina por una rotación técnica. La copia local conserva la clave original del código heredado mediante su hash; no se copia el valor en nuevos archivos públicos. La confirmación contra el texto del libro en Notion sigue pendiente: las páginas consultadas no mostraron la clave escrita.

Las claves históricas figuraban en el HTML público heredado; esa exposición no autoriza a invalidar la clave del libro. La limitación de intentos incluida opera por instancia; para un límite global entre instancias hace falta almacenamiento compartido o una regla del alojamiento. No se presume que el límite en memoria sea global.

La publicación permanece en pausa hasta la revisión de la autora. La prueba local no requiere entrar a Vercel ni crear cuentas para visitantes.
