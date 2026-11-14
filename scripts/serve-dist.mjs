#!/usr/bin/env node
/**
 * Serves the production build the way GitHub Pages does, so Lighthouse
 * (scripts/lighthouse-check.mjs) measures what a visitor gets:
 *
 * - under /Judo-Master/ (the base href); the root redirects there, other
 *   paths outside it answer 404;
 * - a file, else `<path>.html`, else `<path>/index.html`;
 * - otherwise 404.html, with status 404;
 * - compressed with gzip, as Pages does.
 *
 *   node scripts/serve-dist.mjs [port]
 */
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { gzipSync } from 'node:zlib';

const ROOT = normalize('dist');
const BASE = '/Judo-Master/';
const PORT = Number(process.argv[2] ?? 4420);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
};
const COMPRESSIBLE = /^(?:text\/[a-z]+|application\/(?:json|xml|manifest\+json)|image\/svg\+xml)$/;

/** A file inside the build, or null: never outside it. */
function fileAt(relative) {
  const file = normalize(join(ROOT, relative));
  return file.startsWith(ROOT) && existsSync(file) && statSync(file).isFile() ? file : null;
}

createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  // Outside the project, as on vmedeiros.github.io: the root redirects to the
  // app, anything else (robots.txt, say) is not this project's to serve.
  if (!path.startsWith(BASE)) {
    res.writeHead(path === '/' ? 302 : 404, path === '/' ? { Location: BASE } : {});
    res.end();
    return;
  }
  const relative = path.slice(BASE.length);
  let file = fileAt(relative) ?? fileAt(`${relative}.html`) ?? fileAt(join(relative, 'index.html'));
  if (file === null) {
    res.statusCode = 404;
    file = join(ROOT, '404.html');
  }
  const type = TYPES[extname(file)] ?? 'application/octet-stream';
  res.setHeader('Content-Type', type);
  const body = readFileSync(file);
  if (
    COMPRESSIBLE.test(type.split(';')[0]) &&
    /\bgzip\b/.test(req.headers['accept-encoding'] ?? '')
  ) {
    res.setHeader('Content-Encoding', 'gzip');
    res.setHeader('Vary', 'Accept-Encoding');
    res.end(gzipSync(body));
    return;
  }
  res.end(body);
}).listen(PORT, '127.0.0.1', () =>
  console.log(`serving ${ROOT} on http://localhost:${PORT}${BASE}`)
);
