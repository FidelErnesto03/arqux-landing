"""Nav map integrity (audit §2.3/T05): DOM sections <-> menu spec parity, ES/EN.

Verifies, without a browser:
- every page exposes all 21 section ids reachable from its own submenu
- the rendered <nav> in each HTML file matches tools/nav_build.py output
- submenu order matches the editorial order in the spec
- every submenu href resolves to a real section id in the target page file
- no dead/orphan anchors inside .nav-sub
"""
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "tools"))
import nav_build  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
results = []
failures = []


def ok(name, cond):
    results.append(("PASS " if cond else "FAIL ") + name)
    if not cond:
        failures.append(name)


def section_ids(rel):
    html = (ROOT / rel).read_text(encoding="utf-8")
    return re.findall(r'<section[^>]*\bid="([^"]+)"', html)


def nav_block(rel):
    html = (ROOT / rel).read_text(encoding="utf-8")
    m = re.search(r'<nav class="nav-links" id="primary-navigation".*?</nav>', html, re.S)
    return m.group(0) if m else ""


# 1) rendered nav equals spec output for all 8 files
for rel, (page_key, lang) in nav_build.FILES.items():
    expected = nav_build.render_nav(page_key, lang, current=True)
    ok(f"nav matches spec {rel}", nav_block(rel) == expected)

# 2) each page's submenu lists exactly its own section ids, in spec order
for rel, (page_key, lang) in nav_build.FILES.items():
    ids = section_ids(rel)
    spec_ids = [s[0] for s in nav_build.SECTIONS[page_key]]
    ok(f"sections==spec {rel}", ids == spec_ids)
    block = nav_block(rel)
    own = re.search(rf'id="nav-sub-{page_key}"(.*?)</ul>', block, re.S)
    links = re.findall(r'href="([^"]+)"', own.group(1)) if own else []
    ok(f"submenu ids {rel}", [l.split("#")[1] for l in links] == spec_ids)

# 3) cross-page submenu hrefs point at real sections of the target file
PATH_TO_FILE = {base: rel for rel, (k, l) in nav_build.FILES.items()
                for base in [nav_build.PAGES[k][l][0]]}
for rel, (page_key, lang) in nav_build.FILES.items():
    block = nav_block(rel)
    for m in re.finditer(r'<a href="([^"]*#([\w-]+))">', block):
        href, anchor = m.group(1), m.group(2)
        path = href.split("#")[0] or "/"
        target = PATH_TO_FILE.get(path)
        ok(f"anchor route known {href}", target is not None)
        if target:
            ok(f"anchor {href} -> {target}", anchor in section_ids(target))

# 4) all 21 spec anchors exist in both languages of their page
for page_key, secs in nav_build.SECTIONS.items():
    for lang, (base, _) in nav_build.PAGES[page_key].items():
        rel = next(r for r, (k, l) in nav_build.FILES.items() if k == page_key and l == lang)
        ids = section_ids(rel)
        for sid, *_ in secs:
            ok(f"21-map {page_key}/{lang} #{sid}", sid in ids)

# 4b) floating section arrows present on every page (site-wide standard)
for rel in nav_build.FILES:
    html = (ROOT / rel).read_text(encoding="utf-8")
    ok(f"section-nav markup {rel}", 'class="section-nav"' in html and 'data-nav-dir="prev"' in html and 'data-nav-dir="next"' in html)

# 5) aria-current=page appears exactly once per page, on its own group
for rel, (page_key, lang) in nav_build.FILES.items():
    block = nav_block(rel)
    n = block.count('aria-current="page"')
    ok(f"one aria-current=page {rel}", n == 1 and f'href="{nav_build.PAGES[page_key][lang][0]}" aria-current="page"' in block)

print("\n".join(results))
print("----")
print("TOTAL", len(results), "FAILURES", len(failures))
sys.exit(1 if failures else 0)
