# Brain: zential-site

Memoria persistente del proyecto. Todo agente de la factory (spec, builder, revisores y approver) lo lee **antes** de decidir algo. Si una decisión no está acá, se pregunta; no se inventa.

El historial largo (rondas, auditorías, cuentas) está fuera del repo, en
`C:\Users\lucho\OneDrive\Documentos\Landin page zebntial\historial-de-cambios.md`. Este archivo es el resumen vigente.

## Qué es
Landing de contacto de **Zential** (agencia de IA para negocios, Buenos Aires). En producción en https://zential-site.vercel.app. Sirve para mostrar qué hace Zential y llevar a WhatsApp. **No es un sitio de contenido**: el 2026-10-07 el dueño rechazó crear páginas por servicio.

## Avatar del usuario de la web
Dueño o encargado de un negocio chico o mediano en Argentina, no técnico, que entra desde el celular (casi siempre desde Instagram o una búsqueda de "zential"). Quiere entender rápido qué le resuelve Zential y escribir por WhatsApp. Sin jerga técnica.

## Stack y arquitectura
- Astro 7 + Tailwind v4 compilado en build (nada de CDN). Íconos con `@lucide/astro` (SVG inline). Imágenes con `astro:assets` (WebP).
- Tipografías propias con `@fontsource/inter` y `@fontsource/poppins`. **No usar Google Fonts.**
- Adapter `@astrojs/vercel`. Hoy no hay endpoints (`api/contact` se borró el 2026-10-02).
- `src/layouts/Layout.astro`: head (SEO, OG, JSON-LD WebSite/Organization/FAQPage, favicons, GA4 y Clarity solo en `import.meta.env.PROD`).
- `src/config/whatsapp.ts`: número, mensajes, `whatsappUrl()` y `mensajeServicio()`. **Única fuente** del número.
- `src/components/`: Nav, Hero, Marquee, Servicios (+ServicioRow), AntesDespues, Proceso, PorQue, Faq, Contacto, Footer, WhatsAppFloat, WhatsAppIcon. `CasoReal.astro` existe pero **no se importa**.
- `src/scripts/`: cursor, nav, reveal, faq, particles, visibility, analytics (`click_whatsapp`), live-mockups.

Orden de la página: Nav → Hero → Marquee → Servicios (6) → Antes y después → Proceso (5 etapas) → Por qué Zential → FAQ (11) → Contacto → Footer + WhatsApp flotante.

Servicios, en este orden y con id `servicio-*`: Atención IA, Voz, CRM, Cerebro, Automatizaciones, Web.

## Decisiones tomadas (no reabrir sin que el dueño lo pida)
- Todo contacto va a WhatsApp con `whatsappUrl()`. **Nunca `mailto:`** ni formularios.
- Mensajes de WhatsApp formales, **sin "Hola Zential"**.
- Textos formales y profesionales, en tuteo, sin coloquialismos ni frases resaltadas en color.
- No mostrar casos reales hasta tener **3** (hoy hay 1: KICKSSAR).
- No pagar dominio por ahora: se sigue con `zential-site.vercel.app`.
- No mostrar las IAs (ChatGPT, Claude, Gemini) en la cinta de integraciones.
- La "garantía" es una demostración antes de cerrar. **No hay prueba gratis.**
- Descartado: formulario, estadísticas sin fuente, métricas de ejemplo, otra sección de proceso, reordenar servicios por problema, especializarse en un rubro.
- Rendimiento: Lighthouse móvil ≥ 90. GA4/Clarity cargan después de `load` + 2 s; animaciones pausadas fuera de pantalla; respetar `prefers-reduced-motion`.

## Nunca hagas
- Tocar el número de WhatsApp o `whatsapp.ts` sin pedido explícito.
- Borrar `public/1418224b1234474fa1bb09bbcf8a2a13.txt` (clave de IndexNow).
- Publicar a producción (`vercel deploy --prod`) o hacer push a `main`. Eso lo decide el dueño.
- Escribir secretos en archivos del repo o en los jobs.
- Agregar dependencias pesadas o scripts de terceros por CDN.

## Cómo se verifica (definición de "terminado")
1. `npm run verify` pasa (astro check + build + tests smoke de Playwright).
2. Si cambió algo visual: captura en 1280 px y en 375 px, sin scroll horizontal.
3. Todos los `wa.me/` usan el número de `whatsapp.ts` y no hay `mailto:`.
4. Sin errores en la consola.

## Publicar (solo con el OK del dueño)
Ver la sección "Publicar" de `CLAUDE.md`: build, `npx vercel deploy --prod --yes`, IndexNow, verificación en producción. El auto-deploy desde GitHub **no funciona**; se publica por CLI.

## Entorno
Windows + PowerShell 5.1 (no acepta `&&`). El repo está en OneDrive: si el dev server muestra estilos viejos, reiniciarlo. Los worktrees de la factory van en `C:\dev\worktrees\zential-site\`, fuera de OneDrive.

## Registro de decisiones nuevas
Los jobs que cierran agregan acá, con fecha, cualquier decisión nueva que tome el dueño.
