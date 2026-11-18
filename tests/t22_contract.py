"""T-022 verification: editorial contract (units, labels, pins, structure)."""
import sys
from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:8137"
SHA = "390333913e0f071a89241187f36cc90289e7e043"
results, failures = [], []
def ok(name, cond):
    results.append(("PASS " if cond else "FAIL ") + name)
    if not cond: failures.append(name)

with sync_playwright() as pw:
    try: b = pw.chromium.launch(channel="chrome")
    except Exception: b = pw.chromium.launch()
    ctx = b.new_context(viewport={"width": 1440, "height": 950})
    p = ctx.new_page()
    errs = []
    p.on("pageerror", lambda e: errs.append(str(e)))

    p.goto(BASE + "/", wait_until="networkidle")
    ok("EN hero projection unit", "one per harness" in p.locator(".hero-facts").text_content())
    ok("EN learning limit is policy-aware", "some routes can be automated" in p.locator("#arch-data").text_content())

    p.goto(BASE + "/es/", wait_until="networkidle")
    ok("ES hero projection unit", "una por harness" in p.locator(".hero-facts").text_content())
    ok("ES nav label", p.locator(".nav-links").get_attribute("aria-label") == "Navegación principal")
    ok("ES footer source label", "(fuente)" in p.locator("footer").text_content() and "(source)" not in p.locator("footer").text_content())
    ok("ES learning limit is policy-aware", "algunas rutas pueden automatizarse" in p.locator("#arch-data").text_content())

    for lang, path in (("EN", "/start/"), ("ES", "/es/empezar/")):
        p.goto(BASE + path, wait_until="networkidle")
        visible = p.locator(".start-cmd").nth(1).text_content()
        payload = p.locator(".copy-btn").nth(1).get_attribute("data-copy")
        ok(f"{lang} source visible checkout", "git checkout " + SHA in visible)
        ok(f"{lang} source copy checkout", "git checkout " + SHA in payload)

    p.goto(BASE + "/codec-cortex/", wait_until="networkidle")
    ok("codec demo is direct", "simulation" in p.locator("#intro").text_content())
    ok("codec editor source pinned", SHA in p.locator('a[href*="cortex-viewer"]').first.get_attribute("href"))

    p.goto(BASE + "/trust/", wait_until="networkidle")
    ok("trust order", p.evaluate("[...document.querySelectorAll('main > section')].map(s=>s.id).join(',')") == "intro,trust,evidence,limits,continue")

    p.goto(BASE + "/community/", wait_until="networkidle")
    txt = p.locator("main").text_content()
    ok("community participation label", "Participate today" in txt)
    ok("community future label", "Future direction" in txt)

    p.goto(BASE + "/explore/", wait_until="networkidle")
    ok("explore key terms", "Governance context" in p.locator(".artifact-vocab").text_content())

    ctx.close(); b.close()

ok("no page errors", len(errs) == 0)
print("\n".join(results)); print("----"); print("TOTAL", len(results), "FAILURES", len(failures))
sys.exit(1 if failures else 0)
