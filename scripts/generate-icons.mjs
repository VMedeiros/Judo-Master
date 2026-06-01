/**
 * Generate PNG icons from SVG for all platforms (Android, iOS, Web/PWA).
 * Uses sharp to render SVG → PNG at various sizes.
 */
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const ICONS_DIR = join(import.meta.dirname, "..", "src", "assets", "icons");

// SVG source at 512x512 for max quality rendering — light theme (blue bg, dark symbol)
const svgSource = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0ea5e9"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="96" ry="96" fill="url(#bg-grad)"/>
  <text x="256" y="256" font-family="Noto Sans JP, sans-serif" font-size="280" font-weight="700" fill="#102a43" text-anchor="middle" dominant-baseline="central">柔</text>
</svg>`;

// Dark theme SVG — dark bg, light symbol
const darkSvgSource = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e3a5f"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="96" ry="96" fill="url(#bg-grad)"/>
  <text x="256" y="256" font-family="Noto Sans JP, sans-serif" font-size="280" font-weight="700" fill="#7dd3fc" text-anchor="middle" dominant-baseline="central">柔</text>
</svg>`;

// Maskable icon has extra padding (safe zone = 80% center) — light theme
function createMaskableSvg(size) {
  const padding = Math.round(size * 0.1); // 10% padding each side
  const innerSize = size - padding * 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#0ea5e9"/>
  <svg x="${padding}" y="${padding}" width="${innerSize}" height="${innerSize}" viewBox="0 0 512 512">
    <defs>
      <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0ea5e9"/>
        <stop offset="100%" stop-color="#0284c7"/>
      </linearGradient>
    </defs>
    <rect width="512" height="512" rx="96" ry="96" fill="url(#bg-grad)"/>
    <text x="256" y="256" font-family="Noto Sans JP, sans-serif" font-size="280" font-weight="700" fill="#102a43" text-anchor="middle" dominant-baseline="central">柔</text>
  </svg>
</svg>`;
}

// Maskable icon — dark theme
function createDarkMaskableSvg(size) {
  const padding = Math.round(size * 0.1);
  const innerSize = size - padding * 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#0f172a"/>
  <svg x="${padding}" y="${padding}" width="${innerSize}" height="${innerSize}" viewBox="0 0 512 512">
    <defs>
      <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a"/>
        <stop offset="100%" stop-color="#1e3a5f"/>
      </linearGradient>
    </defs>
    <rect width="512" height="512" rx="96" ry="96" fill="url(#bg-grad)"/>
    <text x="256" y="256" font-family="Noto Sans JP, sans-serif" font-size="280" font-weight="700" fill="#7dd3fc" text-anchor="middle" dominant-baseline="central">柔</text>
  </svg>
</svg>`;
}

// All sizes needed across platforms
const sizes = {
  // Android (PWA / Chrome)
  android: [36, 48, 72, 96, 128, 144, 192, 256, 384, 512],
  // iOS (Apple Touch Icons)
  ios: [57, 60, 72, 76, 114, 120, 144, 152, 167, 180, 1024],
  // Web / PWA / Favicon
  web: [16, 32, 48, 64, 96, 128, 192, 256, 384, 512],
};

// Deduplicate all sizes
const allSizes = [
  ...new Set([...sizes.android, ...sizes.ios, ...sizes.web]),
].sort((a, b) => a - b);

mkdirSync(ICONS_DIR, { recursive: true });

const svgBuffer = Buffer.from(svgSource);
const darkSvgBuffer = Buffer.from(darkSvgSource);

console.log(`Generating ${allSizes.length} icon sizes (light + dark)...`);

for (const size of allSizes) {
  const pngPath = join(ICONS_DIR, `icon-${size}x${size}.png`);
  await sharp(svgBuffer)
    .resize(size, size)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(pngPath);
  console.log(`  ✓ ${size}x${size}.png`);

  const darkPngPath = join(ICONS_DIR, `icon-${size}x${size}-dark.png`);
  await sharp(darkSvgBuffer)
    .resize(size, size)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(darkPngPath);
  console.log(`  ✓ ${size}x${size}-dark.png`);
}

// Generate maskable icons for Android (separate files)
const maskableSizes = [192, 512];
for (const size of maskableSizes) {
  const maskSvg = Buffer.from(createMaskableSvg(size));
  const pngPath = join(ICONS_DIR, `icon-${size}x${size}-maskable.png`);
  await sharp(maskSvg)
    .resize(size, size)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(pngPath);
  console.log(`  ✓ ${size}x${size}-maskable.png`);

  const darkMaskSvg = Buffer.from(createDarkMaskableSvg(size));
  const darkMaskPath = join(
    ICONS_DIR,
    `icon-${size}x${size}-maskable-dark.png`,
  );
  await sharp(darkMaskSvg)
    .resize(size, size)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(darkMaskPath);
  console.log(`  ✓ ${size}x${size}-maskable-dark.png`);
}

// Generate Apple Touch Icon (180x180 is the standard)
const appleTouchPath = join(ICONS_DIR, "..", "apple-touch-icon.png");
await sharp(svgBuffer)
  .resize(180, 180)
  .png({ quality: 100, compressionLevel: 9 })
  .toFile(appleTouchPath);
console.log(`  ✓ apple-touch-icon.png (180x180)`);

// Generate favicon.ico equivalent as 32x32 PNG
const faviconPath = join(ICONS_DIR, "..", "favicon-32x32.png");
await sharp(svgBuffer)
  .resize(32, 32)
  .png({ quality: 100, compressionLevel: 9 })
  .toFile(faviconPath);
console.log(`  ✓ favicon-32x32.png`);

const favicon16Path = join(ICONS_DIR, "..", "favicon-16x16.png");
await sharp(svgBuffer)
  .resize(16, 16)
  .png({ quality: 100, compressionLevel: 9 })
  .toFile(favicon16Path);
console.log(`  ✓ favicon-16x16.png`);

console.log("\n✅ All icons generated successfully!");
