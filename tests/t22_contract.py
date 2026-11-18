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
    ok("EN hero projection unit", "one per compatible app" in p.locator(".hero-facts").text_content())
    ok("EN hero note explains projections", "one native file per compatible app" in p.locator(".hero-note").text_content())
    ok("EN learning limit is policy-aware", "some routes can be automated" in p.locator("#arch-data").text_content())

    p.goto(BASE + "/es/", wait_until="networkidle")
    ok("ES hero projection unit", "una por app compatible" in p.locator(".hero-facts").text_content())
    ok("ES nav label", p.locator(".nav-links").get_attribute("aria-label") == "Navegación principal")
    ok("ES footer source label", "(fuente)" in p.locator("footer").text_content() and "(source)" not in p.locator("footer").text_content())
    ok("ES hero note explains projections", "un archivo nativo por app compatible" in p.locator(".hero-note").text_content())
    ok("ES learning limit is policy-aware", "algunas rutas pueden automatizarse" in p.locator("#arch-data").text_content())

    for lang, path in (("EN", "/start/"), ("ES", "/es/empezar/")):
        p.goto(BASE + path, wait_until="networkidle")
        visible = p.locator(".start-cmd").nth(1).text_content()
        payload = p.locator(".copy-btn").nth(1).get_attribute("data-copy")
        ok(f"{lang} source visible checkout", "git checkout " + SHA in visible)
        ok(f"{lang} source copy checkout", "git checkout " + SHA in payload)

    p.goto(BASE + "/codec-cortex/", wait_until="networkidle")
    ok("codec is representation, not e2e", "Agents consume the format" in p.locator("#intro").text_content())
    ok("codec comparator", p.locator('.code-panel[data-code-panel="source"]').count() == 1 and p.locator('.code-panel[data-code-panel="human"]').count() == 1)
    ok("codec certificate visible", p.locator('.codec-certificate a[href*="certificate.json"]').count() == 1)
    ok("codec editor source pinned", SHA in p.locator('a[href*="cortex-viewer"]').first.get_attribute("href"))

    p.goto(BASE + "/trust/", wait_until="networkidle")
    ok("trust order", p.evaluate("[...document.querySelectorAll('main > section')].map(s=>s.id).join(',')") == "intro,trust,evidence,limits,continue")

    p.goto(BASE + "/community/", wait_until="networkidle")
    txt = p.locator("main").text_content()
    ok("community participation label", "Participate today" in txt)
    ok("community future label", "Future direction" in txt)

    p.goto(BASE + "/", wait_until="networkidle")
    ok("verified first task linked from case", p.locator('.task-link a[href="/start/#first-task"]').count() == 1)
    ok("hero compatibility legend", "Native file" in p.locator(".ws-compat").text_content())

    p.goto(BASE + "/how-it-works/", wait_until="networkidle")
    ok("compatibility matrix", "No dedicated projection" in p.locator("#compatibility").text_content())
    ok("compatibility keyboard region", p.locator(".compat-wrap").get_attribute("tabindex") == "0")
    ok("Antigravity not overclaimed", "Not referenced by framework docs" in p.locator("#compatibility").text_content())

    p.goto(BASE + "/trust/", wait_until="networkidle")
    ok("trust sources pinned", p.locator('.ev-src[href*="3903339"]').count() >= 4)
    ok("journal source path", p.locator('.ev-src[href$="/src/arqux/journal.py"]').count() == 1)
    ok("evidence export source", p.locator('.ev-src[href$="/src/arqux/evidence_export.py"]').count() == 1)

    p.goto(BASE + "/community/", wait_until="networkidle")
    ok("contribution requirements", "minimal reproduction" in p.locator("#channels").text_content())
    ok("compatibility contribution path", "compatibility reports" in p.locator("#channels").text_content())

    p.goto(BASE + "/explore/", wait_until="networkidle")
    ok("explore key terms", "Governance context" in p.locator(".artifact-vocab").text_content())

    p.goto(BASE + "/", wait_until="networkidle")
    ok("EN architecture project is container", "The project contains six pieces" in p.locator("#architecture").text_content())
    ok("EN architecture count note", "six pieces are inside" in p.locator(".arch-count-note").text_content())
    p.goto(BASE + "/how-it-works/", wait_until="networkidle")
    ok("EN learning transformation visible", "Criterion available" in p.locator("#learning").text_content())
    p.goto(BASE + "/start/", wait_until="networkidle")
    ok("EN first task result", "first-task.txt" in p.locator("#first-task").text_content())
    ok("EN first task conditions", "timelog" in p.locator("#first-task").text_content())

    p.goto(BASE + "/es/", wait_until="networkidle")
    ok("architecture project is container", "El proyecto contiene seis piezas" in p.locator("#architecture").text_content())
    ok("architecture count note", "seis piezas están dentro" in p.locator(".arch-count-note").text_content())

    p.goto(BASE + "/es/como-funciona/", wait_until="networkidle")
    ok("learning transformation visible", "Criterio disponible" in p.locator("#learning").text_content())

    p.goto(BASE + "/es/empezar/", wait_until="networkidle")
    ok("first task result", "first-task.txt" in p.locator("#first-task").text_content())
    ok("first task conditions", "timelog" in p.locator("#first-task").text_content())


    p.goto(BASE + "/", wait_until="networkidle")
    ok("install CTA", p.locator('header .nav-actions a[href="/start/#channels"]').inner_text().strip() == "Install")
    ok("palette placeholder honest", p.locator("#palette-input").get_attribute("placeholder") == "Jump to a section or switch language")
    ok("palette button honest", p.locator(".palette-btn").get_attribute("aria-label") == "Jump to ⌘K — sections and language")
    ok("H4 view names", "Six project pieces" in p.locator("#architecture").text_content() and "Six task dimensions" in p.locator("#architecture").text_content())
    p.emulate_media(media="print"); p.wait_for_timeout(100)
    ok("print reveals case", p.locator("#task .flow li").first.evaluate("el=>getComputedStyle(el).opacity") == "1")
    p.emulate_media(media="screen")

    p.goto(BASE + "/start/", wait_until="networkidle")
    ok("install profiles", "Recommended for a first look" in p.locator("#channels").text_content() and "For developing" in p.locator("#channels").text_content())
    ok("step grid has no hole", len(p.locator("#first .trust-grid").evaluate("el=>getComputedStyle(el).gridTemplateColumns").split()) == 1)
    ok("connect section", "claude_desktop_config.json" in p.locator("#connect").text_content() and "opencode --instructions" in p.locator("#connect").text_content())
    ok("connect nav link", p.locator('a[href="/start/#connect"]').count() >= 1)

    p.goto(BASE + "/community/", wait_until="networkidle")
    ok("community signals", p.locator(".community-signals a").count() >= 3 and "CHANGELOG" in p.locator(".community-signals").inner_html())


    p.goto(BASE + "/", wait_until="networkidle")
    ok("palette title honest", p.locator(".palette-btn").get_attribute("title") == "Jump to · ⌘K")
    p.goto(BASE + "/start/", wait_until="networkidle")
    ok("verification freshness", "HEAD may be newer" in p.locator("#first-task").text_content())
    ok("MCP source pinned", "docs/en/guias/despliegue.md" in p.locator("#connect a").last.get_attribute("href"))
    r = p.goto(BASE + "/assets/tokens.css", wait_until="domcontentloaded")
    ok("tokens candidate retired", r.status == 404)
    p.goto(BASE + "/404.html", wait_until="networkidle")
    ok("404 install CTA", p.locator('a.button-primary[href="/start/#channels"]').inner_text() == "Install")
    ok("404 internal links stay in tab", p.locator('a[href^="/"][target="_blank"]').count() == 0)


    p.goto(BASE + "/", wait_until="networkidle")
    p.keyboard.press("Control+k"); p.wait_for_timeout(150); p.locator("#palette-input").focus()
    ok("palette focus ring", p.locator("#palette-input").evaluate("el=>getComputedStyle(el).outlineStyle+' '+getComputedStyle(el).outlineWidth") == "solid 2px")
    p.keyboard.press("Escape")
    p.locator(".source-chips button").first.focus(); p.wait_for_timeout(80)
    ok("source chip focus ring", p.locator(".source-chips button").first.evaluate("el=>getComputedStyle(el).outlineStyle+' '+getComputedStyle(el).outlineWidth") == "solid 2px")

    p.goto(BASE + "/how-it-works/", wait_until="networkidle")
    dims = p.locator(".hex-node")
    dims.first.focus(); p.keyboard.press("ArrowRight"); p.wait_for_timeout(150)
    ok("hex arrow navigation", p.evaluate("document.activeElement.dataset.dimension") == "1")

    p.goto(BASE + "/start/", wait_until="networkidle")
    ok("timelog warning explained", "timelog coverage" in p.locator("#first-task").text_content())

    p.goto(BASE + "/404.html", wait_until="networkidle")
    ok("404 useful exits", p.locator('a[href="/how-it-works/"]').count() == 1 and p.locator('a[href="/explore/"]').count() == 1)

    ctx.close(); b.close()

ok("no page errors", len(errs) == 0)
print("\n".join(results)); print("----"); print("TOTAL", len(results), "FAILURES", len(failures))
sys.exit(1 if failures else 0)
