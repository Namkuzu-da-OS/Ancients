# Converts each arriving event PNG (images/redesign/source/events/...) to WebP in images/redesign/events/...
import os, time
from PIL import Image
ROOT = r"C:\Users\Daryll\Documents\projects\Ancients\images\redesign"
SRC, DST = os.path.join(ROOT, "source"), ROOT
done = {}
while True:
    for dp, _, fs in os.walk(SRC):
        for f in fs:
            if not f.endswith(".png") or os.path.basename(dp) == "strata" or f == "ring.png":
                continue
            p = os.path.join(dp, f)
            m = os.path.getmtime(p)
            if done.get(p) == m:
                continue
            out = os.path.join(DST, os.path.relpath(p, SRC))[:-4] + ".webp"
            try:
                os.makedirs(os.path.dirname(out), exist_ok=True)
                im = Image.open(p).convert("RGB")
                im.thumbnail((1920, 1920) if "dial" in dp or "vault" in dp else (1280, 1280))
                if f == "ring.png" and False:  # ring is cut out geometrically by hand
                    # black surround and centre hole -> transparent, feathered by brightness
                    lum = im.convert("L").point(lambda v: max(0, min(255, (v - 10) * 10)))
                    im = im.convert("RGBA"); im.putalpha(lum)
                    im.save(out, "WEBP", quality=88, method=6)
                else:
                    im.save(out, "WEBP", quality=80, method=6)
                done[p] = m
                print("webp", os.path.relpath(out, DST), os.path.getsize(out) // 1024, "KB", flush=True)
            except Exception as e:
                print("retry", f, e, flush=True)
    time.sleep(10)
