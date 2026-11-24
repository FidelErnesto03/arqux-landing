"""Route matrix: 8 primary pages, redirects, sitemap, mobile."""
import sys,re,urllib.request
from playwright.sync_api import sync_playwright
BASE="http://127.0.0.1:8137"; results=[]; failures=[]
def ok(n,c): results.append(("PASS " if c else "FAIL ")+n); failures.append(n) if not c else None
primary=["/","/es/","/reference/","/es/referencia/","/start/","/es/empezar/","/trust/","/es/confianza/"]
old=[("/how-it-works/","/reference/#workflow"),("/es/como-funciona/","/es/referencia/#workflow"),("/explore/","/reference/#artifacts"),("/es/explorar/","/es/referencia/#artifacts"),("/codec-cortex/","/reference/#format"),("/es/codec-cortex/","/es/referencia/#format"),("/community/","/#community"),("/es/comunidad/","/es/#community")]
with sync_playwright() as pw:
    try: b=pw.chromium.launch(channel="chrome")
    except Exception: b=pw.chromium.launch()

    # primary pages: four at a time, results printed in route order
    for start in range(0, len(primary), 4):
        batch=[]
        for r in primary[start:start+4]:
            p=b.new_page(viewport={"width":1440,"height":900}); errs=[]
            p.on("pageerror",lambda e,errs=errs: errs.append(str(e)))
            p.on("console",lambda m,errs=errs: errs.append(m.text) if m.type=="error" else None)
            resp=p.goto(BASE+r,wait_until="networkidle")
            batch.append((r,resp,p,errs))
        for r,resp,p,errs in batch:
            ok("200 "+r,resp.status==200); ok("clean "+r,len(errs)==0)
            ok("nav4+18 "+r,p.locator(".nav-top").count()==4 and p.locator(".nav-sub a").count()==18); p.close()

    # old routes: verify the redirect landed
    batch=[]
    for path,target in old:
        p=b.new_page(); p.goto(BASE+path,wait_until="domcontentloaded"); batch.append((path,target,p))
    for path,target,p in batch:
        try: p.wait_for_url(lambda u: target.split('#')[0] in u, timeout=3000)
        except Exception: pass
        ok("redirect "+path,target in p.url); p.close()

    p=b.new_page(); r=p.goto(BASE+"/404.html",wait_until="domcontentloaded")
    ok("404",r.status==200); ok("404 branded","governed workspace" in p.locator("h1").text_content()); p.close()

    # mobile matrix: batched per width
    for w in (320,375):
        batch=[]
        for r in primary:
            p=b.new_page(viewport={"width":w,"height":844}); p.goto(BASE+r,wait_until="networkidle"); batch.append((r,p))
        for r,p in batch:
            ok(f"mobile {w} {r}",p.evaluate("document.documentElement.scrollWidth-window.innerWidth")==0); p.close()
    b.close()
xml=open("sitemap.xml").read(); locs=re.findall(r"<loc>(.*?)</loc>",xml)
ok("sitemap 8 urls",len(locs)==8)
ok("sitemap no old routes",not any(x in xml for x in ("how-it-works","explore/","codec-cortex","community/")))
print("\n".join(results)); print("----"); print("TOTAL",len(results),"FAILURES",len(failures)); sys.exit(1 if failures else 0)
