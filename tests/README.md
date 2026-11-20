# Portal regression checks (simplified portal)

The portal has four primary pages plus 404: Home, Reference, Start and Trust. Community lives in the footer. Old routes redirect. Navigation is generated from `tools/nav_build.py` — run it after changing section labels, then `python3 tools/nav_build.py --check`.

Requirements: Python 3.11, Playwright for Python, Google Chrome.

```bash
# from the landing repository root
python3 -m http.server 8137
# in another terminal
./tests/run.sh
```

- `t16_home` — Home: static flow, problem, five failure modes, three doors, no dead layers.
- `t18_reference` — Reference: workflow views, learning stations, six dimensions, artifact explorer, codec comparator/demo, compatibility tables.
- `t20_routes` — 8 primary routes, redirects, sitemap, mobile overflow.
- `t21_start_trust` — install channels, first task, connect routes, Trust order and sources.
- `t22_contract` — ES/EN parity, section counts, no dead layers, footer, CSS+JS budget, sitemap.
- `t23_sectionnav` — floating section navigation: visibility, counters, keyboard, no-JS, mobile bar.
- `t24_casemodal` — failure-case dialog: triggers, opener, escape/close, mobile fit, reduced motion.
- `t25_closure` — home closure contract: four sections, three routes, footer community.
- `t26_navmap` — navigation contract: generated nav matches `nav_build.py` spec, 21 anchors resolve route→file→section, single `aria-current`.

Each script exits non-zero on failure and prints `TOTAL n FAILURES m`.
