// The Artifact Vault (packet 07). All words come from data/artifacts.json via the shared loader.
import { loadAncientsData } from "./data.js";

const FILTERS = [["all", "All"], ["mysterious", "Mysterious"], ["tools", "Tools & Weapons"], ["art", "Art & Symbols"]];
const TAGS = { mysterious: "Mysterious", tools: "Tools & Weapons", art: "Art & Symbols" };
const SECTIONS = [["overview", "Overview"], ["context", "Context"], ["significance", "Significance"], ["mysteries", "Mysteries"]];
// Presentation only (how each photo sits in its niche); unknown keys fall back to a slab.
const MODES = { "mysterious-handbags": "triptych", "egyptian-cartouches": "stele", "bronze-age-swords": "vitrine", "paleolithic-hand-axe": "float-crop", "venus-figurines": "float" };
const GLYPHS = ["vg-bird", "vg-eye", "vg-ankh", "vg-owl", "vg-pillar-h", "vg-spiral", "vg-sun"];

const stage = document.querySelector(".vault-stage");
const rows = document.querySelector(".vault-facade__rows");
const panel = document.querySelector(".vault-panel");
const scrim = document.querySelector(".vault-scrim");
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const sheetQuery = matchMedia("(max-width: 1050px)");
const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
const imagesOf = (a) => a.images ?? (a.image ? [a.image] : []);
const probe = (src) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(true); i.onerror = () => ok(false); i.src = src; });
const img = (src, cls, alt = "") => { const i = el("img", cls); i.alt = alt; i.decoding = "async"; i.onerror = () => i.classList.add("is-missing"); i.src = src; return i; };
const flame = (azure) => { const f = el("span", "vault-flame" + (azure ? " is-azure" : "")); f.dataset.emberSource = ""; f.style.setProperty("--flick", (2 + Math.random() * 1.6).toFixed(2) + "s"); f.append(el("i"), el("i"), el("i")); return f; };

let entries = [], current = null, imageIndex = 0, opener = null;

function pillar(n) {
  const p = el("div", "vault-pillar"); p.setAttribute("aria-hidden", "true");
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "vault-relief vault-pillar__glyphs"); svg.setAttribute("viewBox", "0 0 40 240"); svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  for (let k = 0; k < 4; k++) { const u = document.createElementNS("http://www.w3.org/2000/svg", "use"); u.setAttribute("href", "#" + GLYPHS[(n * 3 + k) % GLYPHS.length]); u.setAttribute("x", "4"); u.setAttribute("y", String(4 + k * 60)); u.setAttribute("width", "32"); u.setAttribute("height", "52"); svg.append(u); }
  p.append(svg);
  if (n % 2 === 1) { const s = el("span", "vault-sconce"); s.append(flame(false)); p.append(s); }
  return p;
}

function display(key, a, mode) {
  const srcs = imagesOf(a), d = el("span", "niche__display");
  if (mode === "triptych") {
    d.classList.add("niche__display--triptych");
    const side = srcs[1] ?? srcs[0];
    [["side", side, "20% 30%"], ["main", srcs[0], "30% 50%"], ["side", side, "80% 70%"]].forEach(([k, s, pos]) => { const slab = el("span", "niche__slab niche__slab--" + k); const i = img(s, "niche__object"); i.style.objectPosition = pos; slab.append(i); d.append(slab); });
  } else if (mode === "stele") { d.classList.add("niche__display--stele"); const s = el("span", "niche__slab"); s.append(img(srcs[0], "niche__object")); d.append(s); }
  else if (mode === "vitrine") { d.classList.add("niche__display--vitrine"); const v = el("span", "niche__vitrine"); v.append(img(srcs[0], "niche__object")); d.append(v); }
  else if (mode?.startsWith("float")) { d.classList.add("niche__display--float"); if (mode === "float-crop") { d.classList.add("is-cropped"); d.style.setProperty("--crop", "0% 50%"); } d.append(img(srcs[0], "niche__object")); }
  else { d.classList.add("niche__display--stele"); const s = el("span", "niche__slab"); s.append(img(srcs[0], "niche__object")); d.append(s); }
  // A painted niche render, if the owner has dropped one in, takes over.
  const painted = `images/redesign/vault/${key}.webp`;
  probe(painted).then((ok) => { if (!ok) return; d.className = "niche__display niche__display--painted"; d.replaceChildren(img(painted, "niche__object")); });
  return d;
}

