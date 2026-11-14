#!/usr/bin/env node
/**
 * Checks the seed data in src/core/data/belts.data.ts: unique ids, required text,
 * images that exist and demonstration links the player can actually open.
 * A link the app cannot parse shows "não disponível" instead of the video.
 */

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const DATA = 'src/core/data/belts.data.ts';
const USER_ID_START = 100_000; // USER_TECHNIQUE_ID_START in src/core/constants/app.constants.ts
const LIMITS = { name: 120, translation: 120, description: 500, execution: 1000, application: 500 };
const REQUIRED = ['name', 'description', 'category'];
// Same rules as src/shared/utils/youtube.util.ts.
const VIDEO_ID = /^[\w-]{11}$/;
const ID_PATHS = new Set(['shorts', 'embed', 'live', 'v']);

function youTubeVideoId(raw) {
  let url;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  const segments = url.pathname.split('/').filter(Boolean);
  let id = null;
  if (url.hostname === 'youtu.be') id = segments[0] ?? null;
  else if (['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(url.hostname)) {
    if (segments[0] === 'watch') id = url.searchParams.get('v');
    else if (segments.length >= 2 && ID_PATHS.has(segments[0])) id = segments[1];
  }
  return id && VIDEO_ID.test(id) ? id : null;
}

const source = readFileSync(DATA, 'utf8');
const start = source.indexOf('= [') + 2;
const belts = JSON.parse(source.slice(start, source.lastIndexOf(']') + 1));

const errors = [];
const beltIds = new Set();
const techniqueIds = new Set();
let techniques = 0;
let videos = 0;

for (const belt of belts) {
  const where = `belt ${belt.id} (${belt.name})`;
  if (beltIds.has(belt.id)) errors.push(`${where}: duplicate belt id`);
  beltIds.add(belt.id);
  for (const field of ['name', 'color', 'ageGroup', 'prerequisites', 'information', 'beltImage']) {
    if (typeof belt[field] !== 'string' || !belt[field].trim())
      errors.push(`${where}: missing ${field}`);
  }
  if (belt.beltImage && !existsSync(join('src', belt.beltImage))) {
    errors.push(`${where}: image ${belt.beltImage} not found under src/`);
  }

  for (const t of belt.techniques ?? []) {
    techniques++;
    const at = `${where} › technique ${t.id} (${t.name})`;
    if (!Number.isInteger(t.id) || t.id <= 0 || t.id >= USER_ID_START)
      errors.push(`${at}: id out of range`);
    if (techniqueIds.has(t.id)) errors.push(`${at}: duplicate technique id`);
    techniqueIds.add(t.id);
    for (const field of REQUIRED) {
      if (typeof t[field] !== 'string' || !t[field].trim()) errors.push(`${at}: missing ${field}`);
    }
    for (const [field, max] of Object.entries(LIMITS)) {
      if (typeof t[field] !== 'string') errors.push(`${at}: ${field} must be text`);
      else if (t[field].length > max)
        errors.push(`${at}: ${field} longer than ${max} (the form limit)`);
    }
    if (t.demoUrl) {
      if (youTubeVideoId(t.demoUrl)) videos++;
      else errors.push(`${at}: demoUrl is not a YouTube video link: ${t.demoUrl}`);
    }
  }
}

if (errors.length > 0) {
  console.error(`❌ ${errors.length} problem(s) in ${DATA}:`);
  for (const error of errors) console.error(`   • ${error}`);
  process.exit(1);
}
console.log(
  `✅ ${belts.length} belts, ${techniques} techniques (${videos} with video): data is consistent.`
);
