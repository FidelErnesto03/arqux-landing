"""Start and Trust checks."""
import sys
from playwright.sync_api import sync_playwright
BASE="http://127.0.0.1:8137"; results=[]; failures=[]
def ok(n,c): results.append(("PASS " if c else "FAIL ")+n); failures.append(n) if not c else None
with sync_playwright() as pw:
    try: b=pw.chromium.launch(channel="chrome")
    except Exception: b=pw.chromium.launch()
    ctx=b.new_context(viewport={"width":1440,"height":900},permissions=["clipboard-read","clipboard-write"]); p=ctx.new_page()
    p.goto(BASE+"/start/",wait_until="networkidle")
    ok("two channels",p.locator("#channels .trust-card").count()==2)
    ok("channel profiles","Recommended for a first look" in p.locator("#channels").text_content() and "For developing" in p.locator("#channels").text_content())
    ok("first run cards removed",p.locator("#first").count()==0)
    ok("first task verified","4340d832" in p.locator("#first-task").text_content())
    ok("connect recipes",p.locator("#connect .connect-card").count()==3)
    p.locator(".copy-btn").nth(1).click(); p.wait_for_timeout(200)
    ok("source copy includes checkout","git checkout 3903339" in p.evaluate("navigator.clipboard.readText()"))
    ctx.close()
    p=b.new_page(viewport={"width":1440,"height":900}); p.goto(BASE+"/trust/",wait_until="networkidle")
    order=p.evaluate("[...document.querySelectorAll('main > section')].map(s=>s.id).join(',')")
    ok("trust order","intro,trust,evidence,limits,continue"==order)
    ok("trust sources",p.locator(".ev-src[href*='3903339']").count()>=6)
    ok("limits present",p.locator("#limits .limits-card").count()==1)
    b.close()
print("\n".join(results)); print("----"); print("TOTAL",len(results),"FAILURES",len(failures)); sys.exit(1 if failures else 0)
