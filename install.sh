#!/usr/bin/env bash
# Install OpenClaw skills from this repo into a local skills directory.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
DEST="${OPENCLAW_SKILLS_DIR:-${HOME}/.openclaw/skills}"
BUNDLE=""

usage() {
  cat <<'EOF'
Usage: install.sh [--bundle NAME] [--dest DIR] [skill...]

Examples:
  ./install.sh sports-odds kelly-criterion bet-journal
  ./install.sh --bundle sports-bettor
  curl -sL https://raw.githubusercontent.com/ianalloway/openclaw-skills/main/install.sh | bash -s -- --bundle sports-bettor
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --bundle) BUNDLE="$2"; shift 2 ;;
    --dest) DEST="$2"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) break ;;
  esac
done

SKILLS=("$@")
if [[ -n "$BUNDLE" ]]; then
  case "$BUNDLE" in
    sports-bettor) SKILLS=(sports-odds kelly-criterion bet-journal) ;;
    *) echo "Unknown bundle: $BUNDLE" >&2; exit 1 ;;
  esac
fi

if [[ ${#SKILLS[@]} -eq 0 ]]; then
  usage
  exit 1
fi

mkdir -p "$DEST"
for skill in "${SKILLS[@]}"; do
  src="$ROOT/$skill"
  if [[ ! -d "$src" ]]; then
    echo "Missing skill directory: $skill" >&2
    exit 1
  fi
  rm -rf "$DEST/$skill"
  cp -R "$src" "$DEST/$skill"
  echo "Installed $skill -> $DEST/$skill"
done
