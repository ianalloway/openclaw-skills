# Developer Power Tools Bundle

Ship faster and sleep better: git workflows, annotated screenshots, dependency security checks, and LLM-judge audits.

## Skills in this bundle

- **[git-helper](../git-helper)** — Everyday branching, rebase, undo, and cleanup recipes
- **[screenshot-annotator](../screenshot-annotator)** — Capture and annotate UI for bug reports (macOS + Peekaboo)
- **[security-scanner](../security-scanner)** — npm/pip audits plus common OWASP-style pattern checks
- **[judge-audit](../judge-audit)** — Audit LLM-as-judge bias/consistency with juryrig (CLI + HttpJudge)

## Why these four together

Day-to-day engineering friction clusters around four gaps:

1. **Git muscle memory** — Detached HEAD, messy rebase, or "how do I undo that?" `git-helper` keeps the recipes close.
2. **Bug reports without context** — Screenshots without element IDs waste review time. `screenshot-annotator` marks up the UI.
3. **Silent dependency risk** — CVEs and leaked secrets slip through. `security-scanner` runs the quick checks before you merge.
4. **Untrusted LLM judges** — Eval scores that hide position/verbosity/injection bias. `judge-audit` runs juryrig before you promote a judge.

## Install

### Option A: install.sh

```bash
git clone https://github.com/ianalloway/openclaw-skills
cd openclaw-skills
./install.sh --bundle developer-tools
```

### Option B: Direct curl-pipe

```bash
curl -sL https://raw.githubusercontent.com/ianalloway/openclaw-skills/main/install.sh | \
  bash -s -- --bundle developer-tools
```

### Option C: Manual copy

```bash
cp -r git-helper screenshot-annotator security-scanner judge-audit ~/.openclaw/skills/
```

> `screenshot-annotator` requires macOS and Peekaboo: `brew install openclaw/tap/peekaboo`.

## Example usage

```bash
# Recover from a bad commit
$ git-helper undo-last-commit
# (see recipes for soft reset, reflog, and stash recovery)

# Annotate a bug screenshot
$ peekaboo see --annotate --path /tmp/bug.png

# Scan the current project
$ security-scanner .

# Audit an LLM-as-judge (MockJudge dry-run)
$ pip install juryrig && juryrig cases.json
```

## Author

Ian Alloway — [ianalloway.xyz](https://ianalloway.xyz) · [@ianallowayxyz](https://twitter.com/ianallowayxyz)
