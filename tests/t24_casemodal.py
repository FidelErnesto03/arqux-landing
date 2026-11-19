"""Case detail modal: native dialog, focus, Escape, backdrop, EN/ES, reduced motion."""
import sys
from playwright.sync_api import sync_playwright
BASE="http://127.0.0.1:8137"; results=[]; failures=[]
def ok(n,c):
    results.append(("PASS " if c else "FAIL ")+n)
    if not c: failures.append(n)

with sync_playwright() as pw:
    try: b=pw.chromium.launch(channel="chrome")
    except Exception: b=pw.chromium.launch()

    for lang,url,mech in (("EN","/","INTERPRETATION"),("ES","/es/","INTERPRETACIÓN")):
        p=b.new_page(viewport={"width":1440,"height":900})
        errs=[]; p.on("pageerror",lambda e: errs.append(str(e)))
        p.goto(BASE+url,wait_until="networkidle")
        ok(lang+" five triggers",p.locator(".case-open").count()==5)
        ok(lang+" no numbers",p.locator(".case-num").count()==0)
        ok(lang+" no dashed lines",p.locator(".case-signal").count()==0)
        ok(lang+" dialog hidden",not p.locator("#case-dialog").evaluate("el=>el.open"))
        p.locator("#failures").scroll_into_view_if_needed(); p.wait_for_timeout(1550)

        box=p.locator(".case-desc").first.bounding_box()
        p.mouse.click(box["x"]+30,box["y"]+12); p.wait_for_timeout(260)
        ok(lang+" whole item clickable",p.locator("#case-dialog").evaluate("el=>el.open"))
        p.keyboard.press("Escape"); p.wait_for_timeout(150)
        p.locator(".case-open").first.click(); p.wait_for_timeout(260)
        ok(lang+" dialog opens",p.locator("#case-dialog").evaluate("el=>el.open"))
        ok(lang+" kicker names mechanism",mech in p.locator("#case-dialog-kicker").text_content().upper())
        ok(lang+" kicker numbered",p.locator("#case-dialog-kicker").text_content().strip().startswith("01"))
        ok(lang+" why label kept",len(p.locator("#case-dialog-ask").text_content())>8)
        ok(lang+" title",len(p.locator("#case-dialog-title").text_content())>8)
        ok(lang+" original description kept",len(p.locator("#case-dialog-desc").text_content())>40)
        ok(lang+" complementary info",len(p.locator("#case-dialog-extra").text_content())>40)
        ok(lang+" readable modal text",p.locator("#case-dialog-desc").evaluate("el=>parseFloat(getComputedStyle(el).fontSize)")>=18)
        ok(lang+" focus inside dialog",p.evaluate("document.activeElement.closest('#case-dialog')!==null"))

        p.keyboard.press("Escape"); p.wait_for_timeout(220)
        ok(lang+" escape closes",not p.locator("#case-dialog").evaluate("el=>el.open"))
        ok(lang+" focus returns",p.evaluate("document.activeElement.className")=="case-open")

        p.locator(".case-open").nth(4).click(); p.wait_for_timeout(220)
        ok(lang+" fifth case opens",p.locator("#case-dialog-title").text_content()!=p.locator("#failures .case-title b").first.text_content())
        p.locator(".case-dialog-close").click(); p.wait_for_timeout(220)
        ok(lang+" close button works",not p.locator("#case-dialog").evaluate("el=>el.open"))
        ok(lang+" no page errors",len(errs)==0)
        p.close()

    p=b.new_page(viewport={"width":390,"height":844})
    p.goto(BASE+"/",wait_until="networkidle")
    p.locator(".case-open").first.click(); p.wait_for_timeout(260)
    ok("mobile dialog fits",p.locator("#case-dialog").evaluate("el=>el.getBoundingClientRect().width<=window.innerWidth"))
    ok("mobile no overflow",p.evaluate("document.documentElement.scrollWidth-window.innerWidth")==0)
    p.close()

    c=b.new_context(reduced_motion="reduce",viewport={"width":1440,"height":900})
    p=c.new_page(); p.goto(BASE+"/",wait_until="networkidle")
    ok("reduced case visible",p.locator(".case-desc").first.is_visible())
    p.locator(".case-open").first.click(); p.wait_for_timeout(150)
    ok("reduced dialog works",p.locator("#case-dialog").evaluate("el=>el.open"))
    c.close()

    c=b.new_context(java_script_enabled=False,viewport={"width":1440,"height":900})
    p=c.new_page(); p.goto(BASE+"/",wait_until="load")
    ok("no-JS five descriptions",p.locator(".case-desc").count()==5 and p.locator(".case-desc").first.is_visible())
    ok("no-JS dialog closed",not p.locator("#case-dialog").evaluate("el=>el.open"))
    c.close()
    b.close()

print("\n".join(results)); print("----"); print("TOTAL",len(results),"FAILURES",len(failures))
sys.exit(1 if failures else 0)
