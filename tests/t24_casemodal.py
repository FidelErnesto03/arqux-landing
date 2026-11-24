"""Case deck: the list flips in place to the detail of the chosen item."""
import sys
from playwright.sync_api import sync_playwright
BASE="http://127.0.0.1:8137"; results=[]; failures=[]
def ok(n,c):
    results.append(("PASS " if c else "FAIL ")+n)
    if not c: failures.append(n)

FLIPPED="()=>document.querySelector('.failure-deck').classList.contains('is-flipped')"
DECK_H="()=>Math.round(document.querySelector('.failure-deck').getBoundingClientRect().height)"

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
        ok(lang+" deck present",p.locator(".failure-deck").count()==1)
        ok(lang+" two faces",p.locator(".failure-face--front").count()==1 and p.locator(".failure-face--back").count()==1)
        ok(lang+" dialog gone",p.locator("#case-dialog").count()==0)
        ok(lang+" starts on the list",not p.evaluate(FLIPPED))
        ok(lang+" back hidden from AT",p.locator(".failure-face--back").get_attribute("aria-hidden")=="true")
        ok(lang+" triggers collapsed",p.locator(".case-open[aria-expanded='false']").count()==5)
        p.locator("#failures").scroll_into_view_if_needed(); p.wait_for_timeout(1550)
        h_front=p.evaluate(DECK_H)

        box=p.locator(".case-desc").first.bounding_box()
        p.mouse.click(box["x"]+30,box["y"]+12); p.wait_for_timeout(750)
        ok(lang+" whole item clickable",p.evaluate(FLIPPED))
        p.keyboard.press("Escape"); p.wait_for_timeout(750)
        ok(lang+" escape flips back",not p.evaluate(FLIPPED))

        p.locator(".case-open").nth(2).click(); p.wait_for_timeout(750)
        ok(lang+" flips on click",p.evaluate(FLIPPED))
        ok(lang+" height stable",abs(p.evaluate(DECK_H)-h_front)<=1)
        ok(lang+" front hidden from AT",p.locator(".failure-face--front").get_attribute("aria-hidden")=="true")
        ok(lang+" back exposed",p.locator(".failure-face--back").get_attribute("aria-hidden") is None)
        ok(lang+" trigger expanded",p.locator(".case-open").nth(2).get_attribute("aria-expanded")=="true")
        ok(lang+" kicker names mechanism",len(p.locator(".case-back-mech").text_content().strip())>4 and p.locator(".case-back-mech").text_content().strip()==p.locator(".failure-case").nth(2).locator(".case-mech").text_content().strip())
        ok(lang+" position counter","03 / 05" in p.locator(".case-back-num").text_content())
        ok(lang+" why label kept",len(p.locator(".case-back-ask").text_content())>8)
        ok(lang+" title",len(p.locator(".case-back-title").text_content())>8)
        ok(lang+" original description kept",len(p.locator(".case-back-desc").text_content())>40)
        ok(lang+" complementary info",len(p.locator(".case-back-extra").text_content())>40)
        ok(lang+" readable text",p.locator(".case-back-desc").evaluate("el=>parseFloat(getComputedStyle(el).fontSize)")>=15)
        ok(lang+" focus on close",p.evaluate("document.activeElement.classList.contains('case-back-close')"))

        p.keyboard.press("Escape"); p.wait_for_timeout(750)
        ok(lang+" escape closes",not p.evaluate(FLIPPED))
        ok(lang+" focus returns",p.evaluate("document.activeElement.className")=="case-open")
        ok(lang+" trigger collapsed again",p.locator(".case-open").nth(2).get_attribute("aria-expanded")=="false")

        p.locator(".case-open").nth(4).click(); p.wait_for_timeout(700)
        ok(lang+" fifth detail","05 / 05" in p.locator(".case-back-num").text_content())
        p.locator(".case-back-close").click(); p.wait_for_timeout(700)
        ok(lang+" close button works",not p.evaluate(FLIPPED))
        ok(lang+" no page errors",len(errs)==0)
        p.close()

    p=b.new_page(viewport={"width":390,"height":844})
    p.goto(BASE+"/",wait_until="networkidle")
    p.locator("#failures").scroll_into_view_if_needed(); p.wait_for_timeout(900)
    h0=p.evaluate(DECK_H)
    p.locator(".case-open").first.click(); p.wait_for_timeout(750)
    ok("mobile flips",p.evaluate(FLIPPED))
    ok("mobile no overflow",p.evaluate("document.documentElement.scrollWidth-window.innerWidth")==0)
    ok("mobile height stable",abs(p.evaluate(DECK_H)-h0)<=2)
    p.close()

    c=b.new_context(reduced_motion="reduce",viewport={"width":1440,"height":900})
    p=c.new_page(); p.goto(BASE+"/",wait_until="networkidle")
    p.locator("#failures").scroll_into_view_if_needed(); p.wait_for_timeout(500)
    ok("reduced case visible",p.locator(".case-desc").first.is_visible())
    p.locator(".case-open").first.click(); p.wait_for_timeout(250)
    ok("reduced flip works",p.evaluate(FLIPPED))
    ok("reduced no transition",p.locator(".failure-deck-inner").evaluate("el=>parseFloat(getComputedStyle(el).transitionDuration)")<0.02)
    c.close()

    c=b.new_context(java_script_enabled=False,viewport={"width":1440,"height":900})
    p=c.new_page(); p.goto(BASE+"/",wait_until="load")
    ok("no-JS five descriptions",p.locator(".case-desc").count()==5 and p.locator(".case-desc").first.is_visible())
    ok("no-JS stays on list",p.locator(".failure-face--front").is_visible())
    c.close()
    b.close()

print("\n".join(results)); print("----"); print("TOTAL",len(results),"FAILURES",len(failures))
sys.exit(1 if failures else 0)
