import { defineConfig, devices } from '@playwright/test';

// Corre contra el build (dist/), así que antes hay que hacer `npm run build`.
// `npm run verify` hace todo en orden.
export default defineConfig({
  testDir: 'tests',
  reporter: [['list']],
  use: { baseURL: 'http://localhost:4329' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
    { name: 'mobile', use: { ...devices['Pixel 5'], viewport: { width: 375, height: 812 } } },
  ],
  webServer: {
    command: 'node tests/serve.mjs',
    url: 'http://localhost:4329',
    reuseExistingServer: true,
  },
});
