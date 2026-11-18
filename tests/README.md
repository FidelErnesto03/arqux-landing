# Portal regression checks (simplified portal)

The portal now has four primary pages plus 404: Home, Reference, Start and Trust. Community lives in the footer. Old routes redirect.

Requirements: Python 3.11, Playwright for Python, Google Chrome.

```bash
# from the landing repository root
python3 -m http.server 8137
# in another terminal
./tests/run.sh
```

- `t16_home` — Home: static flow, problem, case, three doors, no dead layers.
- `t18_reference` — Reference: workflow, learning, dimensions, artifact explorer, format and certificate.
- `t20_routes` — 8 primary routes, redirects, sitemap, mobile.
- `t21_start_trust` — channels, first task, connect, Trust order and sources.
- `t22_contract` — parity, flat nav, no palette/rail/submenus, CSS+JS budget.

Each script exits non-zero on failure and prints `TOTAL n FAILURES m`.
