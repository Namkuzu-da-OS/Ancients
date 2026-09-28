// Freezes the content of the pre-redesign site into data/*.json.
// Source of truth = what the old site presents: index.html timeline items,
// js/timeline-data.js (popup details), js/did-you-know.js, js/artifacts-data.js.
// Run from the repo root against the ORIGINAL files: node tools/extract-content.mjs
import fs from 'node:fs';
import vm from 'node:vm';

const read = (p) => fs.readFileSync(p, 'utf8');
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();

// --- popup details (same lookup the old modal.js used) ---
const tctx = { window: {} };
vm.runInNewContext(read('js/timeline-data.js') + '\nthis.timelineData = timelineData;', tctx);
const timelineData = tctx.timelineData;

const modalSrc = read('js/modal.js');
const idFnSrc = modalSrc.match(/function getPeriodIdFromTitle[\s\S]*?\r?\n {4}\}/)[0];
const ictx = { window: {} };
vm.runInNewContext(idFnSrc + '\nthis.fn = getPeriodIdFromTitle;', ictx);
const getPeriodIdFromTitle = ictx.fn;

// --- timeline items from index.html, in page order ---
const html = read('index.html');
const container = html.slice(html.indexOf('<div class="timeline-container">'));
const blockRe = /<div class="(timeline-section[^"]*|timeline-item[^"]*)">([\s\S]*?)(?=<div class="timeline-section|<div class="timeline-item|<\/main>|<!-- Event Modal)/g;
const periods = [];
let m;
while ((m = blockRe.exec(container))) {
  const cls = m[1];
  const body = m[2];
  if (cls.startsWith('timeline-section')) {
    const title = decode(body.match(/<h3 class="period-title">([\s\S]*?)<\/h3>/)[1]);
    periods.push({ title, id: getPeriodIdFromTitle(title), theoretical: cls.includes('theoretical'), events: [] });
    continue;
  }
  const date = body.match(/<div class="date">\s*<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/);
  const content = body.match(/<div class="content">\s*<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/);
  const period = periods[periods.length - 1];
  const ev = {
    year: decode(date[1]),
    shortDesc: decode(date[2]),
    title: decode(content[1]),
    description: decode(content[2]),
    theoretical: cls.includes('theoretical'),
  };
  const pool = period.id && timelineData[period.id] ? timelineData[period.id].events : [];
  const detail = pool.find((d) => d.title.toUpperCase() === ev.title);
  if (detail) ev.details = detail;
  period.events.push(ev);
}

// --- Did You Know facts ---
const dyk = read('js/did-you-know.js');
const factsSrc = dyk.slice(dyk.indexOf('const didYouKnowFacts'), dyk.indexOf('};', dyk.indexOf('const didYouKnowFacts')) + 2);
const fctx = {};
vm.runInNewContext(factsSrc + '\nthis.facts = didYouKnowFacts;', fctx);

// --- artifacts ---
const actx = { window: {} };
vm.runInNewContext(read('js/artifacts-data.js') + '\nthis.a = artifactsData;', actx);

// Which fact group each era shows today (same title lookup as did-you-know.js; null = no box).
const dykMapSrc = dyk.match(/const periodMap = \{[\s\S]*?\};/)[0];
const dctx = {};
vm.runInNewContext(dykMapSrc + '\nthis.map = periodMap;', dctx);
for (const p of periods) p.didYouKnow = dctx.map[p.title.split('(')[0].trim()] ?? null;

fs.mkdirSync('data', { recursive: true });
const write = (p, o) => fs.writeFileSync(p, JSON.stringify(o, null, 2) + '\n');
write('data/timeline.json', { periods });
write('data/did-you-know.json', fctx.facts);
write('data/artifacts.json', actx.a);

const n = periods.reduce((s, p) => s + p.events.length, 0);
const withDetail = periods.reduce((s, p) => s + p.events.filter((e) => e.details).length, 0);
console.log(`periods=${periods.length} events=${n} withPopup=${withDetail} theoretical=${periods.flatMap((p) => p.events).filter((e) => e.theoretical).length}`);
console.log(`dykGroups=${Object.keys(fctx.facts).length} artifacts=${Object.keys(actx.a).length}`);
for (const p of periods) console.log(`  ${p.id ?? '??'}  ${p.events.length}  ${p.title}`);
