#!/usr/bin/env python3
"""Evidence capture for the UX v2 audit (deliverable §14.2.5).

Captures every primary route at desktop/tablet/mobile viewports plus key
interaction states, into docs/evidencia-ux-v2/ (outside the site repo).

Usage: python3 tools/shoot_evidence.py [--base http://127.0.0.1:8137]
"""
import sys
from pathlib import Path

BASE = "http://127.0.0.1:8137"
OUT = Path(__file__).resolve().parent.parent.parent / "docs" / "evidencia-ux-v2"

PAGES = [
    ("home-en", "/"), ("home-es", "/es/"),
    ("ref-en", "/reference/"), ("ref-es", "/es/referencia/"),
    ("start-en", "/start/"), ("start-es", "/es/empezar/"),
    ("trust-en", "/trust/"), ("trust-es", "/es/confianza/"),
]
VIEWPORTS = [("desktop", 1440, 900), ("mobile", 390, 844), ("small", 320, 640)]


def main():
    from playwright.sync_api import sync_playwright

    if "--base" in sys.argv:
        global BASE
        BASE = sys.argv[sys.argv.index("--base") + 1]
    OUT.mkdir(parents=True, exist_ok=True)
    shots = []
    with sync_playwright() as pw:
        try:
            b = pw.chromium.launch(channel="chrome")
        except Exception:
            b = pw.chromium.launch()
        for name, w, h in VIEWPORTS:
            for label, path in PAGES:
                pg = b.new_page(viewport={"width": w, "height": h}, device_scale_factor=1)
                errs = []
                pg.on("pageerror", lambda e: errs.append(str(e)))
                pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
                resp = pg.goto(BASE + path, wait_until="networkidle")
                pg.wait_for_timeout(400)
                overflow = pg.evaluate(
                    "document.documentElement.scrollWidth - window.innerWidth"
                )
                fn = OUT / f"{label}-{name}.png"
                pg.screenshot(path=str(fn), full_page=False)
                shots.append((label, name, resp.status if resp else 0, overflow, len(errs)))
                pg.close()
        # per-section captures: every editorial anchor, desktop + mobile
        sys.path.insert(0, str(Path(__file__).resolve().parent))
        import nav_build
        for page_key, secs in nav_build.SECTIONS.items():
            for lang, (base, _) in nav_build.PAGES[page_key].items():
                for sid, *_ in secs:
                    for name, w, h in (("desktop", 1440, 900), ("mobile", 390, 844)):
                        pg = b.new_page(viewport={"width": w, "height": h})
                        pg.goto(f"{BASE}{base}#{sid}", wait_until="networkidle")
                        pg.wait_for_timeout(1400)  # let smooth scroll + reveal settle
                        slug = f"{page_key}-{lang}-{sid}-{name}"
                        pg.screenshot(path=str(OUT / f"sec-{slug}.png"))
                        shots.append((f"sec:{slug}", name, 200, 0, 0))
                        pg.close()
        # interaction states on reference (desktop + mobile menu open)
        pg = b.new_page(viewport={"width": 1440, "height": 900})
        pg.goto(BASE + "/es/referencia/", wait_until="networkidle")
        pg.locator(".nav-entry", has_text="Referencia").first.hover()
        pg.wait_for_timeout(300)
        pg.screenshot(path=str(OUT / "state-nav-submenu-desktop.png"))
        pg.goto(BASE + "/es/referencia/#artifacts", wait_until="networkidle")
        pg.wait_for_timeout(700)
        pg.screenshot(path=str(OUT / "state-scrollspy-artifacts.png"))
        pg.close()
        m = b.new_page(viewport={"width": 390, "height": 844})
        m.goto(BASE + "/es/referencia/", wait_until="networkidle")
        m.locator(".menu-toggle").click()
        m.wait_for_timeout(300)
        m.screenshot(path=str(OUT / "state-nav-open-mobile.png"))
        m.locator(".nav-entry", has_text="Referencia").first.locator(".nav-sub-toggle").click()
        m.wait_for_timeout(250)
        m.screenshot(path=str(OUT / "state-nav-accordion-mobile.png"))
        m.close()
        b.close()
    print(f"{'page':10} {'vp':8} {'http':4} {'overflow':8} {'jserr':5}")
    bad = 0
    for label, name, status, overflow, nerr in shots:
        flag = "" if (status == 200 and overflow <= 1 and nerr == 0) else "  <-- CHECK"
        if flag:
            bad += 1
        print(f"{label:10} {name:8} {status:<4} {overflow:<8} {nerr:<5}{flag}")
    print(f"shots -> {OUT} ({len(shots)} pages + 4 states, {bad} flagged)")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
