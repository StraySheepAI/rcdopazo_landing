# Administrador de Obras y Contacto — estado y plan

**No implementado en esta iteración.** Esta carpeta documenta la propuesta;
no contiene ninguna ruta `/admin` funcional. Se decidió no construir una
interfaz que pareciera un administrador real pero solo guardara en memoria
o en `localStorage` — eso se pierde al cambiar de dispositivo, navegador o
al redesplegar, y hubiera sido presentar como "resuelto" algo que no lo
está.

## Por qué no se puede completar todavía

Un administrador real que persista de verdad necesita, como mínimo:

1. **Una base de datos** (para las obras, categorías y canales de
   contacto) — por ejemplo Postgres gestionado (Vercel Postgres, Neon,
   Supabase) o un headless CMS (Sanity, Payload).
2. **Autenticación** para que solo R.C. Dopazo pueda entrar a editar — por
   ejemplo NextAuth/Auth.js con email+contraseña o un proveedor OAuth.
3. **Almacenamiento de imágenes** para las portadas/imágenes destacadas que
   se suban desde el panel — por ejemplo Vercel Blob, Cloudinary o S3.
4. **Un entorno de despliegue con backend persistente.** El proyecto hoy
   tiene `netlify.toml`, lo que sugiere Netlify como destino; Netlify
   sirve bien contenido estático/SSR pero la base de datos y el storage de
   imágenes son servicios aparte que hay que contratar y conectar
   igual, sea cual sea el hosting final.

Ninguna de esas cuatro piezas tiene todavía una cuenta, credencial o
decisión de proveedor confirmada por R.C. Dopazo. Sin eso, cualquier
código de autenticación/DB que se escribiera no podría conectarse a nada
real — y afirmar que "el administrador quedó operativo" sería falso.

## Lo que SÍ queda preparado en este entregable

- `app/lib/obras.ts` ya modela exactamente los campos que un panel de
  Obras necesitaría exponer: id, título, slug, categoría, descripción,
  tagline, nota, filiaciones, imagen de catálogo, imagen destacada,
  botones (texto + destino + interno/externo cada uno), `published`,
  `featured`, orden de catálogo y orden de destacadas.
- `app/lib/contact.ts` modela los canales de contacto de la página
  personal (tipo, activo/inactivo, texto, valor, destino, orden) de forma
  independiente del contacto de MPA Flow o del portfolio laboral.
- Home y `/obras` ya leen estos datos a través de funciones (
  `getFeaturedObras`, `getPublishedObras`, `getObrasByCategory`,
  `getVisibleContactChannels`) en vez de tener contenido hardcodeado. El
  día que exista una base de datos real, esas funciones son el único
  lugar que hay que cambiar (para que lean de la DB en vez del array en
  memoria) — ninguna página visual necesita reescribirse.

## Qué falta decidir antes de construir el panel real

- Proveedor de base de datos (o headless CMS) — cuenta y credenciales.
- Proveedor de autenticación — cuenta y credenciales, y quién puede
  entrar (solo R.C. Dopazo, o más de una persona).
- Proveedor de almacenamiento de imágenes — cuenta y credenciales.
- Confirmación de que el hosting final sea Netlify (según `netlify.toml`)
  u otro, porque cambia qué integraciones son nativas y cuáles hay que
  armar a mano.

Una vez que R.C. Dopazo confirme estas cuatro decisiones (y comparta las
credenciales correspondientes, que nunca deben inventarse ni simularse),
se puede construir: rutas protegidas bajo `/admin` (fuera de la
navegación pública), formularios de alta/edición/archivado con
confirmación para Obras, gestión de canales de Contacto, y previsualización
antes de publicar — todo apoyado en la estructura de datos que ya existe
hoy en `app/lib/`.
