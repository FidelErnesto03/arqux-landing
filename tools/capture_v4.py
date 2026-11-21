"""Regenerate docs/evidencia-v4 reference captures (contract v4 + iter5 layout)."""
from playwright.sync_api import sync_playwright
from pathlib import Path

BASE = "http://127.0.0.1:8137"
OUT = Path(__file__).resolve().parent.parent / "docs" / "evidencia-v4"
SIZES = {"1440": (1440, 900), "1366": (1366, 768), "390": (390, 844), "320": (320, 640)}
MOBILE_SKIP = {"art-explorer", "learning-open", "compat-open"}  # absent at 320 in prior set


def shot_el(page, sel, name, size):
    el = page.locator(sel).first
    el.scroll_into_view_if_needed()
    page.wait_for_timeout(250)
    el.screenshot(path=str(OUT / f"ref-{size}-{name}.png"))


def shot_view(page, name, size, sel=None):
    if sel:
        page.evaluate("(s)=>document.querySelector(s).scrollIntoView({block:'start'})", sel)
    else:
        page.evaluate("window.scrollTo(0,0)")
    page.wait_for_timeout(350)
    page.screenshot(path=str(OUT / f"ref-{size}-{name}.png"))


def run(size, vw):
    w, h = vw
    with sync_playwright() as pw:
        try:
            b = pw.chromium.launch(channel="chrome")
        except Exception:
            b = pw.chromium.launch()
        p = b.new_page(viewport={"width": w, "height": h})
        errs = []
        p.on("pageerror", lambda e: errs.append(str(e)))
        p.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
        p.goto(f"{BASE}/reference/", wait_until="networkidle")
        p.wait_for_timeout(300)

        # --- workflow section (element + viewport) ---
        shot_el(p, "#workflow", "workflow", size)
        shot_view(p, "workflow-vp", size, "#workflow")
        # step dialog open (element)
        p.locator('#workflow .step[data-step="2"]').click()
        p.wait_for_timeout(350)
        shot_el(p, "#step-dialog", "step-dialog", size)
        p.keyboard.press("Escape")
        p.wait_for_timeout(200)

        # --- dimensions section (element) — let entrance animation finish ---
        p.locator("#dimensions").scroll_into_view_if_needed()
        p.evaluate("document.querySelector('#dimensions .hex-visual').scrollIntoView({block:'center'})")
        p.wait_for_timeout(1600)
        shot_el(p, "#dimensions", "dimensions", size)
        shot_el(p, "#dimensions .hex-visual", "dim-explorer", size)
        shot_view(p, "dimensions-vp", size, "#dimensions .hex-visual")

        # detail card open over menu (element + real viewport after scroll)
        p.locator('#dimensions .hex-node[data-dimension="2"]').click()
        p.wait_for_timeout(900)
        shot_el(p, "#dimensions .artifact-preview", "dim-overlay", size)
        shot_view(p, "dim-detail-vp", size, "#dimensions .hex-visual")
        p.locator("#dimensions .dim-preview-close").click()
        p.wait_for_timeout(1700)  # let replay finish before next shots
        shot_view(p, "dim-menu-back-vp", size, "#dimensions .hex-visual")

        # disclosure opened (element + viewport)
        p.locator("#dimensions details.ev-detail summary").click()
        p.wait_for_timeout(250)
        shot_el(p, "#dimensions details.ev-detail", "dim-disclosure", size)
        shot_view(p, "dim-disclosure-vp", size, "#dimensions details.ev-detail")

        # --- artifacts section (viewport) ---
        shot_view(p, "artifacts", size, "#artifacts")
        shot_view(p, "artifacts-learning", size, "#learning")
        if size not in ("320",):
            p.locator('#artifacts .artifact-node[data-artifact="1"]').click()
            p.wait_for_timeout(300)
            shot_view(p, "art-explorer", size, "#artifacts")
        # learning disclosure open
        if size not in ("320",):
            p.locator("#artifacts .learning-sequence details.ev-detail summary").first.click()
            p.wait_for_timeout(250)
            shot_view(p, "learning-open", size, "#artifacts .learning-sequence details.ev-detail")

        # --- format ---
        shot_view(p, "format", size, "#format")
        p.locator("#format details.ev-detail summary").click()
        p.wait_for_timeout(250)
        shot_view(p, "format-open-vp", size, "#format details.ev-detail")
        p.locator("#format details.ev-detail summary").click()
        p.wait_for_timeout(150)

        # --- compatibility ---
        shot_view(p, "compatibility", size, "#compatibility")
        if size not in ("320",):
            p.locator("#compatibility details.ev-detail summary").first.click()
            p.wait_for_timeout(250)
            shot_view(p, "compat-open", size, "#compatibility")
        shot_view(p, "compat-cta", size, "#continue")

        print(size, "console errors:", len(errs), errs[:2])
        b.close()


for size, vw in SIZES.items():
    run(size, vw)
print("done ->", OUT)