function niche(key, a, i) {
  const mysterious = a.category.includes("mysterious");
  const b = el("button", "niche" + (mysterious ? " is-mysterious" : "")); b.type = "button"; b.dataset.key = key; b.style.setProperty("--i", i); b.setAttribute("aria-pressed", "false");
  const arch = el("span", "niche__arch"), recess = el("span", "niche__recess"), lights = el("span", "niche__lights");
  const cone = el("span", "niche__cone"); cone.style.setProperty("--flick", (2.6 + i * 0.37).toFixed(2) + "s");
  lights.append(el("span", "niche__halo"), cone, el("span", "niche__lamp"));
  const cl = el("span", "niche__candle niche__candle--l"), cr = el("span", "niche__candle niche__candle--r"); cl.append(flame(mysterious)); cr.append(flame(mysterious));
  recess.append(lights, el("span", "niche__step"), el("span", "niche__plinth"), display(key, a, MODES[key]), cl, cr);
  arch.append(recess);
  const plaque = el("span", "niche__plaque"); plaque.append(el("span", "niche__title", a.title));
  b.append(arch, plaque);
  b.addEventListener("click", () => { if (!b.classList.contains("is-dimmed")) select(key, true, b); });
  return b;
}

function build(artifacts) {
  entries = Object.entries(artifacts);
  const upper = entries.slice(0, 3), lower = entries.slice(3);
  rows.replaceChildren();
  let p = 0;
  const row = (list, cls, bays) => {
    const r = el("div", "vault-row " + cls);
    if (bays) { const bay = el("div", "vault-bay"); bay.setAttribute("aria-hidden", "true"); r.append(bay); }
    r.append(pillar(p++));
    list.forEach(([k, a]) => { r.append(niche(k, a, entries.findIndex(([x]) => x === k)), pillar(p++)); });
    if (bays) { const bay = el("div", "vault-bay"); bay.setAttribute("aria-hidden", "true"); r.append(bay); }
    rows.append(r);
  };
  row(upper, upper.length === 3 ? "vault-row--upper" : "vault-row--single", false);
  if (lower.length) row(lower, lower.length === 2 ? "vault-row--lower" : "vault-row--upper", lower.length === 2);

  const nav = document.querySelector(".vault-filters");
  FILTERS.forEach(([value, label], n) => {
    const f = el("button", "vault-filter", label); f.type = "button"; f.dataset.filter = value; f.setAttribute("aria-pressed", String(n === 0));
    f.addEventListener("click", () => applyFilter(value)); nav.append(f);
  });
}

function applyFilter(value) {
  document.querySelectorAll(".vault-filter").forEach((f) => f.setAttribute("aria-pressed", String(f.dataset.filter === value)));
  document.querySelectorAll(".niche").forEach((n) => {
    const a = Object.fromEntries(entries)[n.dataset.key];
    const off = value !== "all" && !a.category.includes(value);
    n.classList.toggle("is-dimmed", off); n.tabIndex = off ? -1 : 0; n.setAttribute("aria-disabled", String(off));
  });
}

