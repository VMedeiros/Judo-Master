#!/usr/bin/env node
/**
 * Lighthouse on every page of the production build, as a phone and as a
 * desktop see them (Lighthouse's mobile profile: slow 4G, mid-range CPU; and
 * its desktop profile). The same check as JudoKan's.
 *
 * Accessibility, Best Practices and SEO must score 100: they are deterministic,
 * so anything less is a regression. Performance is reported, not enforced, as
 * it moves from run to run; what holds it is the bundle budget
 * (scripts/check-bundle-size.mjs).
 *
 * Serves the build with scripts/serve-dist.mjs (as GitHub Pages does) and
 * drives Playwright's Chromium. Run after `npm run build`:
 *
 *   npm run lighthouse
 *
 * LIGHTHOUSE_BLOCK (comma-separated URL patterns) blocks requests the machine
 * adds on its own, such as an antivirus injecting scripts into every page.
 */
import { spawn } from 'node:child_process';
import { appendFileSync } from 'node:fs';
import { chromium } from '@playwright/test';
import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';

const PORT = 4420;
const DEBUG_PORT = 9224;
const BASE = `http://localhost:${PORT}/Judo-Master/`;
const PAGES = ['', 'tecnicas'];
const PROFILES = { mobile: undefined, desktop: desktopConfig };
const ENFORCED = ['accessibility', 'best-practices', 'seo'];
const CATEGORIES = ['performance', ...ENFORCED];

/** Polls until the server answers, one attempt after the other. */
async function waitForServer(url, attemptsLeft = 50) {
  try {
    if ((await fetch(url)).ok) return;
  } catch {
    // not listening yet
  }
  if (attemptsLeft <= 1) throw new Error(`${url} did not come up`);
  await new Promise(resolve => setTimeout(resolve, 200));
  return waitForServer(url, attemptsLeft - 1);
}

const BLOCKED = (process.env['LIGHTHOUSE_BLOCK'] ?? '').split(',').filter(Boolean);
const blockedPattern = BLOCKED.length
  ? new RegExp(
      BLOCKED.map(p =>
        p
          .split('*')
          .map(s => s.replace(/[.+?^${}()|[\]\\]/g, String.raw`\$&`))
          .join('.*')
      ).join('|')
    )
  : null;

/** An audit failed only by requests the machine added (LIGHTHOUSE_BLOCK). */
function onlyMachineNoise(audit) {
  const items = audit.details?.items ?? [];
  return (
    blockedPattern !== null &&
    items.length > 0 &&
    items.every(item => blockedPattern.test(item.url ?? item.source ?? ''))
  );
}

/** The audits that cost a category its points, for the failure message. */
function failingAudits(lhr, categoryId) {
  return lhr.categories[categoryId].auditRefs
    .filter(ref => ref.weight > 0 && (lhr.audits[ref.id].score ?? 1) < 1)
    .filter(ref => !onlyMachineNoise(lhr.audits[ref.id]))
    .map(ref => {
      const value = lhr.audits[ref.id].displayValue;
      return value ? `${ref.id} (${value})` : ref.id;
    });
}

/** Runs Lighthouse on one page with one profile and records its scores and failures. */
async function audit(path, profile) {
  const { lhr } = await lighthouse(
    BASE + path,
    {
      port: DEBUG_PORT,
      logLevel: 'error',
      onlyCategories: CATEGORIES,
      blockedUrlPatterns: BLOCKED,
    },
    PROFILES[profile]
  );
  const score = id => Math.round((lhr.categories[id].score ?? 0) * 100);
  const page = `/${path}`;
  rows.push({
    page,
    profile,
    ...Object.fromEntries(CATEGORIES.map(id => [id, score(id)])),
    lcp: lhr.audits['largest-contentful-paint'].displayValue,
    tbt: lhr.audits['total-blocking-time'].displayValue,
    cls: lhr.audits['cumulative-layout-shift'].displayValue,
  });
  for (const id of ENFORCED) {
    const failing = failingAudits(lhr, id);
    if (score(id) < 100 && failing.length) {
      problems.push(`${page} (${profile}) ${id} ${score(id)}: ${failing.join(', ')}`);
    }
  }
}

const rows = [];
const problems = [];
const server = spawn(process.execPath, ['scripts/serve-dist.mjs', String(PORT)], {
  stdio: 'ignore',
});
// The full Chromium in its new headless mode: Lighthouse expects a real browser.
const browser = await chromium.launch({
  channel: 'chromium',
  args: [`--remote-debugging-port=${DEBUG_PORT}`],
});
try {
  await waitForServer(BASE);
  // One run after the other: every run drives the same browser.
  const runs = PAGES.flatMap(path => Object.keys(PROFILES).map(profile => [path, profile]));
  await runs.reduce(
    (previous, [path, profile]) => previous.then(() => audit(path, profile)),
    Promise.resolve()
  );
} finally {
  await browser.close();
  server.kill();
}

const table = [
  '| Page | Profile | Performance | LCP | TBT | CLS | Accessibility | Best Practices | SEO |',
  '| --- | --- | --- | --- | --- | --- | --- | --- | --- |',
  ...rows.map(
    r =>
      `| \`${r.page}\` | ${r.profile} | ${r.performance} | ${r.lcp} | ${r.tbt} | ${r.cls} | ${r.accessibility} | ${r['best-practices']} | ${r.seo} |`
  ),
].join('\n');
console.log(table);
if (process.env['GITHUB_STEP_SUMMARY']) {
  appendFileSync(
    process.env['GITHUB_STEP_SUMMARY'],
    `### Lighthouse\n\n${table}\n\nPerformance is reported, not enforced: it varies from run to run.\n`
  );
}

if (problems.length) {
  console.error(`\nBelow 100:\n  ${problems.join('\n  ')}`);
  process.exit(1);
}
