# Local-only image receiver + paced queue. The ChatGPT tab opens this page once, then talks to it by
# postMessage: it asks /next for the next prompt, and posts each generated image back to be saved.
# PACING LIVES HERE, not in the page script, so it holds even if the ChatGPT tab reloads (Daryll, 2026-10-04/05:
# "rate limit your own self so you don't get us rate limited with ChatGPT").
import base64, json, os, random, re, threading, time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, parse_qs

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = r"C:\Users\Daryll\Documents\projects\Ancients\images\redesign\source"
STATE = os.path.join(HERE, "queue-state.json")

GAP = (5 * 60, 8 * 60)        # send-to-send gap, seconds
BATCH = 10                    # sends per batch...
REST = (45 * 60, 60 * 60)     # ...then rest this long
HOURLY_CAP = 9                # never more than this many sends in any 60 minutes
LIMIT_BACKOFF = 60 * 60       # ChatGPT said "limit" / no Send button
MISS_BACKOFF = 20 * 60        # image never arrived
INFLIGHT_TIMEOUT = 15 * 60    # a sent item with no result after this counts as a miss

lock = threading.Lock()

def load():
    with open(STATE, encoding="utf-8") as f:
        return json.load(f)

def save(s):
    tmp = STATE + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(s, f, indent=1)
    os.replace(tmp, STATE)

def log(s, msg):
    line = time.strftime("%H:%M:%S ") + msg
    print(line, flush=True)
    s.setdefault("log", []).append(line)
    s["log"] = s["log"][-200:]

def item(s, name):
    return next((i for i in s["items"] if i["name"] == name), None)

def back_off(s, secs, why):
    s["next_allowed"] = max(s.get("next_allowed", 0), time.time() + secs)
    log(s, f"back off {secs // 60} min: {why}")

def next_item(s):
    now = time.time()
    if s.get("paused"):
        return {"wait": 60, "why": "paused"}
    infl = [i for i in s["items"] if i["status"] == "sent"]
    for i in infl:
        if now - i["sent_at"] > INFLIGHT_TIMEOUT:
            i["status"] = "pending"; i["misses"] = i.get("misses", 0) + 1
            back_off(s, MISS_BACKOFF, f"{i['name']} timed out")
    infl = [i for i in s["items"] if i["status"] == "sent"]
    if infl:  # a (re)started page script picks the in-flight item back up without re-sending it
        return {"inflight": {"name": infl[0]["name"], "prompt": infl[0]["prompt"]}}
    if now < s.get("next_allowed", 0):
        return {"wait": int(s["next_allowed"] - now), "why": "pacing"}
    recent = [t for t in s.get("sends", []) if now - t < 3600]
    if len(recent) >= HOURLY_CAP:
        return {"wait": int(min(recent) + 3600 - now) + 5, "why": "hourly cap"}
    pend = [i for i in s["items"] if i["status"] == "pending"]
    if not pend:
        return {"done": True}
    i = pend[0]
    i["status"] = "sent"; i["sent_at"] = now; i["tries"] = i.get("tries", 0) + 1
    s.setdefault("sends", []).append(now)
    s["sends"] = [t for t in s["sends"] if now - t < 3 * 3600]
    s["batch"] = s.get("batch", 0) + 1
    if s["batch"] >= BATCH:
        s["batch"] = 0
        rest = random.randint(*REST)
        s["next_allowed"] = now + rest
        log(s, f"SEND {i['name']} (end of batch, then rest {rest // 60} min)")
    else:
        gap = random.randint(*GAP)
        s["next_allowed"] = now + gap
        log(s, f"SEND {i['name']} (next in {gap // 60} min)")
    return {"name": i["name"], "prompt": i["prompt"]}

