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
- Prefer the OpenClaw metadata shape used by existing skills (`metadata.openclaw.emoji`, `requires.bins`, optional `credentials` / `install`)
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
