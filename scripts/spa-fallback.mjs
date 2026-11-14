#!/usr/bin/env node
/**
 * GitHub Pages serves static files and nothing else. Two kinds of copies of
 * index.html let the app open on any of its addresses:
 *
 * - `<route>.html` for each page of src/app.routes.ts: Pages serves
 *   /Judo-Master/tecnicas from tecnicas.html, with status 200, so the page can
 *   be indexed (a 404 would keep it out of search results).
 * - `404.html` for any other address: the app boots and its router decides.
 *
 * Runs after `npm run build` (postbuild).
 */
import { copyFileSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const index = join(DIST, 'index.html');
if (!existsSync(index)) {
  console.error(`${index} not found: run the build first.`);
  process.exit(1);
}

/** The top-level paths of the app's routes, read from its source: nothing to keep in sync. */
const routes = [...readFileSync('src/app.routes.ts', 'utf8').matchAll(/path:\s*'([^']+)'/g)]
  .map(match => match[1])
  .filter(path => path !== '**' && !path.includes('/') && !path.includes(':'));

for (const route of routes) copyFileSync(index, join(DIST, `${route}.html`));
copyFileSync(index, join(DIST, '404.html'));
const written = [...routes.map(route => 'dist/' + route + '.html'), 'dist/404.html'];
console.log(`✅ ${written.join(', ')}: the app opens on any of its addresses.`);
