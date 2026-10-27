// Tests smoke: lo mínimo que tiene que seguir funcionando después de cualquier cambio.
// Las reglas salen de .factory/brain.md (contacto solo por WhatsApp, 6 servicios, sin errores).
import { test, expect } from '@playwright/test';
import { WHATSAPP_NUMBER } from '../src/config/whatsapp';

test('la página carga sin errores de consola', async ({ page }) => {
  const errores: string[] = [];
  page.on('pageerror', (e) => errores.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errores.push(m.text()));

  const res = await page.goto('/');
  expect(res?.status()).toBe(200);
  await expect(page.locator('h1')).toContainText('Implementamos inteligencia artificial en tu negocio');
  await page.waitForLoadState('networkidle');
  expect(errores).toEqual([]);
});

test('todo el contacto va a WhatsApp con el número de whatsapp.ts', async ({ page }) => {
  await page.goto('/');
  const links = await page.locator('a[href*="wa.me/"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')!));
  expect(links.length).toBeGreaterThan(0);
  for (const href of links) {
    expect(href).toContain(`wa.me/${WHATSAPP_NUMBER}?text=`);
    expect(decodeURIComponent(href)).not.toMatch(/hola zential/i);
  }
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
  await expect(page.locator('form')).toHaveCount(0);
});

test('están los 6 servicios en orden', async ({ page }) => {
  await page.goto('/');
  const ids = await page.locator('[id^="servicio-"]').evaluateAll((els) => els.map((e) => e.id));
  expect(ids).toHaveLength(6);
});

test('no hay scroll horizontal', async ({ page }) => {
  await page.goto('/');
  const sobra = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(sobra).toBeLessThanOrEqual(0);
});

test('los archivos de SEO responden', async ({ request }) => {
  for (const path of ['/robots.txt', '/sitemap.xml', '/llms.txt', '/1418224b1234474fa1bb09bbcf8a2a13.txt']) {
    expect((await request.get(path)).status(), path).toBe(200);
  }
});
