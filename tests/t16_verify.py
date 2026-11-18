"""T-016 ad-hoc verification: harness selector, install chip, palette, spotlight, no-JS, contrast."""
import re, sys
from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:8137"
results, failures = [], []
def ok(name, cond):
    results.append(("PASS " if cond else "FAIL ") + name)
    if not cond: failures.append(name)

def cont(fg, bg):
    def ch(c):
        c /= 255.0
        return c/12.92 if c <= 0.03928 else ((c+0.055)/1.055)**2.4
    def lum(rgb): return 0.2126*ch(rgb[0])+0.7152*ch(rgb[1])+0.0722*ch(rgb[2])
    l1, l2 = sorted([lum(fg), lum(bg)], reverse=True)
    return (l1+0.05)/(l2+0.05)

with sync_playwright() as pw:
    try: b = pw.chromium.launch(channel="chrome")
    except Exception: b = pw.chromium.launch()

    # ---------- desktop EN ----------
    ctx = b.new_context(viewport={"width":1440,"height":950})
    ctx.grant_permissions(["clipboard-read", "clipboard-write"])
    p = ctx.new_page()
    errs = []
    p.on("pageerror", lambda e: errs.append(str(e)))
    p.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
    p.goto(BASE + "/", wait_until="networkidle")
    p.wait_for_timeout(800)

    # workspace board
    p.wait_for_timeout(7200)
    ok("slogan in place", "more than a result" in p.locator("h1").text_content())
    ok("continuity lead", "continuous across AI agents" in p.locator(".lead").text_content())
    ok("portable line", "keeps its course" in p.locator(".hero-portable").text_content())
    ok("channel board visible", p.locator("#wsboard").is_visible())
    ok("harness tabs count 5", p.locator(".ws-harness .h-tab").count() == 5)
    ok("default selection = Codex", p.locator('[data-ws-harness="codex"]').get_attribute("aria-pressed") == "true")
    ok("four declared requests", p.locator(".ws-req").count() == 4)
    ok("channel axis lit", p.locator(".ws-axis.is-live").count() == 1)
    ok("requests lit at the end", p.locator(".ws-req.is-live").count() == 4)
    ok("governance replies lit", p.locator(".ws-gov-chips span.is-live").count() == 5)
    ok("project continues", p.locator("#ws-project.is-live").count() == 1)
    ok("project mind lit", p.locator("#ws-mind.is-live").count() == 1)
    ok("project shows varied files", p.locator(".ws-files svg").count() == 6)
    ok("default narration", p.locator("#ws-say-count").text_content() == "7/7" and "Your project continues." in p.locator("#ws-say-text").text_content())
    ok("hint under the title", len(p.locator("#ws-say-hint").text_content().strip()) > 20)
    ok("technical details hidden by default", p.locator(".ws-req code").nth(0).is_hidden())
    p.locator("#ws-tech-btn").click(); p.wait_for_timeout(200)
    ok("technical details revealed", p.locator(".ws-req code").nth(0).is_visible() and p.locator("#ws-tech-btn").get_attribute("aria-expanded") == "true")
    p.locator("#ws-tech-btn").click(); p.wait_for_timeout(200)
    ok("technical details hidden again", p.locator(".ws-req code").nth(0).is_hidden())
    p.locator('.ws-req[data-ws-req="context"]').click(); p.wait_for_timeout(350)
    ok("manual jump: context = 4/7", p.locator("#ws-say-count").text_content() == "4/7" and "recalls the context" in p.locator("#ws-say-text").text_content())
    ok("manual jump lights two replies", p.locator(".ws-gov-chips span.is-live").count() == 2)
    ok("manual jump lights the project mind", p.locator("#ws-mind.is-live").count() == 1)
    p.locator('[data-ws-harness="cursor"]').click(); p.wait_for_timeout(350)
    ok("app click restarts the sequence at step 1", p.locator("#ws-say-count").text_content() == "1/7" and "You open your app." in p.locator("#ws-say-text").text_content())
    ok("cursor pressed", p.locator('[data-ws-harness="cursor"]').get_attribute("aria-pressed") == "true")
    p.locator(".ws-channel-head").click(); p.wait_for_timeout(350)
    ok("channel head lands on step 2", p.locator("#ws-say-count").text_content() == "2/7" and "connects to ArqUX" in p.locator("#ws-say-text").text_content())
    p.locator("#ws-project").click(); p.wait_for_timeout(350)
    ok("project lands on step 7", p.locator("#ws-say-count").text_content() == "7/7")
    p.locator('[data-ws-harness="cursor"]').click(); p.wait_for_timeout(7200)
    ok("harness click runs the full channel", p.locator("#ws-say-count").text_content() == "7/7" and p.locator(".ws-req.is-live").count() == 4)

    # task section
    ok("task section present", p.locator("#task").is_visible())
    ok("task has four stages", p.locator(".flow li").count() == 4)
    ok("source panel present", p.locator(".source-panel").count() == 1 and p.locator(".source-panel .source-chips button").count() == 6)
    p.locator('.source-chips button[data-ref="evidence"]').click(); p.wait_for_timeout(150)
    ok("reference links to the steps that use it", p.locator(".flow li.is-linked").count() == 3)
    p.locator('.source-chips button[data-ref="evidence"]').click(); p.wait_for_timeout(150)


    # palette: keyboard open
    p.keyboard.press("Control+k")
    p.wait_for_timeout(300)
    ok("palette opens with Ctrl+K", p.locator("#palette").is_visible())
    ok("palette input focused", p.evaluate("document.activeElement && document.activeElement.id") == "palette-input")
    total = p.locator(".palette-item").count()
    ok("palette lists available commands", total >= 5)
    # filter
    p.fill("#palette-input", "start")
    p.wait_for_timeout(200)
    ok("palette filter returns items", p.locator(".palette-item").count() >= 1)
    p.keyboard.press("Escape"); p.wait_for_timeout(200)
    ok("palette closes with Escape", p.locator("#palette").is_hidden())
    # Escape closes
    p.keyboard.press("Control+k"); p.wait_for_timeout(250)
    p.keyboard.press("Escape"); p.wait_for_timeout(200)
    ok("Escape closes palette", p.locator("#palette").is_hidden())
    # opener button
    p.locator(".palette-btn").click(); p.wait_for_timeout(250)
    ok("nav button opens palette", p.locator("#palette").is_visible())

    # contrast probes (composited)
    def comp(sel, prop="color", over=None):
        return p.evaluate("""([sel,prop])=>{
          const el=document.querySelector(sel); if(!el) return null;
          const cs=getComputedStyle(el);
          const m=cs[prop].match(/[\\d.]+/g); const fg=[+m[0],+m[1],+m[2]];
          const op=parseFloat(cs.opacity);
          const stack=[]; let n=el;
          while(n && n!==document.documentElement){const c=getComputedStyle(n).backgroundColor; const mm=c.match(/[\\d.]+/g);
            if(mm){const a=mm.length>3?+mm[3]:1; if(a>0){stack.push([+mm[0],+mm[1],+mm[2],a]); if(a>=1) break;}} n=n.parentElement;}
          let bg=[248,248,245];
          for(let i=stack.length-1;i>=0;i--){const L=stack[i]; bg=[L[0]*L[3]+bg[0]*(1-L[3]),L[1]*L[3]+bg[1]*(1-L[3]),L[2]*L[3]+bg[2]*(1-L[3])];}
          const eff=[fg[0]*op+bg[0]*(1-op),fg[1]*op+bg[1]*(1-op),fg[2]*op+bg[2]*(1-op)];
          return {eff,bg};
        }""", [sel, prop])
    for sel, need in [(".h-tab", 4.5), (".palette-btn", 4.5), (".ws-say-text", 4.5), (".palette-hint", 4.5)]:
        r = comp(sel)
        ratio = cont(r["eff"], r["bg"]) if r else 0
        ok(f"contrast {sel} >= {need} (got {ratio:.2f})", ratio >= need)
    ctx.close()

    # ---------- reduced motion: spotlight off, palette works ----------
    ctx = b.new_context(viewport={"width":1440,"height":950}, reduced_motion="reduce")
    p = ctx.new_page()
    p.goto(BASE + "/", wait_until="networkidle")
    ok("reduced-motion: board visible", p.locator("#wsboard").is_visible())
    p.keyboard.press("Control+k"); p.wait_for_timeout(250)
    ok("reduced-motion: palette opens", p.locator("#palette").is_visible())
    ctx.close()

    # ---------- no-JS ----------
    ctx = b.new_context(viewport={"width":1440,"height":950}, java_script_enabled=False)
    p = ctx.new_page()
    p.goto(BASE + "/", wait_until="load")
    ok("no-JS: board visible with tabs disabled", p.locator("#wsboard").is_visible() and p.locator(".h-tab").first.is_disabled())
    ok("no-JS: palette hidden", p.locator("#palette").is_hidden())
    ok("no-JS: palette button hidden", p.locator(".palette-btn").is_hidden())
    ok("no-JS: narration readable", "Your project continues." in p.locator(".ws-say-text").text_content())
    ctx.close()

    # ---------- ES mobile palette ----------
    ctx = b.new_context(viewport={"width":390,"height":844}, is_mobile=True, has_touch=True)
    p = ctx.new_page()
    p.goto(BASE + "/es/", wait_until="networkidle")
    p.wait_for_timeout(600)
    p.locator(".h-tab").nth(1).click(); p.wait_for_timeout(200)
    ok("ES: board localized", "gobernanza por MCP" in p.locator("#wsboard").get_attribute("aria-label") and p.locator(".ws-zone-label").text_content().strip().startswith("Aplicaciones de agente"))
    p.keyboard.press("Control+k"); p.wait_for_timeout(300)
    ok("ES: palette opens", p.locator("#palette").is_visible())
    ok("ES: palette localized tag", "ir" in p.locator(".palette-item").first.inner_text().lower())
    ok("ES: no horizontal overflow", p.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1"))
    ctx.close()

    ok("no console/page errors", len(errs) == 0)
    if errs: print("ERRORS:", " | ".join(errs[:5]))
    b.close()

print("\n".join(results))
print("----")
print("TOTAL", len(results), "FAILURES", len(failures))
sys.exit(1 if failures else 0)
