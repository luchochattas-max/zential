## Proyecto

Landing de **Zential** (agencia de IA para negocios), en producción en https://zential-site.vercel.app.

- Antes de trabajar, leer `.factory/brain.md` (memoria del proyecto: decisiones, reglas, cómo se verifica). Las tareas de la AI Factory se manejan con `/factory` y su estado vive en `.factory/`.
- Antes de trabajar, leer también la sección **"ESTADO ACTUAL"** de `../historial-de-cambios.md`: servicios vigentes, preferencias del usuario y pendientes.
- Después de cada cambio que se publique, agregar una entrada con fecha en `../historial-de-cambios.md` y actualizar "ESTADO ACTUAL" y "Pendientes" si cambian.
- El usuario (Lucas) no es programador: explicarle en español rioplatense, en palabras simples, y con pasos concretos.

### Reglas de contenido

- Textos formales y profesionales. Nada de frases resaltadas en color dentro de las descripciones.
- Todo botón de contacto, "Consultar por…" o "Conocer más" va a WhatsApp con `whatsappUrl()` de `src/config/whatsapp.ts`. No usar `mailto:`.
- Los mensajes predefinidos de WhatsApp son formales y sin "Hola Zential".
- **Antes de cualquier cambio** (aunque sea chico): decirle exactamente qué se va a cambiar, mostrando el texto actual y el nuevo, y esperar su OK.
- **Los cambios se hacen en local** (vista previa) y **se publican solo cuando el usuario dice que está listo**, no después de cada paso.

### Publicar

1. `npm run build`
2. `npx vercel deploy --prod --yes`. Si devuelve `"status": "error"`, reintentar una vez; suele ser pasajero.
3. Avisar a Bing por IndexNow (la clave está en `public/1418224b1234474fa1bb09bbcf8a2a13.txt`; no borrarla):
   `curl -X POST https://api.indexnow.org/indexnow -H "Content-Type: application/json" -d '{"host":"zential-site.vercel.app","key":"1418224b1234474fa1bb09bbcf8a2a13","keyLocation":"https://zential-site.vercel.app/1418224b1234474fa1bb09bbcf8a2a13.txt","urlList":["https://zential-site.vercel.app/"]}'` (200 o 202 = ok). Si se agregan páginas, sumarlas a `urlList` y a `public/sitemap.xml`.
4. Verificar en producción con `curl` (por ejemplo, que todos los `wa.me/` tengan el número y mensaje correctos) y, si cambió algo visual, mirar también la vista de celular (375 px).

### Particularidades del entorno

- Windows + PowerShell 5.1: no acepta `&&`. Cuando le pases comandos al usuario, dáselos de a uno.
- El proyecto está en OneDrive y a veces el servidor de desarrollo sirve estilos viejos después de editar un componente. Si lo que se ve no coincide con el código, reiniciar el servidor de desarrollo.
- Google Analytics solo se incluye en producción (`import.meta.env.PROD`), así que en local `window.gtag` no existe.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