function showImage(n) {
  const srcs = imagesOf(current[1]); if (!srcs.length) return;
  imageIndex = (n + srcs.length) % srcs.length;
  const src = srcs[imageIndex], main = panel.querySelector(".vault-gallery__image");
  main.classList.remove("is-missing"); main.alt = `${current[1].title}, image ${imageIndex + 1} of ${srcs.length}`;
  main.classList.add("is-swapping");
  const done = () => main.classList.remove("is-swapping");
  main.onload = done; main.onerror = () => { done(); main.classList.add("is-missing"); };
  setTimeout(() => { main.src = src; if (reduced) done(); }, reduced ? 0 : 140);
  panel.querySelector(".vault-gallery__backdrop").style.backgroundImage = `url("${src}")`;
  panel.querySelector(".vault-gallery__count").textContent = `Image ${imageIndex + 1} of ${srcs.length}`;
  panel.querySelectorAll(".vault-gallery__thumb").forEach((t, k) => t.setAttribute("aria-current", String(k === imageIndex)));
  panel.querySelectorAll(".vault-gallery__dot").forEach((d, k) => d.classList.toggle("is-active", k === imageIndex));
}

function select(key, fromUser, trigger) {
  current = entries.find(([k]) => k === key); if (!current) return;
  const a = current[1], srcs = imagesOf(a), mysterious = a.category.includes("mysterious");
  document.querySelectorAll(".niche").forEach((n) => n.setAttribute("aria-pressed", String(n.dataset.key === key)));
  panel.classList.toggle("is-mysterious", mysterious);
  panel.querySelector(".vault-panel__title").textContent = a.title;
  const tags = panel.querySelector(".vault-panel__tags"); tags.replaceChildren(...a.category.map((c) => el("span", "vault-panel__tag ornament-pill", TAGS[c] ?? c)));
  const [place, dates] = a.era.split(" • ");
  panel.querySelector(".vault-panel__era-place").textContent = place;
  panel.querySelector(".vault-panel__era-dates").textContent = dates ?? "";
  const sec = panel.querySelector(".vault-panel__sections"); sec.replaceChildren();
  SECTIONS.forEach(([f, label]) => { if (!a[f]) return; const s = el("section", "vault-panel__section"); s.append(el("h3", null, label), el("p", null, a[f])); sec.append(s); });
  const gal = panel.querySelector(".vault-gallery"); gal.classList.toggle("is-single", srcs.length < 2);
  const thumbs = panel.querySelector(".vault-gallery__thumbs"), dots = panel.querySelector(".vault-gallery__dots");
  thumbs.replaceChildren(...srcs.map((s, k) => { const t = el("button", "vault-gallery__thumb"); t.type = "button"; t.setAttribute("aria-label", `Show image ${k + 1} of ${srcs.length}`); t.append(img(s, "")); t.addEventListener("click", () => showImage(k)); return t; }));
  dots.replaceChildren(...srcs.map(() => el("span", "vault-gallery__dot")));
  panel.querySelector(".vault-panel__body").scrollTop = 0;
  showImage(0);
  if (fromUser) { stage.classList.remove("is-panel-closed"); if (sheetQuery.matches) openSheet(trigger); }
}

function openSheet(trigger) { opener = trigger ?? document.activeElement; stage.classList.add("is-sheet-open"); scrim.hidden = false; panel.focus({ preventScroll: true }); }
function closePanel() {
  setFolio(false);
  if (sheetQuery.matches) { stage.classList.remove("is-sheet-open"); scrim.hidden = true; } else stage.classList.add("is-panel-closed");
  (opener ?? document.querySelector('.niche[aria-pressed="true"]'))?.focus?.();
}
function setFolio(on) {
  stage.classList.toggle("is-folio", on);
  const btn = panel.querySelector(".vault-panel__explore"); btn.setAttribute("aria-expanded", String(on));
  panel.querySelector(".vault-panel__explore-label").textContent = on ? "Return to the vault" : "Explore artifact";
  scrim.hidden = !(on || stage.classList.contains("is-sheet-open"));
}

