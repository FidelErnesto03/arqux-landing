"""Floating section navigation: order, a11y, manual scroll, viewports."""
import sys
from playwright.sync_api import sync_playwright
BASE="http://127.0.0.1:8137"; results=[]; failures=[]
def ok(n,c):
    results.append(("PASS " if c else "FAIL ")+n)
    if not c: failures.append(n)

def navclick(p, direction):
    p.mouse.move(p.viewport_size["width"]-20, p.viewport_size["height"]//2, steps=6)
    p.wait_for_timeout(300)
    p.locator(f'[data-nav-dir="{direction}"]').click()

with sync_playwright() as pw:
    try: b=pw.chromium.launch(channel="chrome")
    except Exception: b=pw.chromium.launch()

    for lang,url,names in (
        ("EN","/",["ArqUX","Five ways context breaks","The interrupted decision","Closure"]),
        ("ES","/es/",["ArqUX","Cinco formas de romper el contexto","La decisión interrumpida","Cierre"]),
    ):
        p=b.new_page(viewport={"width":1440,"height":900})
        p.goto(BASE+url,wait_until="networkidle"); p.wait_for_timeout(300)
        ok(lang+" nav visible",p.locator(".section-nav").is_visible())
        p.mouse.move(720,450,steps=6); p.wait_for_timeout(300)
        ok(lang+" arrows ghost away from edge",p.locator(".section-nav").evaluate("el=>getComputedStyle(el).opacity")=="0.3")
        p.mouse.move(1400,450,steps=6); p.wait_for_timeout(350)
        ok(lang+" arrows appear near right edge",p.locator(".section-nav").evaluate("el=>getComputedStyle(el).opacity")=="1")
        p.mouse.move(720,450,steps=6); p.wait_for_timeout(300)
        ok(lang+" arrows point up/down",p.locator('[data-nav-dir="prev"] svg path').get_attribute("d")=="M6 15l6-6 6 6" and p.locator('[data-nav-dir="next"] svg path').get_attribute("d")=="M6 9l6 6 6-6")
        p.mouse.move(1400,180,steps=6); p.wait_for_timeout(250)
        before=p.locator('[data-nav-dir="next"]').evaluate("el=>getComputedStyle(el).backgroundColor")
        p.locator('[data-nav-dir="next"]').hover(); p.wait_for_timeout(220)
        after=p.locator('[data-nav-dir="next"]').evaluate("el=>getComputedStyle(el).backgroundColor")
        ok(lang+" hover visible",before!=after)
        ok(lang+" four steps",p.locator("main > section[id][data-section-name]").count()==4)
        ok(lang+" start count",p.locator(".section-nav-count").text_content().strip()=="01 / 04")
        ok(lang+" prev disabled at first",p.locator('[data-nav-dir="prev"]').is_disabled())
        ok(lang+" first title clear",p.locator("#top h1").bounding_box()["y"]>=70)

        navclick(p, "next"); p.wait_for_timeout(1400)
        ok(lang+" next count",p.locator(".section-nav-count").text_content().strip()=="02 / 04")
        ok(lang+" step 2 title clear",p.locator("#failures h2").bounding_box()["y"]>=70)
        ok(lang+" next label",names[2] in p.locator('[data-nav-dir="next"]').get_attribute("aria-label"))
        ok(lang+" url unchanged",p.url.rstrip("/").endswith(url.strip("/")) or p.url.rstrip("/").endswith("8137"))

        navclick(p, "prev"); p.wait_for_timeout(1400)
        ok(lang+" prev count",p.locator(".section-nav-count").text_content().strip()=="01 / 04")
        ok(lang+" prev disabled again",p.locator('[data-nav-dir="prev"]').is_disabled())

        for _ in range(3):
            navclick(p, "next"); p.wait_for_timeout(1250)
        ok(lang+" last count",p.locator(".section-nav-count").text_content().strip()=="04 / 04")
        ok(lang+" next disabled at last",p.locator('[data-nav-dir="next"]').is_disabled())

        p.evaluate("window.scrollTo(0, document.querySelector('#local').offsetTop - 80)")
        p.wait_for_timeout(500)
        ok(lang+" manual scroll count",p.locator(".section-nav-count").text_content().strip()=="03 / 04")

        p.evaluate("window.scrollTo(0,0)"); p.wait_for_timeout(400)
        p.locator('[data-nav-dir="next"]').focus()
        p.keyboard.press("Enter"); p.wait_for_timeout(1300)
        ok(lang+" keyboard count",p.locator(".section-nav-count").text_content().strip()=="02 / 04")
        p.close()

    for w,h in ((1440,900),(1366,768),(1024,768),(390,844),(320,640)):
        p=b.new_page(viewport={"width":w,"height":h})
        p.goto(BASE+"/",wait_until="networkidle"); p.wait_for_timeout(250)
        ok(f"no overflow {w}x{h}",p.evaluate("document.documentElement.scrollWidth-window.innerWidth")==0)
        ok(f"nav on screen {w}x{h}",p.locator(".section-nav").is_visible())
        ok(f"no clipped h1 {w}x{h}",p.locator("#top h1").is_visible())
        p.close()

    c=b.new_context(reduced_motion="reduce",viewport={"width":1440,"height":900})
    p=c.new_page(); p.goto(BASE+"/",wait_until="networkidle")
    navclick(p, "next"); p.wait_for_timeout(300)
    ok("reduced motion immediate",p.locator(".section-nav-count").text_content().strip()=="02 / 04")
    c.close()

    c=b.new_context(java_script_enabled=False,viewport={"width":1440,"height":900})
    p=c.new_page(); p.goto(BASE+"/",wait_until="load")
    ok("no-JS nav hidden",not p.locator(".section-nav").is_visible())
    ok("no-JS content present",p.locator("#local .loss-stakes").is_visible())
    c.close()
    b.close()

print("\n".join(results)); print("----"); print("TOTAL",len(results),"FAILURES",len(failures))
sys.exit(1 if failures else 0)
