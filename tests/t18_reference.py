"""Reference page checks: workflow, artifacts, dimensions, format."""
import sys
from playwright.sync_api import sync_playwright
BASE="http://127.0.0.1:8137"; results=[]; failures=[]
def ok(n,c): results.append(("PASS " if c else "FAIL ")+n); failures.append(n) if not c else None
with sync_playwright() as pw:
    try: b=pw.chromium.launch(channel="chrome")
    except Exception: b=pw.chromium.launch()
    p=b.new_page(viewport={"width":1440,"height":950}); errs=[]
    p.on("pageerror",lambda e: errs.append(str(e))); p.on("console",lambda m: errs.append(m.text) if m.type=="error" else None)
    r=p.goto(BASE+"/reference/",wait_until="networkidle"); p.wait_for_timeout(300)
    ok("reference 200",r.status==200); ok("reference H1","reviewable work" in p.locator("h1").text_content())
    ok("reference nav",p.locator(".ref-nav a").count()==5)
    ok("workflow stages",p.locator("#workflow .step").count()==4)
    p.locator('[data-wf-view="map"]').click(); p.wait_for_timeout(200); ok("workflow map opens",p.locator(".wf-map").is_visible())
    ok("learning section",p.locator("#learning .learning-transform").count()==1)
    ok("six dimensions",p.locator("#dimensions .hex-node").count()==6)
    ok("seven artifacts",p.locator("#artifacts .artifact-node").count()==7)
    p.locator('#artifacts .artifact-node[data-artifact="1"]').click(); p.wait_for_timeout(200)
    ok("artifact selection",p.locator("#art-title").text_content()=="meta-brain.cortex")
    ok("codec comparator",p.locator("#format .code-panel").count()==2)
    ok("codec certificate",p.locator("#format .codec-certificate a").count()==1)
    ok("compatibility table",p.locator("#compatibility .compat-table tbody tr").count()==5)
    ok("no console errors",len(errs)==0)
    m=b.new_page(viewport={"width":320,"height":844}); m.goto(BASE+"/reference/",wait_until="networkidle")
    ok("mobile no overflow",m.evaluate("document.documentElement.scrollWidth-window.innerWidth")==0); m.close()
    b.close()
print("\n".join(results)); print("----"); print("TOTAL",len(results),"FAILURES",len(failures)); sys.exit(1 if failures else 0)
