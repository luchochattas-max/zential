# Zential — sitio web

Landing de una sola página de **Zential**, agencia de implementación de inteligencia artificial para negocios.

- **Producción:** https://zential-site.vercel.app
- **Historial completo de decisiones y pendientes:** [`../historial-de-cambios.md`](../historial-de-cambios.md). Empezar por la sección "ESTADO ACTUAL".

## Stack

- **Astro 7** + **Tailwind v4** (compilado en build, vía `@tailwindcss/vite`).
- **`@lucide/astro`** para íconos (SVG inline, sin JS en el cliente).
- **`astro:assets`** para optimizar imágenes a WebP.
- **`@astrojs/vercel`** como adapter. Hoy no hay rutas de servidor: el formulario y `api/contact` se eliminaron cuando el contacto pasó a WhatsApp.

## Estructura

```text
src/
  layouts/Layout.astro    # <head>: SEO, Open Graph, datos estructurados, favicons, Google Analytics (solo prod)
  config/whatsapp.ts      # número de WhatsApp, mensajes predefinidos, whatsappUrl() y mensajeServicio()
  components/
    Nav, Hero, Marquee, Proceso, Servicios, ServicioRow, PorQue, Faq, Contacto, Footer,
    WhatsAppFloat (botón flotante), WhatsAppIcon (logo SVG)
  scripts/                # cursor, nav, reveal, faq, particles, visibility, analytics (evento click_whatsapp)
  styles/global.css       # tokens de marca y CSS propio
  assets/                 # logos fuente e imagen de Automatización
public/                   # robots.txt, sitemap.xml, verificación de Google, favicons, og-image.png
```

## Cómo cambiar cosas comunes

| Quiero cambiar… | Dónde |
| :-- | :-- |
| El número de WhatsApp o los mensajes predefinidos | `src/config/whatsapp.ts` |
| Los servicios (textos, orden, imágenes) | `src/components/Servicios.astro` (cada fila usa `ServicioRow.astro`) |
| El menú de arriba | `navItems` en `src/components/Nav.astro` |
| El título y la descripción para Google | `src/layouts/Layout.astro` |
| Los colores de marca | `src/styles/global.css` (`@theme`) |

Reglas de contenido:
- Todo botón de contacto o "Consultar por…" va a WhatsApp con `whatsappUrl()`. No se usa mail.
- Los textos van en tono formal y profesional.

## Comandos

Se corren desde esta carpeta (`zential-site/`). La terminal de la computadora es PowerShell 5.1, que no acepta `&&`: correr los comandos de a uno.

| Comando | Qué hace |
| :-- | :-- |
| `npm install` | Instala las dependencias |
| `npm run dev` | Servidor local en `http://localhost:4321` |
| `npm run build` | Compila el sitio de producción |
| `npx vercel deploy --prod --yes` | Publica en zential-site.vercel.app (la CLI ya tiene sesión iniciada) |

Google Analytics (`G-TQ8C647ES5`) solo se carga en el build de producción, así las pruebas locales no se cuentan.
