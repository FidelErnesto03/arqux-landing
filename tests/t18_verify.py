"""T-018 verification: artifact explorer, quickstart routes, contrast, no-JS."""
import sys
from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:8137"
results, failures = [], []
def ok(name, cond):
    results.append(("PASS " if cond else "FAIL ") + name)
    if not cond: failures.append(name)

def ratio(fg, bg):
    def ch(c):
        c /= 255.0
        return c/12.92 if c <= 0.03928 else ((c+0.055)/1.055)**2.4
    def lum(rgb): return 0.2126*ch(rgb[0])+0.7152*ch(rgb[1])+0.0722*ch(rgb[2])
    l1, l2 = sorted([lum(fg), lum(bg)], reverse=True)
    return (l1+0.05)/(l2+0.05)

with sync_playwright() as pw:
    try: b = pw.chromium.launch(channel="chrome")
    except Exception: b = pw.chromium.launch()

    ctx = b.new_context(viewport={"width": 1440, "height": 950})
    ctx.grant_permissions(["clipboard-read", "clipboard-write"])
    p = ctx.new_page()
    errs = []
    p.on("pageerror", lambda e: errs.append(str(e)))
    p.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
    p.goto(BASE + "/explore/", wait_until="networkidle")
    p.wait_for_timeout(700)

    # artifact explorer
    ok("artifacts section present", p.locator("#artifacts").count() == 1)
    ok("artifact tree has 7 nodes", p.locator(".artifact-node").count() == 7)
    ok("default artifact is AGENTS.md", p.locator("#art-title").text_content() == "AGENTS.md")
    p.locator('.artifact-node[data-artifact="3"]').click()
    p.wait_for_timeout(200)
    ok("selecting identities updates title", p.locator("#art-title").text_content() == "identities/")
    ok("verified badge reflects v1.0.0", "v1.0.0" in p.locator("#art-verified").text_content() and "7 contracts" in p.locator("#art-verified").text_content())
    ok("source link updated", "src/arqux/identities" in p.locator("#art-src").get_attribute("href"))
    ok("conceptual note present", "does not read your workspace" in p.locator("#artifacts .artifact-note").text_content())
    p.locator('.artifact-node[data-artifact="6"]').click()
    p.wait_for_timeout(150)
    ok("packages entry truthful", "Empty by default" in p.locator("#art-desc").text_content())

    # nav
    ok("nav links to explore route", p.locator('.nav-links a[href="/explore/"]').count() == 1)

    # contrast probes (composited)
    def probe(sel):
        return p.evaluate("""(sel)=>{
          const el=document.querySelector(sel); if(!el) return null;
          const cs=getComputedStyle(el);
          const m=cs.color.match(/[\\d.]+/g); const fg=[+m[0],+m[1],+m[2]];
          const op=parseFloat(cs.opacity);
          const stack=[]; let n=el;
          while(n && n!==document.documentElement){const c=getComputedStyle(n).backgroundColor; const mm=c.match(/[\\d.]+/g);
            if(mm){const a=mm.length>3?+mm[3]:1; if(a>0){stack.push([+mm[0],+mm[1],+mm[2],a]); if(a>=1) break;}} n=n.parentElement;}
          let bg=[248,248,245];
          for(let i=stack.length-1;i>=0;i--){const L=stack[i]; bg=[L[0]*L[3]+bg[0]*(1-L[3]),L[1]*L[3]+bg[1]*(1-L[3]),L[2]*L[3]+bg[2]*(1-L[3])];}
          const eff=[fg[0]*op+bg[0]*(1-op),fg[1]*op+bg[1]*(1-op),fg[2]*op+bg[2]*(1-op)];
          return {eff,bg};
        }""", sel)
    for sel, need in [(".artifact-node", 4.5), (".artifact-desc", 4.5), (".artifact-note", 4.5)]:
        r = probe(sel)
        val = ratio(r["eff"], r["bg"]) if r else 0
        ok(f"contrast {sel} >= {need} (got {val:.2f})", val >= need)
    ctx.close()

    # no-JS
    ctx = b.new_context(viewport={"width": 1440, "height": 950}, java_script_enabled=False)
    p = ctx.new_page()
    p.goto(BASE + "/start/", wait_until="load")
    ok("no-JS: start commands readable", "pip install arqux==0.9.0" in p.locator("body").text_content())
    ok("no-JS: source channel readable", "git clone https://github.com/FidelErnesto03/arqux" in p.locator("body").text_content())
    ctx.close()

    # ES mobile
    ctx = b.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True)
    p = ctx.new_page()
    p.goto(BASE + "/es/explorar/", wait_until="networkidle")
    p.wait_for_timeout(600)
    p.locator('.artifact-node[data-artifact="1"]').click()
    p.wait_for_timeout(200)
    ok("ES artifact localized", p.locator("#art-title").text_content() == "meta-brain.cortex" and "Memoria" in p.locator("#art-kind").text_content())
    ok("ES mobile: no horizontal overflow", p.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1"))
    ctx.close()

    ok("no console/page errors", len(errs) == 0)
    if errs: print("ERRORS:", " | ".join(errs[:5]))
    b.close()

print("\n".join(results))
print("----")
print("TOTAL", len(results), "FAILURES", len(failures))
sys.exit(1 if failures else 0)
