// Ancients art queue, page side. Paste into the ChatGPT tab (javascript_tool) after the receiver tab is linked
// as window.__rx. It only executes: the receiver server (receiver.py) decides WHEN to send (pacing, batch rests,
// hourly cap, back-off). Images are fetched through ChatGPT's own conversation API, not scraped from the page,
// so a page that "finishes without redrawing" still delivers. Stop: window.__AQ.stop = true.
(() => {
  if (window.__AQ && window.__AQ.running) return 'already running: ' + window.__AQ.state;
  const AQ = (window.__AQ = { running: true, stop: false, state: 'init', saved: [] });
  const RX = 'http://127.0.0.1:8791';
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  let seq = 0;
  const waiting = {};
  addEventListener('message', (e) => {
    if (e.origin !== RX || !e.data) return;
    const f = waiting[e.data.id];
    if (f) { delete waiting[e.data.id]; f(e.data); }
  });
  const rx = (op, extra) => new Promise((res, rej) => {
    if (!window.__rx || window.__rx.closed) return rej(new Error('receiver tab not linked'));
    const id = ++seq;
    waiting[id] = res;
    window.__rx.postMessage({ op, id, ...extra }, RX);
    setTimeout(() => { if (waiting[id]) { delete waiting[id]; rej(new Error('receiver timeout')); } }, 30000);
  });
  const ev = (type, name, detail) => rx('event', { ev: { type, name, detail } }).catch(() => {});
  const tok = async () => (await fetch('/api/auth/session').then((r) => r.json())).accessToken;
  const api = async (path) => fetch(path, { headers: { Authorization: 'Bearer ' + (await tok()) } }).then((r) => r.json());
  const chain = (j) => {
    const c = [];
    for (let id = j.current_node; id && j.mapping[id]; id = j.mapping[id].parent) c.push(j.mapping[id]);
    return c.reverse().filter((n) => n.message);
  };
  const strs = (m) => (m.content.parts || []).filter((p) => typeof p === 'string').join(' ');
  // everything after the last user message that contains `marker`
  const after = (j, marker) => {
    const c = chain(j);
    let k = -1;
    c.forEach((n, i) => { if (n.message.author.role === 'user' && strs(n.message).includes(marker)) k = i; });
    if (k < 0) return null;
    const assets = [], text = [];
    for (const n of c.slice(k + 1)) {
      for (const p of n.message.content.parts || []) if (p && p.asset_pointer && !assets.includes(p.asset_pointer)) assets.push(p.asset_pointer);
      if (n.message.author.role === 'assistant' && n.message.content.content_type === 'text') text.push(strs(n.message));
    }
    return { assets, text: text.join(' ').trim() };
  };
  const download = async (ptr, convId) => {
    const j = await api('/backend-api/files/download/' + ptr.replace(/^.*:\/\//, '') + '?conversation_id=' + convId + '&inline=false');
    const b = await fetch(j.download_url).then((r) => r.blob());
    return new Promise((r) => { const f = new FileReader(); f.onload = () => r(f.result); f.readAsDataURL(b); });
  };
  const busy = () => [...document.querySelectorAll('button')].some((b) => /stop/i.test(b.getAttribute('aria-label') || ''));
  const send = async (text) => {
    const ed = document.querySelector('.ProseMirror');
    if (!ed || ed.innerText.trim()) return false;
    // works while the tab is hidden (execCommand needs focus, which a background tab never has)
    const p = document.createElement('p');
    p.textContent = text;
    ed.replaceChildren(p);
    ed.dispatchEvent(new InputEvent('input', { bubbles: true }));
    for (let k = 0; k < 20; k++) {
      await sleep(500);
      const b = document.querySelector('[data-testid="send-button"]') ||
        [...document.querySelectorAll('button')].find((x) => /^send/i.test(x.getAttribute('aria-label') || ''));
      if (b && !b.disabled) {
        b.click();
        for (let m = 0; m < 20; m++) { await sleep(500); if (!ed.innerText.trim()) return true; }
        return false;
      }
    }
    return false;
  };
  const LIMIT = /limit|too many|try again (later|in)|wait (until|for)|slow down|high demand|unable to generate|can.?t (generate|create)/i;

  AQ.harvest = async (convId, marker, name) => { // save an image already sitting in a chat
    const a = after(await api('/backend-api/conversation/' + convId), marker);
    if (!a || !a.assets.length) return 'none for ' + name;
    return (await rx('save', { name, dataUrl: await download(a.assets[0], convId) })).res;
  };

  const handle = async (name, prompt, doSend) => {
    AQ.cur = name;
    if (doSend) {
      AQ.state = 'sending ' + name;
      if (!(await send(prompt))) { AQ.state = 'send failed'; await ev('limit', name, 'no Send button or composer did not clear'); return; }
    }
    const t0 = Date.now(), marker = prompt.slice(-70);
    let seen = null;
    while (Date.now() - t0 < 12 * 60000 && !AQ.stop) {
      AQ.state = 'waiting for ' + name + ' (' + Math.round((Date.now() - t0) / 1000) + 's)';
      await sleep(doSend ? 30000 : 3000);
      doSend = true;
      await ev('heartbeat', name);
      let j;
      try { j = await api('/backend-api/conversation/' + location.pathname.split('/c/')[1]); } catch (e) { continue; }
      const a = after(j, marker);
      if (!a) continue;
      if (a.assets.length) {
        const ptr = a.assets[0];
        if (busy() && seen !== ptr) { seen = ptr; continue; } // let it settle one more poll
        try {
          const r = await rx('save', { name, dataUrl: await download(ptr, j.conversation_id) });
          AQ.saved.push(name); AQ.state = 'saved ' + name; return r;
        } catch (e) { await ev('note', name, 'download failed: ' + e.message); continue; }
      }
      if (!busy() && Date.now() - t0 > 3 * 60000) {
        if (LIMIT.test(a.text)) { await ev('limit', name, a.text.slice(0, 200)); return; }
        if (a.text) { await ev('miss', name, 'reply without image: ' + a.text.slice(0, 160)); return; }
      }
    }
    if (!AQ.stop) await ev('miss', name, 'no image after 12 min');
  };

  (async () => {
    while (!AQ.stop) {
      let r;
      try { r = (await rx('next')).res; } catch (e) { AQ.state = 'receiver: ' + e.message; await sleep(60000); continue; }
      if (r.done) { AQ.state = 'done'; break; }
      if (r.inflight) { await handle(r.inflight.name, r.inflight.prompt, false); continue; }
      if (r.wait) { AQ.state = 'wait ' + Math.round(r.wait / 60) + ' min (' + r.why + ')'; await ev('heartbeat'); await sleep(Math.min(r.wait, 60) * 1000); continue; }
      await handle(r.name, r.prompt, true);
    }
    AQ.running = false;
  })();
  return 'queue started';
})();
