#!/usr/bin/env node
/**
 * Checks the JavaScript in dist/: what loads at startup must stay small (the
 * Excel and PDF libraries are lazy chunks, loaded on the first download), and
 * the total must not creep up unnoticed. Run after `npm run build`.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, sep } from 'node:path';

const DIST = 'dist';
const MAX_INITIAL_KB = 400; // main + polyfills, raw
const MAX_TOTAL_MB = 2;

const files = [];
function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full);
      continue;
    }
    // Angular's service worker scripts are not app bundles.
    const worker = /^(ngsw-worker|safety-worker|worker-basic\.min)\.js$/.test(entry);
    if (extname(entry) === '.js' && !worker && !full.split(sep).includes('assets')) {
      files.push({ name: entry, size: statSync(full).size });
    }
  }
}

try {
  walk(DIST);
} catch {
  console.error(`❌ '${DIST}' not found. Run 'npm run build' first.`);
  process.exit(1);
}

// Initial chunks are the scripts index.html loads directly.
const index = readFileSync(join(DIST, 'index.html'), 'utf8');
const initialNames = new Set([...index.matchAll(/<script src="([^"]+\.js)"/g)].map(m => m[1]));
const initialKb =
  files.filter(f => initialNames.has(f.name)).reduce((sum, f) => sum + f.size, 0) / 1024;
const totalMb = files.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024;

files.sort((a, b) => b.size - a.size);
console.log('\n📦 Bundle size');
console.log('─'.repeat(56));
for (const { name, size } of files.slice(0, 8)) {
  const tag = initialNames.has(name) ? ' (initial)' : '';
  console.log(`  ${(size / 1024).toFixed(1).padStart(8)} KB  ${name}${tag}`);
}
console.log('─'.repeat(56));
console.log(`  Initial JS: ${initialKb.toFixed(1)} KB  (limit ${MAX_INITIAL_KB} KB)`);
console.log(`  Total JS:   ${totalMb.toFixed(2)} MB  (limit ${MAX_TOTAL_MB} MB)`);

let failed = false;
if (initialNames.size === 0) {
  console.error('\n❌ No <script> found in dist/index.html.');
  failed = true;
}
if (initialKb > MAX_INITIAL_KB) {
  console.error(
    `\n❌ Initial JS of ${initialKb.toFixed(1)} KB exceeds ${MAX_INITIAL_KB} KB. Lazy-load what startup does not need.`
  );
  failed = true;
}
if (totalMb > MAX_TOTAL_MB) {
  console.error(`\n❌ Total JS of ${totalMb.toFixed(2)} MB exceeds ${MAX_TOTAL_MB} MB.`);
  failed = true;
}
if (failed) process.exit(1);
console.log('\n✅ Bundle size OK.\n');
