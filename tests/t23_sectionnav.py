"""Floating section navigation: order, a11y, manual scroll, viewports."""
import sys
from playwright.sync_api import sync_playwright
BASE="http://127.0.0.1:8137"; results=[]; failures=[]
def ok(n,c):
    results.append(("PASS " if c else "FAIL ")+n)
    if not c: failures.append(n)

def wait_count(p, expect, timeout=4000):
    """Wait for the counter to reach a value instead of sleeping a fixed time."""
    try:
        p.wait_for_function(
            "t => document.querySelector('.section-nav-count').textContent.trim()===t",
            arg=expect, timeout=timeout)
    except Exception:
        pass

def navclick(p, direction):
    p.mouse.move(p.viewport_size["width"]-20, p.viewport_size["height"]//2, steps=6)
    p.wait_for_timeout(300)
    p.locator(f'[data-nav-dir="{direction}"]').click()

SIG_DESK = """() => { const n=document.querySelector('.section-nav'), cs=getComputedStyle(n), nb=n.getBoundingClientRect(); const k=[...n.children].map(c=>{const b=c.getBoundingClientRect(); return [c.className.split(' ')[0],Math.round(b.width),Math.round(b.height),Math.round(b.top-nb.top)]}); return [cs.display,cs.gap,...k.flat()]; }"""
SIG_MOB = """() => { const n=document.querySelector('.section-nav'), cs=getComputedStyle(n), nb=n.getBoundingClientRect(); const k=[...n.children].map(c=>{const b=c.getBoundingClientRect(); return [c.className.split(' ')[0],Math.round(b.width),Math.round(b.height),Math.round(b.left-nb.left)]}); return [cs.display,...k.flat()]; }"""

with sync_playwright() as pw:
    try: b=pw.chromium.launch(channel="chrome")
    except Exception: b=pw.chromium.launch()

    for lang,url,names in (
        ("EN","/",["ArqUX","Five ways context breaks","The hidden cost of losing continuity","Closure"]),
        ("ES","/es/",["ArqUX","Cinco formas de romper el contexto","El costo invisible de perder continuidad","Cierre"]),
    ):
        p=b.new_page(viewport={"width":1440,"height":900})
        p.goto(BASE+url,wait_until="networkidle")
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
        p.mouse.move(1400,450,steps=5); p.wait_for_timeout(350)
        ok(lang+" one tooltip only",p.evaluate("""()=>[...document.querySelectorAll(".section-nav-btn")].every(b=>!b.getAttribute("title"))"""))
        ok(lang+" custom tooltip renders",p.locator('[data-nav-dir="next"]').evaluate("""b=>{const s=getComputedStyle(b,'::after');return parseFloat(s.opacity)>0.5 && s.borderRadius!=="0px"}"""))
        ok(lang+" hover visible",before!=after)
        ok(lang+" four steps",p.locator("main > section[id][data-section-name]").count()==4)
        ok(lang+" start count",p.locator(".section-nav-count").text_content().strip()=="01 / 04")
        ok(lang+" prev disabled at first",p.locator('[data-nav-dir="prev"]').is_disabled())
        ok(lang+" first title clear",p.locator("#top h1").bounding_box()["y"]>=70)

        navclick(p, "next"); wait_count(p,"02 / 04")
        ok(lang+" next count",p.locator(".section-nav-count").text_content().strip()=="02 / 04")
        ok(lang+" step 2 title clear",p.locator("#failures h2").bounding_box()["y"]>=70)
        ok(lang+" next label",names[2] in p.locator('[data-nav-dir="next"]').get_attribute("aria-label"))
        ok(lang+" url unchanged",p.url.rstrip("/").endswith(url.strip("/")) or p.url.rstrip("/").endswith("8137"))

        navclick(p, "prev"); wait_count(p,"01 / 04")
        ok(lang+" prev count",p.locator(".section-nav-count").text_content().strip()=="01 / 04")
        ok(lang+" prev disabled again",p.locator('[data-nav-dir="prev"]').is_disabled())

        for step in (2,3,4):
            navclick(p, "next"); wait_count(p,f"0{step} / 04")
        ok(lang+" last count",p.locator(".section-nav-count").text_content().strip()=="04 / 04")
        ok(lang+" next disabled at last",p.locator('[data-nav-dir="next"]').is_disabled())

        p.evaluate("window.scrollTo(0, document.querySelector('#local').offsetTop - 80)")
        wait_count(p,"03 / 04")
        ok(lang+" manual scroll count",p.locator(".section-nav-count").text_content().strip()=="03 / 04")

        p.evaluate("window.scrollTo(0,0)"); wait_count(p,"01 / 04")
        p.locator('[data-nav-dir="next"]').focus()
        p.keyboard.press("Enter"); wait_count(p,"02 / 04")
        ok(lang+" keyboard count",p.locator(".section-nav-count").text_content().strip()=="02 / 04")
        p.close()

    # component parity: identical rendered geometry on every primary route (parallel pages)
    routes=["/","/reference/","/start/","/trust/","/es/","/es/referencia/","/es/empezar/","/es/confianza/"]
    sig_desk=None; sig_mob=None
    # four pages at a time keeps the layout stable without paying full networkidle
    # serially for sixteen loads
    for start in range(0, len(routes), 4):
        batch=[]
        for r in routes[start:start+4]:
            for w,js in ((1440,SIG_DESK),(390,SIG_MOB)):
                pg=b.new_page(viewport={"width":w,"height":900 if w==1440 else 844})
                pg.goto(BASE+r,wait_until="networkidle")
                batch.append((r,w,js,pg))
        for r,w,js,pg in batch:
            sig=pg.evaluate(js)
            if w==1440:
                if sig_desk is None:
                    sig_desk=sig
                    ok("component baseline 1440",sig[0]=="grid" and sig[1]=="12px" and sig[2:]==["section-nav-btn",48,48,0,"section-nav-btn",48,48,60,"section-nav-count",62,27,120])
                ok("component parity 1440 "+r,sig==sig_desk)
            else:
                if sig_mob is None:
                    sig_mob=sig
                    ok("component baseline 390",sig[0]=="flex" and sig[1:]==["section-nav-btn",44,44,108,"section-nav-btn",44,44,238,"section-nav-count",62,27,164])
                ok("component parity 390 "+r,sig==sig_mob)
            pg.close()

    for w,h in ((1440,900),(1366,768),(1024,768),(390,844),(320,640)):
        p=b.new_page(viewport={"width":w,"height":h})
        p.goto(BASE+"/",wait_until="domcontentloaded")
        ok(f"no overflow {w}x{h}",p.evaluate("document.documentElement.scrollWidth-window.innerWidth")==0)
        ok(f"nav on screen {w}x{h}",p.locator(".section-nav").is_visible())
        ok(f"no clipped h1 {w}x{h}",p.locator("#top h1").is_visible())
        p.close()

    c=b.new_context(reduced_motion="reduce",viewport={"width":1440,"height":900})
    p=c.new_page(); p.goto(BASE+"/",wait_until="domcontentloaded")
    navclick(p, "next"); p.wait_for_timeout(300)
    ok("reduced motion immediate",p.locator(".section-nav-count").text_content().strip()=="02 / 04")
    c.close()

    c=b.new_context(java_script_enabled=False,viewport={"width":1440,"height":900})
    p=c.new_page(); p.goto(BASE+"/",wait_until="load")
    ok("no-JS nav hidden",not p.locator(".section-nav").is_visible())
    ok("no-JS content present",p.locator("#local .cost-card").count()==4 and p.locator("#local .cost-question").is_visible())
    c.close()
    b.close()

print("\n".join(results)); print("----"); print("TOTAL",len(results),"FAILURES",len(failures))
sys.exit(1 if failures else 0)
