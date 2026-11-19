"""Home closure: single final section, routes, legacy anchors, i18n, no-JS."""
import sys
from playwright.sync_api import sync_playwright
BASE="http://127.0.0.1:8137"; results=[]; failures=[]
def ok(n,c):
    results.append(("PASS " if c else "FAIL ")+n)
    if not c: failures.append(n)

with sync_playwright() as pw:
    try: b=pw.chromium.launch(channel="chrome")
    except Exception: b=pw.chromium.launch()

    cases=(
      ("EN","/",["/reference/","/start/","/trust/"],["Understand the model","Try ArqUX","Review the evidence"]),
      ("ES","/es/",["/es/referencia/","/es/empezar/","/es/confianza/"],["Comprender el modelo","Probar ArqUX","Examinar la evidencia"]),
    )
    for lang,url,hrefs,labels in cases:
        p=b.new_page(viewport={"width":1440,"height":900})
        errs=[]; p.on("pageerror",lambda e: errs.append(str(e)))
        p.goto(BASE+url,wait_until="networkidle")
        ids=p.locator("main > section").evaluate_all("els=>els.map(e=>e.id)")
        ok(lang+" four sections",ids==["top","failures","local","next"])
        ok(lang+" closure before footer",p.evaluate("document.querySelector('#next').compareDocumentPosition(document.querySelector('footer'))&4")!=0)
        ok(lang+" no old task",p.locator("#anchors").count()==1 and p.locator(".flow-block,.source-panel").count()==0)
        ok(lang+" three native routes",p.locator("#next a.home-closure__route").count()==3)
        ok(lang+" verified task proof",p.locator("#next a.home-closure__proof").get_attribute("href")==("/start/#first-task" if lang=="EN" else "/es/empezar/#first-task"))
        ok(lang+" destinations",p.locator("#next .home-closure__route").evaluate_all("els=>els.map(e=>e.getAttribute('href'))")==hrefs)
        ok(lang+" intention labels",p.locator("#next .home-closure__label").evaluate_all("els=>els.map(e=>e.textContent.trim())")==labels)
        ok(lang+" legacy ids",p.evaluate("['anchors','architecture','workflow','dimensions','artifacts','cortex','quickstart','task','evidence','trust','platform'].every(id=>document.getElementById(id))"))
        ok(lang+" no stray English labels","Bookmarks" not in p.locator("main").text_content())
        if lang=="ES":
            ok("ES no untranslated Continue","Continue" not in p.locator("main").text_content())
        ok(lang+" three-line thesis",p.locator("#home-closure-title").evaluate("el=>el.innerHTML.split('<br>').length")==3)
        ok(lang+" governed context",("governed context" if lang=="EN" else "contexto gobernado") in p.locator("#next .home-closure__lead").text_content().lower())
        ok(lang+" no console errors",len(errs)==0)

        p.goto(BASE+url+"#task",wait_until="networkidle"); p.wait_for_timeout(500)
        ok(lang+" legacy #task lands on closure",p.evaluate("window.scrollY>100"))
        p.goto(BASE+url+"#workflow",wait_until="networkidle"); p.wait_for_timeout(500)
        ok(lang+" legacy #workflow lands on closure",p.evaluate("window.scrollY>100"))
        p.close()

    p=b.new_page(viewport={"width":1440,"height":900})
    p.goto(BASE+"/",wait_until="networkidle")
    p.locator("#next").scroll_into_view_if_needed(); p.wait_for_timeout(300)
    ok("keyboard focus route",p.locator(".home-closure__route").first.evaluate("el=>{el.focus();return document.activeElement===el}"))
    p.screenshot(path="/tmp/opencode/closure-desktop.png")
    p.close()

    for w,h in ((1440,900),(1366,768),(1024,768),(768,1024),(390,844),(320,640)):
        p=b.new_page(viewport={"width":w,"height":h})
        p.goto(BASE+"/",wait_until="networkidle")
        p.locator("#next").scroll_into_view_if_needed(); p.wait_for_timeout(200)
        ok(f"no overflow {w}x{h}",p.evaluate("document.documentElement.scrollWidth-window.innerWidth")==0)
        ok(f"routes visible {w}x{h}",p.locator(".home-closure__route").first.is_visible())
        if w in (1440,1366,390): p.screenshot(path=f"/tmp/opencode/closure-{w}.png")
        p.close()

    c=b.new_context(reduced_motion="reduce",viewport={"width":1440,"height":900})
    p=c.new_page(); p.goto(BASE+"/",wait_until="networkidle")
    ok("reduced motion text visible",p.locator("#next .home-closure__lead").is_visible())
    c.close()
    c=b.new_context(java_script_enabled=False,viewport={"width":1440,"height":900})
    p=c.new_page(); p.goto(BASE+"/",wait_until="load")
    ok("no-JS native links",p.locator("#next a.home-closure__route").count()==3 and p.locator("#next .home-closure__lead").is_visible())
    c.close()
    b.close()

print("\n".join(results)); print("----"); print("TOTAL",len(results),"FAILURES",len(failures))
sys.exit(1 if failures else 0)
