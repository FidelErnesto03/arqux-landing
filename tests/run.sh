#!/usr/bin/env bash
# Targeted regression runs. No argument = full suite (pre-push gate).
#
# Every file is independent: it prints "TOTAL n FAILURES m" and exits non-zero
# on failure. Groups exist so a layout tweak does not cost the whole ~108s.
set -uo pipefail
cd "$(dirname "$0")/.." || exit 1

fail=0
run() { for t in "$@"; do printf '%-16s ' "$t"; python3 "tests/$t.py" || fail=1; done; }

case "${1:-full}" in
  nav)    run t26_navmap ;;                                   # ~0.2s  structural, no browser
  home)   run t16_home ;;                                     # ~6s    home page only
  pages)  run t18_reference t21_start_trust ;;                # ~17s   reference, start, trust
  layout) run t16_home t22_contract t25_closure ;;            # ~25s   copy or layout changes
  ui)     run t24_casemodal t23_sectionnav t20_routes ;;      # ~70s   flip deck, section nav, routes
  full)   run t16_home t18_reference t20_routes t21_start_trust t22_contract \
              t23_sectionnav t24_casemodal t25_closure t26_navmap ;;   # ~108s
  *) cat <<'EOF'
usage: ./tests/run.sh [group]

  nav      t26                     ~0.2s   structural, no browser
  home     t16                     ~6s     home page only
  pages    t18 t21                 ~17s    reference, start, trust
  layout   t16 t22 t25             ~25s    copy or layout changes
  ui       t24 t23 t20             ~70s    flip deck, section nav, routes
  full     all                     ~108s   pre-push gate (default)
EOF
    exit 0 ;;
esac

exit "$fail"
