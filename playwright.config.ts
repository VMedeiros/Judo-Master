import { defineConfig, devices } from '@playwright/test';

/**
 * End-to-end tests against the development server. `npm run test:e2e` starts
 * it on its own port, so a running `npm start` (port 3000) is never reused.
 */
export default defineConfig({
  testDir: './e2e',
  // *.e2e.ts (not *.spec.ts) so Angular's Karma builder, which picks up every
  // **/*.spec.ts, never bundles these Node-only specs into the unit tests.
  testMatch: '**/*.e2e.ts',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 1 : 0,
  reporter: process.env['CI'] ? [['html', { open: 'never' }], ['github']] : 'list',
  use: {
    baseURL: 'http://localhost:3100',
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'npx ng serve --port 3100',
    url: 'http://localhost:3100',
    reuseExistingServer: !process.env['CI'],
    timeout: 180_000,
  },
});
