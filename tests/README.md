# Portal regression checks (simplified portal)

The portal has four primary pages plus 404: Home, Reference, Start and Trust. Community lives in the footer. Old routes redirect. Navigation is generated from `tools/nav_build.py` — run it after changing section labels, then `python3 tools/nav_build.py --check`.

Requirements: Python 3.11, Playwright for Python, Google Chrome.

```bash
# from the landing repository root
python3 -m http.server 8137
# in another terminal
./tests/run.sh <group>
```

## Groups

Pick the smallest group that covers what you touched. `full` is the pre-push gate.

| Group | Files | Time | Use it when |
|---|---|---|---|
| `nav` | t26 | ~0.2s | you edited nav markup, section ids or `nav_build.py` — no browser needed |
| `home` | t16 | ~6s | you changed the home page only |
| `pages` | t18 t21 | ~17s | you changed reference, start or trust |
| `layout` | t16 t22 t25 | ~25s | you changed shared CSS, copy or the closure |
| `ui` | t24 t23 t20 | ~61s | you touched the flip deck, section nav or routing |
| `full` | all nine | ~98s | before commit/push (default when no group is given) |

## Files

- `t16_home` — Home: hero flow, cost map, five failure modes (flip deck), closure, no dead layers.
- `t18_reference` — Reference: workflow views, learning stations, six dimensions, artifact explorer, codec comparator/demo, compatibility tables.
- `t20_routes` — 8 primary routes, redirects, sitemap, mobile overflow.
- `t21_start_trust` — install channels, first task, connect routes, Trust order and sources.
- `t22_contract` — ES/EN parity, section counts, no dead layers, footer, CSS+JS budget, sitemap.
- `t23_sectionnav` — floating section navigation: visibility, counters, keyboard, no-JS, mobile bar.
- `t24_casemodal` — failure deck: list/detail faces, flip, stable height, close paths, focus, mobile, reduced motion.
- `t25_closure` — home closure contract: four sections, three routes, footer community.
- `t26_navmap` — navigation contract: generated nav matches `nav_build.py` spec, anchors resolve route→file→section, single `aria-current`. Structural, no browser, so it is cheap and always safe to run.

Each script exits non-zero on failure and prints `TOTAL n FAILURES m`.
