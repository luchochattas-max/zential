# Backlog: zential-site

Estados: `intake` → `spec_ready` → `approved` → `building` → `reviewing` → `ready` | `needs_human` → `shipped` | `cancelled`

| ID | Título | Estado | Riesgo | Rework | Rama | Actualizado |
|---|---|---|---|---|---|---|
| 001 | Dejar astro check sin errores | shipped | medio | 0 | factory/001-dejar-astro-check-sin-errores | 2026-10-27 |

## Ideas sacadas del historial (no son jobs hasta que el dueño las apruebe)
- Acortar la meta description a 160 caracteres o menos (Bing marca unos 230).
- Sacar la dependencia `resend`, que ya no se usa.
- Links de Privacidad y Términos del footer: hoy apuntan a `#` (falta el contenido legal, lo decide el dueño).
- Diagnóstico guiado por WhatsApp.
- Franja "Para qué rubros".
- Excluir `.factory/` y `tests/` del escaneo de Tailwind (`@source not` en `global.css`): hoy los markdown de los jobs pueden meter clases en el CSS de producción (hallazgo del job 001).
- Reemplazar íconos deprecated de Lucide (`Code2`, `BarChart2`), con captura.
