// Content contract. Dependency-free; run before every commit:
//   node tools/verify-content.mjs
// Until 2026-10-28 this re-extracted the original site and required data/*.json to match it word for word
// (it kept redesign agents from rewording content). Since then the content is being corrected on purpose:
// popups were filled and a sourced fact-check fixed dates and claims (log: docs/CORRECTIONS.md). So this
// now checks integrity instead: every content change must still go through a sourced fact-check first.
import fs from 'node:fs';

const failures = [];
const fail = (msg) => failures.push(msg);
const read = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const slugify = (title) => title.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const yearNum = (y) => {
  const n = Number((y.match(/[\d,]+/) || ['NaN'])[0].replace(/,/g, ''));
  return /BCE/.test(y) ? -n : n;
};

const t = read('data/timeline.json');
const events = t.periods.flatMap((p) => p.events);
if (t.periods.length !== 8) fail(`expected 8 eras, found ${t.periods.length}`);
if (events.length !== 63) fail(`expected 63 events, found ${events.length}`);

t.periods.forEach((p) => p.events.forEach((e, i) => {
  const nn = String(i + 1).padStart(2, '0');
  const id = `${p.id}-${nn}`;
  for (const k of ['year', 'shortDesc', 'title', 'description']) if (!e[k]) fail(`${id}: no ${k}`);
  const d = e.details || {};
  if (!d.details || !d.culturalContext) fail(`${id}: popup is empty`);
  if (JSON.stringify(e).includes('Placeholder')) fail(`${id}: still has placeholder text`);
  if (d.year && d.year.replace(/,/g, '') !== e.year.replace(/,/g, '')) fail(`${id}: popup year ${d.year} != ${e.year}`);
  if (Number.isNaN(yearNum(e.year))) fail(`${id}: year "${e.year}" has no number`);
  const prev = p.events[i - 1];
  if (prev && yearNum(prev.year) > yearNum(e.year)) fail(`${id}: ${e.year} comes after ${prev.year} (events must run in date order)`);
  const img = `images/redesign/events/${p.id}/${nn}-${slugify(e.title)}.webp`;
  if (!fs.existsSync(img)) fail(`${id}: event image ${img} missing`);
  const thumb = img.replace('/events/', '/events-thumb/');
  if (!fs.existsSync(thumb)) fail(`${id}: thumbnail ${thumb} missing (run tools/make-thumbs.sh)`);
}));

const dyk = read('data/did-you-know.json');
for (const [k, facts] of Object.entries(dyk)) {
  if (!Array.isArray(facts) || facts.some((f) => typeof f !== 'string' || !f.trim())) fail(`did-you-know ${k}: bad facts`);
}

const artifacts = read('data/artifacts.json');
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
console.log(`content contract OK: 8 eras, ${events.length} events in date order, every popup complete, ` +
  `every image present, ${Object.keys(artifacts).length} artifacts`);
