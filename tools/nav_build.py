#!/usr/bin/env python3
"""Canonical navigation spec for the ArqUX portal (audit contract §2.3).

Single source of truth for the global menu: 4 top-level pages, each with a
submenu listing every real <section id> of that page, in DOM order.

Usage:
    python3 tools/nav_build.py          # rewrite the <nav> block in all 8 pages
    python3 tools/nav_build.py --check  # verify pages match the spec (no writes)

The test suite (tests/t26_navmap.py) imports PAGES/SECTIONS from this module
to verify DOM <-> menu parity, so the menu can never drift from the markup.
"""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# page_key -> {lang: (base_path, top_label)}
PAGES = {
    "home": {
        "es": ("/es/", "Inicio"),
        "en": ("/", "Home"),
    },
    "reference": {
        "es": ("/es/referencia/", "Referencia"),
        "en": ("/reference/", "Reference"),
    },
    "start": {
        "es": ("/es/empezar/", "Primeros pasos"),
        "en": ("/start/", "Get started"),
    },
    "trust": {
        "es": ("/es/confianza/", "Confianza"),
        "en": ("/trust/", "Trust"),
    },
}

# page_key -> [(section_id, es_label, en_label)] in editorial reading order.
# IDs are the contract; the reference page uses the audit's proposed order
# (intro, workflow, dimensions, artifacts, learning, format, compatibility,
# continue). Keep in sync with the DOM of both language files.
SECTIONS = {
    "home": [
        ("top", "Qué es ArqUX", "What ArqUX is"),
        ("failures", "Cinco formas de ruptura", "Five ways context breaks"),
        ("local", "El costo de la ruptura", "The cost of a break"),
        ("next", "Explorar ArqUX", "Explore ArqUX"),
    ],
    "reference": [
        ("intro", "Introducción al modelo", "Introduction to the model"),
        ("workflow", "Flujo de trabajo", "Workflow"),
        ("dimensions", "Dimensiones de tarea", "Task dimensions"),
        ("artifacts", "Artefactos del proyecto", "Project artifacts"),
        ("learning", "Aprendizaje gobernado", "Governed learning"),
        ("format", "CORTEX y HCORTEX", "CORTEX and HCORTEX"),
        ("compatibility", "Integración y harnesses", "Integration and harnesses"),
        ("continue", "Continuar explorando", "Keep exploring"),
    ],
    "start": [
        ("intro", "Antes de comenzar", "Before you start"),
        ("channels", "Instalar ArqUX 1.0.0", "Install ArqUX 1.0.0"),
        ("first-task", "Primera tarea", "First task"),
        ("connect", "Conectar mi agente", "Connect your agent"),
    ],
    "trust": [
        ("intro", "Alcance de confianza", "Scope of trust"),
        ("trust", "Quién aplica qué", "Who applies what"),
        ("evidence", "Evidencia verificable", "Verifiable evidence"),
        ("limits", "Límites conocidos", "Known limits"),
        ("continue", "Siguiente paso", "Next step"),
    ],
}

# file -> (page_key, lang)
FILES = {
    "index.html": ("home", "en"),
    "es/index.html": ("home", "es"),
    "reference/index.html": ("reference", "en"),
    "es/referencia/index.html": ("reference", "es"),
    "start/index.html": ("start", "en"),
    "es/empezar/index.html": ("start", "es"),
    "trust/index.html": ("trust", "en"),
    "es/confianza/index.html": ("trust", "es"),
}

NAV_RE = re.compile(
    r'<nav class="nav-links" id="primary-navigation" aria-label="[^"]*">.*?</nav>',
    re.S,
)


def render_nav(page_key: str, lang: str, current: bool) -> str:
    """Render the global <nav> block for one page."""
    aria = "Navegación principal" if lang == "es" else "Main navigation"
    out = [f'<nav class="nav-links" id="primary-navigation" aria-label="{aria}">']
    for key, paths in PAGES.items():
        base, top_label = paths[lang]
        is_current = key == page_key
        current_attr = ' aria-current="page"' if (is_current and current) else ""
        sub_id = f"nav-sub-{key}"
        toggle_label = (
            f"Secciones de {top_label}" if lang == "es" else f"{top_label} sections"
        )
        out.append('  <div class="nav-entry">')
        out.append(
            f'    <a class="nav-top" href="{base}"{current_attr}>{top_label}</a>'
        )
        out.append(
            f'    <button class="nav-sub-toggle" type="button" aria-expanded="false"'
            f' aria-controls="{sub_id}" aria-label="{toggle_label}">'
            f'<svg width="10" height="6" viewBox="0 0 10 6" aria-hidden="true">'
            f'<path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6"'
            f' stroke-linecap="round" stroke-linejoin="round"/></svg></button>'
        )
        out.append(f'    <ul class="nav-sub" id="{sub_id}">')
        for sec_id, es_label, en_label in SECTIONS[key]:
            label = es_label if lang == "es" else en_label
            out.append(f'      <li><a href="{base}#{sec_id}">{label}</a></li>')
        out.append("    </ul>")
        out.append("  </div>")
    out.append("</nav>")
    return "\n".join(out)


def apply_file(rel: str, write: bool = True) -> bool:
    page_key, lang = FILES[rel]
    path = ROOT / rel
    html = path.read_text(encoding="utf-8")
    new_nav = render_nav(page_key, lang, current=True)
    new_html, n = NAV_RE.subn(lambda m: new_nav, html, count=1)
    if n != 1:
        print(f"FAIL {rel}: nav block not found", file=sys.stderr)
        return False
    if new_html == html:
        print(f"OK   {rel}: already up to date")
        return True
    if write:
        path.write_text(new_html, encoding="utf-8")
        print(f"WROTE {rel}")
        return True
    print(f"DIFF {rel}: nav block differs from spec", file=sys.stderr)
    return False


def main() -> int:
    write = "--check" not in sys.argv
    ok = all(apply_file(rel, write=write) for rel in FILES)
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