function wire() {
  sheetQuery.addEventListener("change", () => stage.classList.toggle("is-sheet", sheetQuery.matches));
  stage.classList.toggle("is-sheet", sheetQuery.matches);
  panel.querySelector(".vault-gallery__arrow--prev").addEventListener("click", () => showImage(imageIndex - 1));
  panel.querySelector(".vault-gallery__arrow--next").addEventListener("click", () => showImage(imageIndex + 1));
  panel.querySelector(".vault-panel__close").addEventListener("click", closePanel);
  panel.querySelector(".vault-panel__explore").addEventListener("click", () => setFolio(!stage.classList.contains("is-folio")));
  scrim.addEventListener("click", () => (stage.classList.contains("is-folio") && !sheetQuery.matches ? setFolio(false) : closePanel()));
  document.addEventListener("keydown", (e) => {
    if (e.target.closest?.("input, textarea")) return;
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") { if (!current) return; e.preventDefault(); showImage(imageIndex + (e.key === "ArrowRight" ? 1 : -1)); }
    if (e.key === "Escape") { if (stage.classList.contains("is-folio")) setFolio(false); else if (stage.classList.contains("is-sheet-open")) closePanel(); }
  });
  let x0 = null; const g = panel.querySelector(".vault-gallery__stage");
  g.addEventListener("pointerdown", (e) => { x0 = e.clientX; });
  g.addEventListener("pointerup", (e) => { if (x0 != null && Math.abs(e.clientX - x0) > 40) showImage(imageIndex + (e.clientX < x0 ? 1 : -1)); x0 = null; });
}

function stars() {
  const c = document.querySelector(".vault-scene__stars"); if (!c) return;
  const r = c.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
  c.width = r.width * dpr; c.height = r.height * dpr; const x = c.getContext("2d"); x.scale(dpr, dpr);
  for (let k = 0; k < 260; k++) { const s = Math.random() ** 3 * 1.6 + 0.3; x.fillStyle = `rgba(${220 + Math.random() * 35},${215 + Math.random() * 30},255,${0.35 + Math.random() * 0.6})`; x.beginPath(); x.arc(Math.random() * r.width, Math.random() * r.height, s, 0, 7); x.fill(); }
}

function embers() {
  if (reduced) return;
  const c = document.querySelector(".vault-scene__embers"), ctx = c.getContext("2d"); const ps = [];
  const size = () => { c.width = innerWidth; c.height = innerHeight; }; size(); addEventListener("resize", size);
  const tick = () => {
    if (!document.hidden) {
      const src = [...document.querySelectorAll(".vault-brazier[data-ember-source], .vault-sconce .vault-flame")];
      if (src.length && ps.length < 90 && Math.random() < 0.5) {
        const r = src[(Math.random() * src.length) | 0].getBoundingClientRect();
        if (r.width) ps.push({ x: r.left + r.width / 2 + (Math.random() - 0.5) * 14, y: r.top + 10, vx: (Math.random() - 0.5) * 0.4, vy: -0.4 - Math.random() * 0.9, life: 1, s: Math.random() * 1.6 + 0.6 });
      }
      ctx.clearRect(0, 0, c.width, c.height);
      for (let k = ps.length - 1; k >= 0; k--) {
        const p = ps[k]; p.x += p.vx + Math.sin(p.y / 30) * 0.2; p.y += p.vy; p.life -= 0.006;
        if (p.life <= 0) { ps.splice(k, 1); continue; }
        ctx.fillStyle = `rgba(255,${150 + p.life * 80},${60 + p.life * 40},${p.life})`; ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, 7); ctx.fill();
      }
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

loadAncientsData().then(({ artifacts }) => {
  build(artifacts); wire(); applyFilter("all");
  select(entries[0][0], false);
  stars(); embers();
  requestAnimationFrame(() => stage.classList.add("is-lit"));
  probe("images/redesign/vault/background.webp").then((ok) => {
    if (!ok) return;
    document.querySelector(".vault-scene__painted").style.backgroundImage = 'url("images/redesign/vault/background.webp")';
    stage.classList.add("has-painted-bg");
  });
}).catch((err) => {
  const s = document.querySelector(".vault-hall__status"); if (s) s.textContent = "The vault could not be opened: the artifact records did not load. Serve the site over http and reload.";
  console.error("[Vault]", err);
});
