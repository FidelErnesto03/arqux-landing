#!/usr/bin/env bash
set -uo pipefail
fail=0
for t in t16_home t18_reference t20_routes t21_start_trust t22_contract t23_sectionnav; do
  printf '%-16s ' "$t"
  python3 "tests/$t.py" || fail=1
done
exit "$fail"
