#!/usr/bin/env node
/**
 * The Material Symbols font is requested from Google Fonts with only the
 * icons the app uses (`icon_names=` in index.html). An icon used in a
 * template but missing from that list renders as its name in plain text.
 * This check fails when the two drift apart.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const INDEX = 'index.html';
const SRC = 'src';

/** Icon names chosen at runtime, so they never sit next to the class in a template. */
const DYNAMIC_ICON_PATTERNS = [
  /\bicon="([a-z0-9_]+)"/g, // <app-confirm-modal icon="restart_alt">
  /icon = input\('([a-z0-9_]+)'\)/g, // default of an `icon` input
  /\?\s*'([a-z0-9_]+)'\s*:\s*'([a-z0-9_]+)'\s*\}\}\s*<\/span/g, // {{ cond ? 'a' : 'b' }}</span>
  /(?:success|error|info): '([a-z0-9_]+)'/g, // toast icon map
];

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, files);
    else if (/\.(html|ts)$/.test(entry) && !entry.endsWith('.spec.ts')) files.push(full);
  }
  return files;
}

const index = readFileSync(INDEX, 'utf8');
const requested = /icon_names=([a-z0-9_,]+)/.exec(index)?.[1].split(',');
if (!requested) {
  console.error(`❌ No icon_names=... list found in ${INDEX}`);
  process.exit(1);
}

const used = new Set();
for (const file of walk(SRC)) {
  const text = readFileSync(file, 'utf8');
  // Literal icon: <span class="material-symbols-rounded ...">name</span>, across lines.
  for (const m of text.matchAll(/material-symbols-rounded[^>]*>\s*([a-z0-9_]+)\s*</g))
    used.add(m[1]);
  for (const pattern of DYNAMIC_ICON_PATTERNS) {
    for (const m of text.matchAll(pattern))
      m.slice(1)
        .filter(Boolean)
        .forEach(n => used.add(n));
  }
}

const missing = [...used].filter(name => !requested.includes(name)).sort();
const unused = requested.filter(name => !used.has(name));
const sorted = [...requested].sort();
const isSorted = requested.every((name, i) => name === sorted[i]);

if (missing.length > 0) {
  console.error(`❌ Icons used but not requested in ${INDEX}: ${missing.join(', ')}`);
}
if (!isSorted) {
  // Google Fonts rejects an icon_names list that is not in alphabetical order.
  console.error(`❌ icon_names in ${INDEX} must be sorted alphabetically.`);
}
if (unused.length > 0) {
  console.warn(`⚠️  Requested but not used (safe to remove): ${unused.join(', ')}`);
}
if (missing.length > 0 || !isSorted) process.exit(1);

console.log(`✅ ${requested.length} icons requested, all ${used.size} used icons covered.`);
