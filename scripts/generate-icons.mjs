/**
 * Generates the PNG icons for every platform (Android, iOS, web/PWA) from the
 * app icon artwork, which is JudoKan's own (src/assets/icons/icon-app-light.svg
 * and icon-app-dark.svg, copied from JudoKan's assets/icons): both apps show
 * the same icon. Keep the two copies identical.
 *
 * Rendered by Chromium (Playwright, already a dev dependency) so the kanji is
 * drawn exactly as a browser draws the SVG, with the same font.
 *
 *   npm run icons
 */
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ASSETS = join(import.meta.dirname, '..', 'src', 'assets');
const ICONS = join(ASSETS, 'icons');
const svg = theme => readFileSync(join(ICONS, `icon-app-${theme}.svg`), 'utf8');

/** Square background for the maskable icons: the artwork's own first colour. */
const MASK_BACKGROUND = { light: '#0ea5e9', dark: '#0f172a' };

const SIZES = [
  ...new Set([
    // Android (PWA / Chrome)
    36, 48, 72, 96, 128, 144, 192, 256, 384, 512,
    // iOS (Apple touch icons)
    57, 60, 76, 114, 120, 152, 167, 180, 1024,
    // Web / favicons
    16, 32, 64,
  ]),
].sort((a, b) => a - b);

const browser = await chromium.launch();
const page = await browser.newPage();

/** Renders the artwork at `size` px; `maskable` keeps it inside the 80% safe zone. */
async function render(theme, size, path, maskable = false) {
  const inner = maskable ? Math.round(size * 0.8) : size;
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(
    `<html><body style="margin:0;width:${size}px;height:${size}px;display:grid;place-items:center;` +
      `background:${maskable ? MASK_BACKGROUND[theme] : 'transparent'}">` +
      `<img src="data:image/svg+xml;base64,${Buffer.from(svg(theme)).toString('base64')}" ` +
      `width="${inner}" height="${inner}"></body></html>`
  );
  await page.locator('img').evaluate(img => img.decode());
  await page.screenshot({ path, omitBackground: !maskable });
}

// One after the other: a single page renders them all.
const jobs = [
  ...SIZES.flatMap(size => [
    ['light', size, join(ICONS, `icon-${size}x${size}.png`)],
    ['dark', size, join(ICONS, `icon-${size}x${size}-dark.png`)],
  ]),
  ...[192, 512].flatMap(size => [
    ['light', size, join(ICONS, `icon-${size}x${size}-maskable.png`), true],
    ['dark', size, join(ICONS, `icon-${size}x${size}-maskable-dark.png`), true],
  ]),
  ['light', 180, join(ASSETS, 'apple-touch-icon.png')],
  ['light', 32, join(ASSETS, 'favicon-32x32.png')],
  ['light', 16, join(ASSETS, 'favicon-16x16.png')],
];
await jobs.reduce((previous, job) => previous.then(() => render(...job)), Promise.resolve());

await browser.close();
console.log(`✅ ${jobs.length} icons generated from JudoKan's artwork.`);
