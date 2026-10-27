# Job 001: Dejar astro check sin errores

- **Estado:** shipped
- **Riesgo:** medio
- **Rama:** factory/001-dejar-astro-check-sin-errores
- **Creado:** 2026-10-27

## Pedido
Dejar astro check sin errores.

## Spec

### Objetivo
Que `npx astro check` termine con 0 errores (hoy da 6 errores y 4 hints, exit code 1), solo con cambios de tipos, sin alterar nada visible ni el comportamiento en runtime: mismo HTML y mismos scripts generados.

### Diagnóstico (salida de `npx astro check` en `main`, 2026-10-27)
| # | Archivo:línea | Error | Causa |
|---|---|---|---|
| 1-2 | `src/components/CasoReal.astro:59` y `:60` | ts(2339) `texto` / `autor` no existe en `never` | `const testimonio: { texto: string; autor: string } \| null = null;` (línea 13): TS estrecha la constante a `null` por el valor inicial, así que dentro de `{testimonio && (...)}` el tipo queda `never`. |
| 3-4 | `src/components/Nav.astro:65` (col. 32 y 117) | ts(2339) `desc` no existe en la unión | `navItems` se infiere sin tipo: los subítems de "Servicios" tienen `desc` y los de "Proceso" no, y TS no deja leer `sub.desc` sobre la unión. |
| 5-6 | `src/scripts/faq.ts:1` y `src/scripts/reveal.ts:1` | ts(2451) Cannot redeclare block-scoped variable `items` | Ninguno de los dos archivos tiene `import`/`export`, así que TS los trata como scripts globales y los dos `const items` chocan. |

Cómo se cargan los scripts (verificado): `faq.ts` se incluye con `<script src="../scripts/faq.ts"></script>` en `src/components/Faq.astro:60` y `reveal.ts` con `<script src="../scripts/reveal.ts"></script>` en `src/layouts/Layout.astro:163`. Son scripts procesados por Astro (sin `is:inline`): Vite los empaqueta y en `dist/index.html` salen inline como `<script type="module">…</script>`, cada uno en su propio scope de módulo. `src/scripts/analytics.ts` ya termina en `export {};` y su salida en `dist/index.html` no contiene ningún `export` (0 coincidencias de `export {` en el HTML). Por eso agregar `export {};` no cambia el JS generado; en runtime ya eran módulos.

### Cambios
- `src/scripts/faq.ts`: agregar al final `export {};` con un comentario de una línea que explique por qué (es un módulo para TS, igual que `analytics.ts`). No renombrar variables ni tocar la lógica.
- `src/scripts/reveal.ts`: lo mismo, `export {};` al final con el mismo comentario. No renombrar variables ni tocar la lógica.
- `src/components/Nav.astro` (solo el frontmatter): tipar `navItems` para que todos los subítems tengan `desc` opcional. Por ejemplo, declarar un tipo de subítem `{ icon: typeof MessageCircle; label: string; href: string; desc?: string }` y un tipo de ítem `{ label: string; href: string; width?: string; items?: SubItem[] }`, y anotar `const navItems: NavItem[] = [...]`. No cambiar ningún valor, texto, orden, ícono ni el template (las líneas 41-125 quedan iguales).
- `src/components/CasoReal.astro` (solo la línea 13): evitar el estrechamiento a `null` sin cambiar el valor, por ejemplo `const testimonio = null as { texto: string; autor: string } | null;`. El valor sigue siendo `null` y el bloque `{testimonio && (...)}` queda igual, listo para cuando llegue la frase del cliente. **No** importar `CasoReal` en `index.astro` (Brain: no mostrar casos reales hasta tener 3).

No hay textos visibles nuevos ni modificados.

### Criterios de aceptación
- [ ] C1: `npx astro check` termina con exit code 0 y `Result: 0 errors`. Los 4 hints de íconos deprecated (`Code2`, `BarChart2`) pueden seguir; no fallan el comando.
- [ ] C2: `npm run verify` pasa (astro check + build + los 5 tests smoke de `tests/smoke.spec.ts` sin cambios), más los tests nuevos de C4.
- [ ] C3 (sin cambios visibles ni de runtime): antes de tocar código, el builder corre `npx astro build` sobre la base de la rama y copia `dist/index.html` y el listado de `dist/_astro/` a una carpeta fuera del repo. Después del cambio vuelve a hacer build y compara: `git diff --no-index --stat <copia>/index.html dist/index.html` no muestra diferencias, y el listado de `dist/_astro/` es el mismo. Se espera que sea idéntico byte a byte, porque los cambios son solo de tipos y el JS de los scripts sale inline. Si difiere algo, solo se acepta en hashes de nombres de assets; cualquier otra diferencia es un fallo y hay que explicarla en `## Resultado`.
- [ ] C4: los tests de comportamiento de `tests/jobs/001-dejar-astro-check-sin-errores.spec.ts` (ver abajo) pasan antes y después del cambio, en los dos proyectos de `playwright.config.ts` (desktop 1280 y mobile 375).
- [ ] C5: el diff toca solo los 4 archivos de "Cambios" más el test nuevo. `git diff --stat` lo muestra; en `Nav.astro` y `CasoReal.astro` solo cambian líneas del frontmatter (entre los `---`).
- [ ] C6: `CasoReal` sigue sin importarse: `Grep "CasoReal" src/pages` devuelve 0 resultados.

