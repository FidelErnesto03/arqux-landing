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
    ok("hero governance map",p.locator("object.hero-map").count()==1)
    ok("mobile governance map",p.locator(".hero-mobile-map a").count()==6)
    svgs=[f for f in p.frames if "arqux-governance" in f.url]
    ok("svg map loaded",len(svgs)==1)
    if svgs:
        ok("six svg dimensions",svgs[0].locator(".arqx-stage").count()==6)
        ok("map title",svgs[0].locator("#map-title").count()==1)
        ok("triad nodes",svgs[0].locator(".triad-node").count()==3)
        ok("no visible subtitles",svgs[0].locator(".stage-desc").count()==0)
        svgs[0].locator("#arqx-stage-identidad").hover(); p.wait_for_timeout(120)
        ok("lifted card",svgs[0].locator(".lift-card.is-on").count()==1)
        svgs[0].locator(".triad-node[data-triad=harness]").hover(); p.wait_for_timeout(120)
        ok("triad detail",svgs[0].locator(".triad-detail.is-on").count()==1)
    ok("no board/palette/rail",p.locator("#wsboard,.palette,.progress-rail").count()==0)
    ok("problem scene H2","It was decided" in p.locator("#local h2").text_content())
    ok("problem three sessions",p.locator("#local .loss-session").count()==3)
    ok("problem empty panel","No previous decision" in p.locator("#local .loss-session.is-empty").text_content())
    ok("problem verdict","lost a decision" in p.locator("#local .loss-verdict").text_content())
    ok("problem no CTA",p.locator("#local a,#local button").count()==0)
    ok("problem illustrative","Illustrative reconstruction" in p.locator("#local .loss-scene").text_content())
    ok("case four stages",p.locator("#task .flow li").count()==4)
    ok("case links verified task",p.locator('.task-link a[href="/start/#first-task"]').count()==1)
    ok("three doors",p.locator("#next .trust-card").count()==3)
    ok("flat nav",p.locator(".nav-links a").count()==3)
    ok("no console errors",len(errs)==0)
    ctx=b.new_context(viewport={"width":320,"height":844}); q=ctx.new_page(); q.goto(BASE+"/es/",wait_until="networkidle")
    ok("ES mobile no overflow",q.evaluate("document.documentElement.scrollWidth-window.innerWidth")==0); ctx.close()
    ctx=b.new_context(viewport={"width":1200,"height":900},java_script_enabled=False); q=ctx.new_page(); q.goto(BASE+"/",wait_until="load")
    ok("no-JS case readable","The work ends" in q.locator("#task").text_content()); ctx.close()
    p.emulate_media(media="print"); p.wait_for_timeout(600)
    ok("print case visible",p.locator("#task .flow li").first.evaluate("el=>getComputedStyle(el).opacity")=="1")
    b.close()
print("\n".join(results)); print("----"); print("TOTAL",len(results),"FAILURES",len(failures)); sys.exit(1 if failures else 0)
