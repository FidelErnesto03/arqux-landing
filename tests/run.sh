#!/usr/bin/env bash
set -euo pipefail
for t in t16_verify t18_verify t20_verify t21_verify; do
  printf '%-14s ' "$t"
  python3 "tests/$t.py"
done
