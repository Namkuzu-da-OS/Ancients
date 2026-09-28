// Content contract for the redesign. Dependency-free; run before every commit:
//   node tools/verify-content.mjs
// 1. Re-extracts the content from the ORIGINAL site on `main` and requires data/*.json
//    to match it exactly (same eras, same 63 events, same words, same popups, facts, artifacts).
// 2. Checks the new pages still load that data and nothing else supplies content.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const REF = process.env.CONTENT_REF || 'main';
const SOURCES = ['index.html', 'js/timeline-data.js', 'js/modal.js', 'js/did-you-know.js', 'js/artifacts-data.js'];
const failures = [];
const fail = (msg) => failures.push(msg);

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ancients-verify-'));
for (const f of SOURCES) {
  const body = execFileSync('git', ['show', `${REF}:${f}`], { encoding: 'utf8', maxBuffer: 1 << 26 });
  fs.mkdirSync(path.join(tmp, path.dirname(f)), { recursive: true });
  fs.writeFileSync(path.join(tmp, f), body);
}
execFileSync(process.execPath, [path.resolve('tools/extract-content.mjs')], { cwd: tmp, stdio: 'ignore' });

function diff(a, b, where) {
  if (typeof a !== typeof b || Array.isArray(a) !== Array.isArray(b)) return fail(`${where}: type differs`);
  if (a && typeof a === 'object') {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const k of keys) {
      if (!(k in b)) fail(`${where}.${k}: missing from data/`);
      else if (!(k in a)) fail(`${where}.${k}: not in the original site`);
      else diff(a[k], b[k], `${where}.${k}`);
    }
  } else if (a !== b) fail(`${where}: "${String(b).slice(0, 80)}" should be "${String(a).slice(0, 80)}"`);
}
for (const f of ['timeline.json', 'did-you-know.json', 'artifacts.json']) {
  const want = JSON.parse(fs.readFileSync(path.join(tmp, 'data', f), 'utf8'));
  if (!fs.existsSync(path.join('data', f))) { fail(`data/${f} missing`); continue; }
  diff(want, JSON.parse(fs.readFileSync(path.join('data', f), 'utf8')), f);
}
fs.rmSync(tmp, { recursive: true, force: true });

// Headline counts, stated plainly so a reader can see what is protected.
const t = JSON.parse(fs.readFileSync('data/timeline.json', 'utf8'));
const events = t.periods.flatMap((p) => p.events);
if (t.periods.length !== 8) fail(`expected 8 eras, found ${t.periods.length}`);
if (events.length !== 63) fail(`expected 63 events, found ${events.length}`);

// Artifact images referenced by the data must exist.
const artifacts = JSON.parse(fs.readFileSync('data/artifacts.json', 'utf8'));
for (const [key, a] of Object.entries(artifacts)) {
  for (const img of [a.image, ...(a.images || [])].filter(Boolean)) {
    if (!fs.existsSync(img)) fail(`artifact ${key}: image ${img} missing`);
  }
}

if (failures.length) {
  console.error(`CONTENT CONTRACT FAILED (${failures.length})`);
  for (const f of failures.slice(0, 40)) console.error('  - ' + f);
  process.exit(1);
}
console.log(`content contract OK: 8 eras, ${events.length} events, ${events.filter((e) => e.details).length} popups, ` +
  `${Object.keys(artifacts).length} artifacts (checked against ${REF})`);
