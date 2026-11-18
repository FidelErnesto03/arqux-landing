"""T-021 verification: workflow mechanism map (toggle, nodes, ficha, no-JS, contrast, mobile)."""
import sys
from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:8137"
results, failures = [], []
def ok(name, cond):
    results.append(("PASS " if cond else "FAIL ") + name)
    if not cond: failures.append(name)

def ratio(fg, bg):
    def ch(c):
        c /= 255.0
        return c/12.92 if c <= 0.03928 else ((c+0.055)/1.055)**2.4
    def lum(r): return 0.2126*ch(r[0])+0.7152*ch(r[1])+0.0722*ch(r[2])
    l1, l2 = sorted([lum(fg), lum(bg)], reverse=True)
    return (l1+0.05)/(l2+0.05)

with sync_playwright() as pw:
    try: b = pw.chromium.launch(channel="chrome")
    except Exception: b = pw.chromium.launch()

    ctx = b.new_context(viewport={"width": 1440, "height": 950})
    p = ctx.new_page()
    errs = []
    p.on("pageerror", lambda e: errs.append(str(e)))
    p.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
    p.goto(BASE + "/how-it-works/", wait_until="networkidle")
    p.wait_for_timeout(600)

    ok("workflow switch visible", p.locator(".wf-switch").is_visible())
    ok("default view is stages", p.locator(".wf-stages").is_visible() and p.locator(".wf-map").is_hidden())
    p.locator('[data-wf-view="map"]').click(); p.wait_for_timeout(500)
    ok("map view shows", p.locator(".wf-map").is_visible() and p.locator(".wf-stages").is_hidden())
    ok("map drawn once", p.locator(".wf-map").evaluate("el => el.classList.contains('is-drawn')"))
    ok("map has 6 nodes", p.locator(".map-node").count() == 6)
    ok("default node is kernel", p.locator("#map-title").text_content() == "AGENTS.md + .arqux/")
    ok("kernel pressed", p.locator('.map-node[data-map-node="1"]').get_attribute("aria-pressed") == "true")

    p.locator('.map-node[data-map-node="4"]').click(); p.wait_for_timeout(200)
    ok("drift ficha title", p.locator("#map-title").text_content() == "drift-check")
    ok("drift ficha via cites harness.py", "harness.py" in p.locator("#map-via").text_content())
    ok("drift source link", "adapters/harness.py" in p.locator("#map-src").get_attribute("href"))
    ok("drift limit stated", "not a signature" in p.locator("#map-note").text_content())

    p.locator('.map-node[data-map-node="5"]').focus(); p.keyboard.press("Enter"); p.wait_for_timeout(200)
    ok("keyboard selects evidence", p.locator("#map-title").text_content() == "pulse + seal.cortex")
    ok("evidence via cites commands", "cortex-verify" in p.locator("#map-via").text_content())

    p.locator('[data-wf-view="stages"]').click(); p.wait_for_timeout(200)
    ok("back to stages", p.locator(".wf-stages").is_visible() and p.locator(".wf-map").is_hidden())

    # exact deep facts present in data
    txt = p.locator("#map-data").text_content()
    for token in ("_TARGETS", "drift_report", "seal.cortex", "cortex-verify", "render_kernel"):
        ok(f"data mentions {token}", token in txt)

    # contrast of diagram text and caption
    def probe(sel, prop="fill"):
        return p.evaluate("""([sel,prop])=>{
          const el=document.querySelector(sel); if(!el) return null;
          const cs=getComputedStyle(el); const m=cs[prop].match(/[\\d.]+/g);
          return m ? [+m[0],+m[1],+m[2]] : null;
        }""", [sel, prop])
    r = probe(".map-label")
    ok(f"contrast map-label >= 4.5 (got {ratio(r,[255,255,255]):.2f})", ratio(r, [255, 255, 255]) >= 4.5)
    r2 = probe(".map-node text")
    ok(f"contrast map-node text >= 4.5 (got {ratio(r2,[255,255,255]):.2f})", ratio(r2, [255, 255, 255]) >= 4.5)
    ctx.close()

    # no-JS
    ctx = b.new_context(viewport={"width": 1440, "height": 950}, java_script_enabled=False)
    p = ctx.new_page()
    p.goto(BASE + "/how-it-works/", wait_until="load")
    ok("no-JS: switch hidden", p.locator(".wf-switch").is_hidden())
    ok("no-JS: map hidden", p.locator(".wf-map").is_hidden())
    ok("no-JS: stages readable", p.locator(".step-list").is_visible())
    ctx.close()

    # mobile ES
    ctx = b.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True)
    p = ctx.new_page()
    p.goto(BASE + "/es/como-funciona/", wait_until="networkidle"); p.wait_for_timeout(600)
    p.locator("#workflow").scroll_into_view_if_needed(); p.wait_for_timeout(200)
    p.locator('[data-wf-view="map"]').click(); p.wait_for_timeout(400)
    ok("ES map visible", p.locator(".wf-map").is_visible())
    p.locator('.map-node[data-map-node="2"]').click(); p.wait_for_timeout(200)
    ok("ES ficha localized", "Adaptadores" in p.locator("#map-kind").text_content() or "render" in p.locator("#map-via").text_content())
    ok("ES mobile: no horizontal overflow", p.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1"))
    ctx.close()

    ok("no console/page errors", len(errs) == 0)
    if errs: print("ERRORS:", " | ".join(errs[:5]))
    b.close()

print("\n".join(results))
print("----")
print("TOTAL", len(results), "FAILURES", len(failures))
sys.exit(1 if failures else 0)
