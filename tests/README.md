# Portal regression checks

These scripts exercise the built portal over HTTP; they do not read the workspace.

Requirements: Python 3.11, Playwright for Python, and Google Chrome (the scripts use `channel="chrome"`).

```bash
# from the landing repository root
python3 -m http.server 8137
# in another terminal
python3 tests/t16_verify.py
python3 tests/t18_verify.py
python3 tests/t20_verify.py
python3 tests/t21_verify.py
python3 tests/t22_contract.py
# or run everything
./tests/run.sh
```

`t16` covers the home hero, case, palette and Spanish parity. `t18` covers the artifact explorer and start route. `t20` covers the short home, architecture map and all EN routes. `t21` covers the How-it-works mechanism map and dimensions. `t22` guards the editorial contract: projection unit, ES labels, pinned checkout, demo wording and section order.

Each script exits non-zero on failure and prints `TOTAL n FAILURES m`.
