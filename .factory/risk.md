# Reglas de riesgo: zential-site

Son deterministas: el riesgo de un job es el **más alto** entre las rutas que toca. Un agente no puede bajarlo; solo puede subirlo.

Todo job termina en una rama que aprueba el dueño. El riesgo sirve para decirle **cómo** revisarla.

## Alto: revisá a fondo
- `src/config/whatsapp.ts` (número y mensajes de contacto: si se rompe, no entran clientes)
- `src/layouts/Layout.astro` (SEO, JSON-LD, Analytics, Clarity)
- `astro.config.mjs`, `package.json`, `package-lock.json`, `vercel.json`, `.vercel/`
- `public/robots.txt`, `public/sitemap.xml`, `public/llms.txt`, `public/google*.html`, `public/*.txt`
- `src/pages/` (rutas nuevas o endpoints)
- `src/scripts/analytics.ts`
- `.factory/` y `CLAUDE.md`/`AGENTS.md` (las reglas de la propia factory)
- Cualquier archivo `.env*`: **bloqueado**, la factory no lo toca

## Medio: mirá la captura y el diff
- `src/scripts/` (resto), `src/styles/`
- Componentes nuevos o borrados

## Bajo: revisión rápida
- Textos y estilos dentro de componentes existentes en `src/components/`
- Imágenes en `src/assets/` o `public/` (salvo las de arriba)

## Reglas que lee el script (mantener en sincronía con las listas de arriba)
Una línea por nivel, con globs separados por coma. Lo que no coincide con ninguna regla es `bajo`.

```risk
bloqueado: .env, .env.*
alto: src/config/whatsapp.ts, src/layouts/Layout.astro, astro.config.mjs, package.json, package-lock.json, vercel.json, .vercel/**, public/robots.txt, public/sitemap.xml, public/llms.txt, public/google*.html, public/*.txt, src/pages/**, src/scripts/analytics.ts, .factory/**, CLAUDE.md, AGENTS.md
medio: src/scripts/**, src/styles/**, tests/**, playwright.config.ts
```

## Límites
- Más de 300 líneas cambiadas o más de 8 archivos: sube un nivel.
- Rework: máximo **2** vueltas. A la tercera, el job pasa a `needs_human`.
