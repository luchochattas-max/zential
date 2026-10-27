// Job 001: tests de no regresión. Comprueban que agregar `export {}` a faq.ts y reveal.ts
// y tipar `navItems` en Nav.astro no cambian el comportamiento en runtime.
import { test, expect } from '@playwright/test';

test('FAQ: abre y cierra los ítems con un solo ítem abierto a la vez', async ({ page }) => {
  await page.goto('/');
  const toggles = page.locator('#faq .faq-toggle');
  const primero = page.locator('#faq .faq-item').nth(0);
  const segundo = page.locator('#faq .faq-item').nth(1);

  await toggles.nth(0).click();
  await expect(primero).toHaveClass(/open/);
  await expect(toggles.nth(0)).toHaveAttribute('aria-expanded', 'true');

  await toggles.nth(1).click();
  await expect(primero).not.toHaveClass(/open/);
  await expect(toggles.nth(0)).toHaveAttribute('aria-expanded', 'false');
  await expect(segundo).toHaveClass(/open/);
  await expect(toggles.nth(1)).toHaveAttribute('aria-expanded', 'true');

  await toggles.nth(1).click();
  await expect(segundo).not.toHaveClass(/open/);
  await expect(toggles.nth(1)).toHaveAttribute('aria-expanded', 'false');
});

test('Reveal: el encabezado de #faq recibe in-view al hacer scroll', async ({ page }) => {
  await page.goto('/');
  const encabezado = page.locator('#faq .reveal').first();
  await expect(encabezado).not.toHaveClass(/in-view/);
  // #faq es más alto que la pantalla: se hace scroll hasta el encabezado, no hasta el centro de la sección.
  await encabezado.scrollIntoViewIfNeeded();
  await expect(encabezado).toHaveClass(/in-view/);
});

test('Nav: los subítems de Servicios tienen descripción y los de Proceso no', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'en mobile el menú no muestra descripciones');
  await page.goto('/');
  const dropdowns = page.locator('#navbar .nav-dropdown');

  const servicios = dropdowns.nth(0).locator('a');
  await expect(servicios).toHaveCount(6);
  for (const link of await servicios.all()) {
    await expect(link.locator('span.text-xs')).toHaveCount(1);
    await expect(link.locator('span.text-xs')).not.toHaveText('');
  }
  await expect(dropdowns.nth(0)).toContainText('Asistente que atiende tus llamadas');

  const proceso = dropdowns.nth(1).locator('a');
  await expect(proceso).toHaveCount(5);
  for (const link of await proceso.all()) {
    await expect(link.locator('span.text-xs')).toHaveCount(0);
  }
});
