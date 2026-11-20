#!/usr/bin/env bash
# Install OpenClaw skills from a checked-out copy of this repository.
set -euo pipefail

if [[ -z "${BASH_SOURCE[0]:-}" ]]; then
  echo "Clone this repository and run ./install.sh from the checkout." >&2
  exit 1
fi
ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
DEST="${OPENCLAW_SKILLS_DIR:-${HOME}/.openclaw/skills}"
BUNDLE=""
SKILLS=()
LIST=false

usage() {
  cat <<'EOFUSAGE'
Usage: install.sh [--dest DIR] [--bundle NAME | skill...]
       install.sh [--dest DIR] --list

Bundles:
  sports-bettor      sports-odds kelly-criterion bet-journal clv-journal
  crypto-watcher     crypto-price market-sentiment portfolio-rebalancer
  developer-tools   git-helper screenshot-annotator security-scanner judge-audit

Examples (run from a cloned checkout):
  ./install.sh sports-odds kelly-criterion bet-journal clv-journal
  ./install.sh --bundle sports-bettor
  ./install.sh --dest ../installed-skills --bundle crypto-watcher
EOFUSAGE
}

fail() {
  echo "Error: $*" >&2
  exit 1
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --bundle|--dest)
      [[ $# -ge 2 && -n "$2" && "$2" != --* ]] || fail "$1 requires a value"
      if [[ "$1" == --bundle ]]; then BUNDLE="$2"; else DEST="$2"; fi
      shift 2
      ;;
    -h|--help) usage; exit 0 ;;
    --list) LIST=true; shift ;;
    --) shift; SKILLS+=("$@"); break ;;
    -*) fail "Unknown option: $1" ;;
    *) SKILLS+=("$1"); shift ;;
  esac
done

if [[ "$LIST" == true ]]; then
  [[ -z "$BUNDLE" && ${#SKILLS[@]} -eq 0 ]] || fail "--list does not take a bundle or skill names"
  printf 'Skill\tStatus\n'
  for manifest in "$ROOT"/*/SKILL.md; do
    dir="${manifest%/SKILL.md}"
    name="${dir##*/}"
    [[ "$name" =~ ^[a-z0-9][a-z0-9-]*$ && ! -L "$dir" && -f "$manifest" && ! -L "$manifest" ]] || continue
    status=available
    if [[ -f "$DEST/$name/SKILL.md" ]]; then status=installed; fi
    printf '%s\t%s\n' "$name" "$status"
  done
  exit 0
fi

if [[ -n "$BUNDLE" ]]; then
  [[ ${#SKILLS[@]} -eq 0 ]] || fail "Choose a bundle or individual skills, not both"
  case "$BUNDLE" in
    sports-bettor) SKILLS=(sports-odds kelly-criterion bet-journal clv-journal) ;;
    crypto-watcher) SKILLS=(crypto-price market-sentiment portfolio-rebalancer) ;;
    developer-tools) SKILLS=(git-helper screenshot-annotator security-scanner judge-audit) ;;
    *) fail "Unknown bundle: $BUNDLE" ;;
  esac
fi

if [[ ${#SKILLS[@]} -eq 0 ]]; then
  usage >&2
  exit 1
fi

# Validate the entire request before touching any installed skill.
SELECTED=()
for skill in "${SKILLS[@]}"; do
  [[ "$skill" =~ ^[a-z0-9][a-z0-9-]*$ ]] || fail "Invalid skill name: $skill"
  src="$ROOT/$skill"
  [[ -d "$src" && ! -L "$src" && -f "$src/SKILL.md" && ! -L "$src/SKILL.md" ]] ||
    fail "Missing skill directory or SKILL.md: $skill"
  duplicate=false
  for selected in "${SELECTED[@]+${SELECTED[@]}}"; do
    if [[ "$selected" == "$skill" ]]; then duplicate=true; break; fi
  done
  if [[ "$duplicate" == false ]]; then SELECTED+=("$skill"); fi
done

mkdir -p -- "$DEST"
DEST="$(cd -- "$DEST" && pwd -P)"
[[ "$DEST" != "$ROOT" && "$DEST" != "$ROOT/"* ]] ||
  fail "Destination must be outside the source checkout"
for skill in "${SELECTED[@]}"; do
  target="$DEST/$skill"
  [[ "$ROOT" != "$target" && "$ROOT" != "$target/"* ]] ||
    fail "Destination would replace the source checkout: $target"
  [[ ! -L "$target" ]] || fail "Refusing to replace a symlink: $target"
  [[ ! -e "$target" || -d "$target" ]] || fail "Destination is not a directory: $target"
done

STAGING="$DEST/.openclaw-install.lock"
mkdir -m 700 -- "$STAGING" ||
  fail "Cannot reserve $STAGING. Check for another install or an interrupted update."
installing=false
cleanup() {
  if [[ "$installing" == true ]]; then
    for skill in "${SELECTED[@]}"; do
      target="$DEST/$skill"
      staged="$STAGING/new/$skill"
      backup="$STAGING/old/$skill"
      # A missing staged directory means this invocation moved it into place.
      if [[ ! -d "$staged" ]] && ! mv -- "$target" "$staged"; then
        echo "Could not undo $target. Recovery files preserved at $STAGING" >&2
        return
      fi
      if [[ -d "$backup" ]] && ! mv -- "$backup" "$target"; then
        echo "Could not restore $target. Recovery files preserved at $STAGING" >&2
        return
      fi
    done
  fi
  rm -rf -- "$STAGING"
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
mkdir -- "$STAGING/new" "$STAGING/old"
for skill in "${SELECTED[@]}"; do
  cp -R -- "$ROOT/$skill" "$STAGING/new/$skill"
done

installing=true
for skill in "${SELECTED[@]}"; do
  target="$DEST/$skill"
  if [[ -d "$target" ]]; then mv -- "$target" "$STAGING/old/$skill"; fi
  mv -- "$STAGING/new/$skill" "$target" || fail "Could not install $skill"
done
installing=false
for skill in "${SELECTED[@]}"; do
  echo "Installed $skill -> $DEST/$skill"
done
