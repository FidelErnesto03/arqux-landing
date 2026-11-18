#!/usr/bin/env bash
set -uo pipefail
fail=0
for t in t16_verify t18_verify t20_verify t21_verify t22_contract; do
  printf '%-14s ' "$t"
  python3 "tests/$t.py" || fail=1
done
exit "$fail"
