# Local-only image receiver. The ChatGPT tab opens this page once, then postMessages each generated
# image to it; the page (same origin as this server) POSTs it here and it lands in the project.
import base64, os, re
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs

OUT = r"C:\Users\Daryll\Documents\projects\Ancients\images\redesign\source"
PAGE = b"""<!doctype html><meta charset=utf-8><title>Ancients image receiver</title>
<body style="background:#111;color:#e6a656;font:16px system-ui;padding:24px">
<h3>Ancients image receiver</h3><p>Leave this tab open. Images from ChatGPT save here automatically.</p><ol id=log></ol>
<script>
addEventListener('message', async (e) => {
  if (e.origin !== 'https://chatgpt.com' || !e.data || !e.data.name) return;
  const r = await fetch('/save?name=' + encodeURIComponent(e.data.name), {method: 'POST', body: e.data.dataUrl});
  const t = await r.text();
  document.getElementById('log').insertAdjacentHTML('beforeend', '<li>' + t + '</li>');
  e.source.postMessage({saved: e.data.name, result: t}, e.origin);
});
</script>"""

class H(BaseHTTPRequestHandler):
    def log_message(self, *a): pass

    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-Type", "text/html")
        self.end_headers()
        self.wfile.write(PAGE)

    def do_POST(self):
        name = parse_qs(urlparse(self.path).query).get("name", ["image.png"])[0]
        name = re.sub(r"[^a-zA-Z0-9_./-]", "_", name).lstrip("/").replace("..", "")
        body = self.rfile.read(int(self.headers["Content-Length"]))
        data = base64.b64decode(body.split(b",", 1)[-1])
        path = os.path.join(OUT, *name.split("/"))
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "wb") as f:
            f.write(data)
        print("saved", name, len(data), flush=True)
        self.send_response(200)
        self.end_headers()
        self.wfile.write(f"saved {name} ({len(data)} bytes)".encode())

HTTPServer(("127.0.0.1", 8791), H).serve_forever()
