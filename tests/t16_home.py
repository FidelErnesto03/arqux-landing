"""Home simplification checks."""
import sys
from playwright.sync_api import sync_playwright
BASE="http://127.0.0.1:8137"; results=[]; failures=[]
def ok(n,c): results.append(("PASS " if c else "FAIL ")+n); failures.append(n) if not c else None
with sync_playwright() as pw:
    try: b=pw.chromium.launch(channel="chrome")
    except Exception: b=pw.chromium.launch()
    p=b.new_page(viewport={"width":1440,"height":900}); errs=[]
    p.on("pageerror",lambda e: errs.append(str(e))); p.on("console",lambda m: errs.append(m.text) if m.type=="error" else None)
    r=p.goto(BASE+"/",wait_until="networkidle"); p.wait_for_timeout(300)
    ok("home 200",r.status==200); ok("home H1","more than a result" in p.locator("h1").text_content())
    ok("static hero flow",p.locator(".hero-flow b").count()==3)
    ok("no board/palette/rail",p.locator("#wsboard,.palette,.progress-rail").count()==0)
    ok("case four stages",p.locator("#task .flow li").count()==4)
    ok("case links verified task",p.locator('.task-link a[href="/start/#first-task"]').count()==1)
    ok("three doors",p.locator("#next .trust-card").count()==3)
    ok("flat nav",p.locator(".nav-links a").count()==3)
    ok("no console errors",len(errs)==0)
    ctx=b.new_context(viewport={"width":320,"height":844}); q=ctx.new_page(); q.goto(BASE+"/es/",wait_until="networkidle")
    ok("ES mobile no overflow",q.evaluate("document.documentElement.scrollWidth-window.innerWidth")==0); ctx.close()
    ctx=b.new_context(viewport={"width":1200,"height":900},java_script_enabled=False); q=ctx.new_page(); q.goto(BASE+"/",wait_until="load")
    ok("no-JS case readable","The work ends" in q.locator("#task").text_content()); ctx.close()
    p.emulate_media(media="print"); p.wait_for_timeout(100)
    ok("print case visible",p.locator("#task .flow li").first.evaluate("el=>getComputedStyle(el).opacity")=="1")
    b.close()
print("\n".join(results)); print("----"); print("TOTAL",len(results),"FAILURES",len(failures)); sys.exit(1 if failures else 0)