PAGE = b"""<!doctype html><meta charset=utf-8><title>Ancients image receiver</title>
<body style="background:#111;color:#e6a656;font:15px system-ui;padding:24px">
<h3>Ancients image receiver (paced)</h3><p>Leave this tab open. The pacing lives in the server.</p><pre id=st></pre><ol id=log></ol>
<script>
const post = (p, b) => fetch(p, {method: 'POST', body: b}).then(r => r.text());
addEventListener('message', async (e) => {
  if (e.origin !== 'https://chatgpt.com' || !e.data || !e.data.op) return;
  const d = e.data; let reply = {op: d.op, id: d.id};
  try {
    if (d.op === 'next') reply.res = JSON.parse(await post('/next', ''));
    else if (d.op === 'save') reply.res = await post('/save?name=' + encodeURIComponent(d.name), d.dataUrl);
    else if (d.op === 'event') reply.res = await post('/event', JSON.stringify(d.ev));
  } catch (err) { reply.err = String(err); }
  if (d.op !== 'event' || d.ev.type !== 'heartbeat')
    document.getElementById('log').insertAdjacentHTML('afterbegin', '<li>' + new Date().toLocaleTimeString() + ' ' + d.op + ' ' + JSON.stringify(reply.res || reply.err).slice(0, 160) + '</li>');
  e.source.postMessage(reply, e.origin);
});
setInterval(async () => { document.getElementById('st').textContent = await fetch('/status').then(r => r.text()); }, 10000);
</script>"""

class H(BaseHTTPRequestHandler):
    def log_message(self, *a): pass

    def reply(self, body, ctype="application/json"):
        if isinstance(body, (dict, list)):
            body = json.dumps(body, indent=1)
        if isinstance(body, str):
            body = body.encode()
        self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        p = urlparse(self.path).path
        if p == "/status":
            with lock:
                s = load()
                c = {}
                for i in s["items"]:
                    c[i["status"]] = c.get(i["status"], 0) + 1
                now = time.time()
                return self.reply({"counts": c, "paused": s.get("paused", False),
                                   "next_in_min": round(max(0, s.get("next_allowed", 0) - now) / 60, 1),
                                   "heartbeat_s_ago": round(now - s.get("heartbeat", 0)),
                                   "sends_last_hour": len([t for t in s.get("sends", []) if now - t < 3600]),
                                   "log": s.get("log", [])[-12:]})
        self.reply(PAGE, "text/html")

    def do_POST(self):
        u = urlparse(self.path)
        body = self.rfile.read(int(self.headers.get("Content-Length") or 0))
        with lock:
            s = load()
            if u.path == "/next":
                r = next_item(s); save(s); return self.reply(r)
            if u.path in ("/pause", "/resume"):
                s["paused"] = u.path == "/pause"; log(s, u.path[1:]); save(s); return self.reply({"ok": True})
            if u.path == "/event":
                ev = json.loads(body or b"{}"); t = ev.get("type"); i = item(s, ev.get("name", ""))
                s["heartbeat"] = time.time()
                if t == "limit":
                    if i and i["status"] == "sent": i["status"] = "pending"
                    back_off(s, LIMIT_BACKOFF, f"limit: {ev.get('detail', '')[:120]}")
                elif t == "miss":
                    if i and i["status"] == "sent":
                        i["status"] = "pending"; i["misses"] = i.get("misses", 0) + 1
                    back_off(s, MISS_BACKOFF, f"miss {ev.get('name')}: {ev.get('detail', '')[:100]}")
                elif t == "note":
                    log(s, "note: " + ev.get("detail", "")[:200])
                save(s); return self.reply({"ok": True})
            if u.path == "/save":
                name = parse_qs(u.query).get("name", ["image.png"])[0]
                name = re.sub(r"[^a-zA-Z0-9_./-]", "_", name).lstrip("/").replace("..", "")
                data = base64.b64decode(body.split(b",", 1)[-1])
                path = os.path.join(OUT, *name.split("/"))
                os.makedirs(os.path.dirname(path), exist_ok=True)
                with open(path, "wb") as f:
                    f.write(data)
                i = item(s, name)
                if i:
                    i["status"] = "saved"; i["saved_at"] = time.time()
                log(s, f"saved {name} ({len(data) // 1024} KB)")
                save(s); return self.reply(f"saved {name} ({len(data)} bytes)", "text/plain")
        self.reply({"err": "unknown"})

ThreadingHTTPServer(("127.0.0.1", 8791), H).serve_forever()
