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

```bash
git clone https://github.com/ianalloway/openclaw-skills
cd openclaw-skills
./install.sh --bundle developer-tools
```

Run from the checkout so the installer can copy every skill folder. The default
destination is `~/.openclaw/skills/`; use `--dest DIR` to choose another directory
outside the checkout. Existing selected skill folders are replaced.

`screenshot-annotator` requires macOS and Peekaboo; see the [skill instructions](../screenshot-annotator/SKILL.md).

## Example requests

These skills guide OpenClaw; the installer copies their instructions rather
than creating commands named `git-helper` or `security-scanner`.

- “Help me undo my last local commit while keeping its changes.”
- “Annotate this screenshot so I can describe the bug clearly.”
- “Scan this project's dependencies and source for common security issues.”
- “Run a local juryrig dry run on cases.json and explain the audit results.”

The underlying tools still need to be installed. For example, the judge-audit
workflow uses the actual `juryrig` CLI:

```bash
pip install juryrig
juryrig cases.json
```

## Author

Ian Alloway — [ianalloway.xyz](https://ianalloway.xyz) · [@ianallowayxyz](https://twitter.com/ianallowayxyz)
