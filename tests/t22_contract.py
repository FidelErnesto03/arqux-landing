"""Editorial contract: 4 pairs, flat nav, no dead layers, budget, parity."""
import sys,os,re
from playwright.sync_api import sync_playwright
BASE="http://127.0.0.1:8137"; results=[]; failures=[]
def ok(n,c): results.append(("PASS " if c else "FAIL ")+n); failures.append(n) if not c else None
pairs=[("/","/es/"),("/reference/","/es/referencia/"),("/start/","/es/empezar/"),("/trust/","/es/confianza/")]
with sync_playwright() as pw:
    try: b=pw.chromium.launch(channel="chrome")
    except Exception: b=pw.chromium.launch()
    p=b.new_page(viewport={"width":1440,"height":900})
    for en,es in pairs:
        p.goto(BASE+en,wait_until="networkidle"); a=p.locator("main section").count(); h=p.locator("h1").count()
        p.goto(BASE+es,wait_until="networkidle"); bb=p.locator("main section").count(); hh=p.locator("h1").count()
        ok(f"parity {en}",a==bb and h==hh==1)
    p.goto(BASE+"/",wait_until="networkidle")
    ok("no dead layers",p.locator(".palette,.progress-rail,.nav-group,.wsboard").count()==0)
    ok("footer community",p.locator('footer#community').count()==1)
    ok("old routes absent from nav",p.locator('.nav-links a[href*="how-it-works"],.nav-links a[href*="explore"],.nav-links a[href*="codec"]').count()==0)
    p.goto(BASE+"/reference/",wait_until="networkidle")
    ok("print case",p.locator("#task").count()==0)  # reference has no case
    b.close()
size=os.path.getsize("assets/style.css")+os.path.getsize("assets/app.js")
ok("css+js budget",size<=78000)
ok("sitemap 8",len(re.findall(r"<loc>",open("sitemap.xml").read()))==8)
ok("community footer ES",'id="community"' in open("es/index.html").read())
print("\n".join(results)); print("----"); print("TOTAL",len(results),"FAILURES",len(failures)); sys.exit(1 if failures else 0)
