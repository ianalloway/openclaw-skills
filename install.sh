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

usage() {
  cat <<'EOFUSAGE'
Usage: install.sh [--dest DIR] [--bundle NAME | skill...]

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
    --) shift; SKILLS+=("$@"); break ;;
    -*) fail "Unknown option: $1" ;;
    *) SKILLS+=("$1"); shift ;;
  esac
done

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

STAGING="$(mktemp -d "$DEST/.openclaw-skills.XXXXXX")"
mkdir -- "$STAGING/new" "$STAGING/old"
cleanup() {
  for skill in "${SELECTED[@]}"; do
    backup="$STAGING/old/$skill"
    target="$DEST/$skill"
    if [[ -d "$backup" && ! -e "$target" && ! -L "$target" ]]; then
      if ! mv -- "$backup" "$target"; then
        echo "Backup preserved at $backup" >&2
        return
      fi
    fi
  done
  rm -rf -- "$STAGING"
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
for skill in "${SELECTED[@]}"; do
  cp -R -- "$ROOT/$skill" "$STAGING/new/$skill"
done

for skill in "${SELECTED[@]}"; do
  target="$DEST/$skill"
  backup="$STAGING/old/$skill"
  if [[ -d "$target" ]]; then mv -- "$target" "$backup"; fi
  if ! mv -- "$STAGING/new/$skill" "$target"; then
    if [[ -d "$backup" ]] && ! mv -- "$backup" "$target"; then
      trap - EXIT
      fail "Could not restore $target; its backup is preserved at $backup"
    fi
    fail "Could not install $skill"
  fi
  echo "Installed $skill -> $target"
done