### Tests a escribir primero (TDD)
- El test que hoy falla es el comando: `npx astro check` (hoy da 6 errores y exit code 1; tiene que dar 0).
- `tests/jobs/001-dejar-astro-check-sin-errores.spec.ts` (Playwright; `testDir: 'tests'` ya lo incluye y corre contra el build de `dist/`). Son tests de no regresión: hoy pasan y tienen que seguir pasando. Sirven para comprobar que `export {}` no cambia el comportamiento de los scripts:
  - **FAQ (faq.ts):** en `/`, hacer clic en el primer `.faq-toggle`: su `.faq-item` tiene la clase `open` y el botón `aria-expanded="true"`. Clic en el segundo: el primero pierde `open` y queda con `aria-expanded="false"`, el segundo queda abierto. Clic otra vez en el segundo: se cierra.
  - **Reveal (reveal.ts):** en `/`, hacer scroll hasta `#faq`. El `.reveal` del encabezado de `#faq` termina con la clase `in-view` (con `expect(...).toHaveClass(/in-view/)`, que reintenta).
  - **Nav (desc):** solo en el proyecto `desktop` (en `mobile` va con `test.skip`, porque ahí el menú no muestra descripciones), el dropdown de "Servicios" renderiza 6 links y cada uno tiene su descripción (por ejemplo, el texto "Asistente que atiende tus llamadas"). Los 5 links de "Proceso" no tienen el `span.text-xs` de descripción.

### Fuera de alcance
- Los 4 hints de íconos deprecated de Lucide (`Code2` en `Nav.astro`, `BarChart2` en `Servicios.astro`). Propuesta: un job aparte, "Reemplazar íconos deprecated de Lucide", que cambie cada uno por el reemplazo que indica Lucide y verifique con captura que el SVG se ve igual.
- Renombrar variables o refactorizar `faq.ts`, `reveal.ts` u otros scripts.
- Cualquier cambio en el template o el contenido de `Nav.astro` o `CasoReal.astro`, y mostrar `CasoReal` en la página.
- `tsconfig.json`, `package.json` y la config de `astro check`, como `--minimumFailingSeverity` (riesgo alto, y no hace falta).
- `Layout.astro` (riesgo alto): no se toca. Solo se leyó para ver cómo se carga `reveal.ts`.

### Riesgo esperado
**medio.** El riesgo lo fija la ruta más alta del diff: `src/scripts/faq.ts`, `src/scripts/reveal.ts` y `tests/**` son medio, y `src/components/Nav.astro` y `CasoReal.astro` (componentes existentes) son bajo. Son 5 archivos y menos de 50 líneas, así que no sube por tamaño. No toca ninguna ruta alta. Para revisarlo alcanza con el diff y el resultado de C3 (HTML idéntico). No hace falta captura, porque no hay cambio visual.

### Preguntas para el dueño
- Ninguna. (Opcional: confirmar si querés que el job de los íconos deprecated entre al backlog.)

## Revisiones
### Vuelta 1
- **Gate determinista (orquestador):** `npm run verify` en el worktree, exit 0: 0 errores y 15 passed + 1 skipped. El HTML de la rama es idéntico byte a byte al build de `main` en limpio (baseline del builder).
- **factory-reviewer-code:** APROBADO.
  - [menor] `faq.ts:17` y `reveal.ts:13`: falta una línea en blanco antes del comentario y el `export {};`, como en `analytics.ts`. No bloquea; queda como está.
- **Approver:** aprobado sin rework.
- **Hallazgo aparte (no es de este job):** Tailwind v4 lee los archivos no ignorados del repo, incluidos los de `.factory/`. Un `.md` de job sin commitear agregó una clase `.inline` al CSS del build del checkout principal. Se propone un job nuevo (`@source not` para `.factory` y `tests`).

## Resultado
- `astro check` pasa de 6 errores a 0. Son cambios solo de tipos en `faq.ts`, `reveal.ts`, `Nav.astro` (frontmatter) y `CasoReal.astro` (línea 13), más un test de no regresión (FAQ, reveal y descripciones del menú).
- No hay cambios visibles: el HTML y los assets del build son idénticos a los de `main`.
- Riesgo: **medio** (`src/scripts/**` y `tests/**`). Para revisarlo alcanza con el diff; no hay captura porque no hay cambio visual.
- Medición del piloto:
  - el dueño intervino 2 veces (aprobó la spec y el build);
  - 0 vueltas de rework;
  - el builder ajustó su propio test de Reveal antes de entregar.

## Log
- 2026-10-27 15:50 estado=spec_ready
- 2026-10-27 15:52 estado=approved
- 2026-10-27 15:52 worktree C:/dev/worktrees/zential-site/001-dejar-astro-check-sin-errores
- 2026-10-27 15:52 estado=building
- 2026-10-27 16:03 estado=reviewing
- 2026-10-27 16:05 riesgo medio
- 2026-10-27 16:05 estado=ready
- 2026-10-27 16:10 estado=shipped
- 2026-10-27 16:10 worktree eliminado
