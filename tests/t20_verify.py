"""T-020b verification: short home, depth routes, navigation, fallbacks."""
import sys
from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:8137"
results, failures, all_errors = [], [], []
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
    p.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
    r = p.goto(BASE + "/", wait_until="networkidle"); p.wait_for_timeout(900)
    ok("home 200", r.status == 200)
    ok("home H1 promise", "more than a result" in p.locator("h1").text_content())
    ok("home lead", "continuous across AI agents" in p.locator(".lead").text_content())
    ok("hero board visible", p.locator("#wsboard").is_visible())
    ok("five agent apps", p.locator(".ws-harness .h-tab").count() == 5)
    ok("case has four stages", p.locator("#task .flow li").count() == 4)
    ok("case has governance context", p.locator("#task .source-panel").count() == 1)
    ok("architecture has six components", p.locator("#architecture .arch-node").count() == 6)
    p.locator('.arch-node[data-arch="context"]').click(); p.wait_for_timeout(200)
    ok("architecture detail updates", p.locator("#arch-title").text_content() == "Context")
    ok("architecture active line", p.locator(".arch-lines line.is-on").count() == 1)
    ok("start CTA links to start", p.locator('#next a[href="/start/"]').count() >= 1)
    ok("trust CTA links to trust", p.locator('#next a[href="/trust/"]').count() >= 1)
    ok("rail has five nodes", p.locator(".progress-rail a").count() == 5)
    ok("anchor stubs present", all(p.locator("#"+a).count() == 1 for a in ("quickstart","workflow","dimensions","artifacts","cortex","evidence","trust","platform")))
    ok("home no horizontal overflow", p.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1"))

    en_routes = [("/how-it-works/", "One project", "How it works"), ("/explore/", "Where information", "Explore"),
                 ("/codec-cortex/", "How information", "Codec"), ("/start/", "try it", "Start"),
                 ("/trust/", "What can I check", "Trust"), ("/community/", "Report, contribute", "Community")]
    for path, needle, label in en_routes:
        r = p.goto(BASE + path, wait_until="networkidle"); p.wait_for_timeout(250)
        ok(f"EN {label} 200", r.status == 200)
        ok(f"EN {label} H1", needle.lower() in p.locator("h1").text_content().lower())
        ok(f"EN {label} nav active", p.locator('.nav-links a[aria-current="page"]').count() == 1)
        ok(f"EN {label} no overflow", p.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1"))
    all_errors.extend(errs); errs = []

    # codec comparator + certificate (no end-to-end demo)
    p.goto(BASE + "/codec-cortex/", wait_until="networkidle")
    ok("codec comparator", p.locator('.code-panel[data-code-panel="source"]').count() == 1 and p.locator('.code-panel[data-code-panel="human"]').count() == 1)
    ok("codec certificate link", p.locator('.codec-certificate a[href*="certificate.json"]').count() == 1)
    ok("codec demo removed", p.locator("#idea-input").count() == 0)

    # anchor deep link
    p.goto(BASE + "/trust/#evidence", wait_until="networkidle"); p.wait_for_timeout(700)
    ok("trust anchor reached", "#evidence" in p.url)
    ctx.close()

    # ES routes
    ctx = b.new_context(viewport={"width": 1440, "height": 950})
    p = ctx.new_page(); errs = []
    p.on("pageerror", lambda e: errs.append(str(e)))
    p.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
    p.goto(BASE + "/es/", wait_until="networkidle"); p.wait_for_timeout(600)
    ok("ES home H1", "Cada tarea deja" in p.locator("h1").text_content())
    es_routes = [("/es/como-funciona/", "Un proyecto"), ("/es/explorar/", "Dónde vive la información"),
                 ("/es/codec-cortex/", "Cómo se representa"), ("/es/empezar/", "pruebo sin adivinar"),
                 ("/es/confianza/", "Qué puedo comprobar"), ("/es/comunidad/", "Reporta, contribuye")]
    for path, needle in es_routes:
        r = p.goto(BASE + path, wait_until="networkidle"); p.wait_for_timeout(200)
        ok(f"ES {path} 200", r.status == 200)
        ok(f"ES {path} H1", needle.lower() in p.locator("h1").text_content().lower())
    all_errors.extend(errs); ctx.close()

    # mobile
    ctx = b.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True)
    p = ctx.new_page(); p.goto(BASE + "/es/", wait_until="networkidle"); p.wait_for_timeout(600)
    ok("ES mobile no overflow", p.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1"))
    p.locator(".menu-toggle").click(); p.wait_for_timeout(200)
    ok("mobile menu opens", p.locator(".nav-links").evaluate("el=>el.classList.contains('open')") and p.locator(".menu-toggle").get_attribute("aria-expanded") == "true")
    p.keyboard.press("Escape"); p.wait_for_timeout(200)
    ctx.close()

    # no-JS
    ctx = b.new_context(viewport={"width": 1440, "height": 950}, java_script_enabled=False)
    p = ctx.new_page(); p.goto(BASE + "/", wait_until="load")
    ok("no-JS home H1", "more than a result" in p.locator("h1").text_content())
    ok("no-JS case readable", "The work ends" in p.locator("#task").text_content())
    ok("no-JS routes linked", p.locator('a[href="/start/"]').count() >= 1)
    ctx.close()

    # reduced motion
    ctx = b.new_context(viewport={"width": 1440, "height": 950}, reduced_motion="reduce")
    p = ctx.new_page(); p.goto(BASE + "/", wait_until="networkidle")
    ok("reduced-motion board visible", p.locator("#wsboard").is_visible())
    ok("reduced-motion case content", "The work ends" in p.locator("#task").text_content())
    ctx.close()
    b.close()

ok("no console/page errors", len(all_errors) == 0)
if all_errors: print("ERRORS:", " | ".join(all_errors[:5]))
print("\n".join(results)); print("----"); print("TOTAL", len(results), "FAILURES", len(failures))
sys.exit(1 if failures else 0)
