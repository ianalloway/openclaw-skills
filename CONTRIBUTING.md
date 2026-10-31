# Contributing to openclaw-skills

Thanks for your interest in contributing! This repo is a collection of **OpenClaw skill folders** (each with a `SKILL.md`) plus curated bundles and smoke tests — not an npm/Python application package.

## Getting Started

1. **Fork** this repo and create your branch from `main`
2. Branch naming: `feat/your-feature`, `fix/your-bug`, or `docs/your-docs`
3. Make your changes with clear, descriptive commits
4. **Test** locally before opening a PR (see below)
5. Open a Pull Request — fill out the template and describe your changes

## Development Setup

```bash
git clone https://github.com/ianalloway/openclaw-skills
cd openclaw-skills

# Optional: install one or more skills into your local OpenClaw skills dir
./install.sh sports-odds
./install.sh --bundle sports-bettor
```

There is no `package.json` or `requirements.txt` at the repo root. Skills are documentation + command recipes that OpenClaw loads from each skill folder.

## Adding or Changing a Skill

Each skill lives in a top-level directory named after the skill (e.g. `sports-odds/`) and must include `SKILL.md` with:

- YAML frontmatter containing at least `name` (must match the folder) and `description`
- `metadata.openclaw` in the format OpenClaw's parser actually reads (see [`src/skills/types.ts`](https://github.com/openclaw/openclaw/blob/main/src/skills/types.ts) and ClawHub's [skill-format.md](https://github.com/openclaw/clawhub/blob/main/docs/skill-format.md)):
  - `requires.bins` for CLIs every recipe needs, `requires.anyBins` when any one of several works
  - `requires.env` + `primaryEnv` for a required API key, and `envVars` (ClawHub field) to describe it; optional keys go in `envVars` with `"required": false`, never in `requires.env`
  - `install` entries must use `kind` `brew`, `node`, `go`, `uv`, or `download`; OpenClaw silently drops anything else (there is no `shell` kind). If no valid kind fits, document the manual step in the skill body instead
  - there is no `credentials` field; OpenClaw ignores it
- A markdown `#` title after the frontmatter

Also update:

- `README.md` — list the skill and keep the **skill count** accurate
- `install.sh` — only if you add a new curated `--bundle`
- `bundles/*.md` — if the skill belongs in a featured bundle

## Testing

Run the smoke tests (stdlib only):

```bash
python3 tests/validate_skills.py
```

These checks ensure every skill folder has a valid `SKILL.md`, frontmatter `name` matches the folder, and `README.md` lists every skill with the correct count.

### Upstream format check

CI also runs every `SKILL.md` through OpenClaw's own frontmatter parser (`scripts/check_upstream_format.mjs`), pinned to the version in `.openclaw-version`. It fails when a metadata key is not an OpenClaw or ClawHub field, an `install` entry is dropped by the parser, `primaryEnv` is not in `requires.env`, a recipe uses `$SOME_API_KEY` that is not declared, or a shell recipe runs a common CLI (`jq`, `curl`, `npm`, ...) that is not in `requires.bins` / `requires.anyBins`.

Run it locally (Node 24+):

```bash
npm install --prefix /tmp/openclaw --no-save --ignore-scripts "openclaw@$(cat .openclaw-version)"
node scripts/check_upstream_format.mjs /tmp/openclaw/node_modules/openclaw
```

**Bumping the pin:** CI also runs the check against `openclaw@latest` as a non-blocking step. To move the pin, check that step (or run the commands above with `openclaw@latest`), fix any new failures, then put the new version in `.openclaw-version` in the same PR. If the script reports that it cannot find the parser in `dist/`, the OpenClaw bundle layout changed: update the region marker or export names in `loadChunk` calls. If ClawHub adds registry-only fields, update `CLAWHUB_ONLY_KEYS`.

## Pull Request Guidelines

- Keep PRs focused — one feature, fix, or docs change per PR
- Include a clear description of **what** and **why**
- Reference related issues with `Closes #123`
- All CI checks must pass before merging
- Avoid editing `.github/workflows` unless you have workflow scope on the token used to push
- Be responsive to review feedback

## Reporting Bugs

Use the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md). Include:

- Steps to reproduce
- Expected vs actual behavior
- Environment info (OS, OpenClaw version if relevant)

## Suggesting Features

Use the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md). Explain the problem it solves.

## Code of Conduct

Be respectful and constructive. Everyone is welcome here. See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

Questions? Open an issue or reach out: **ian@allowayllc.com**
