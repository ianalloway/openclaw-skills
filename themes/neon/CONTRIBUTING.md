# Contributing to openclaw-theme-neon

Thanks for your interest in contributing! This repo is an **OpenClaw plugin theme** (`openclaw.plugin.json` + generated `themes/*.json`) plus a pure CSS + JS kit for web pages. There is no app runtime; the plugin's `index.js` is a no-op.

## Getting Started

1. **Fork** this repo and create your branch from `main`
2. Branch naming: `feat/your-feature`, `fix/your-bug`, or `docs/your-docs`
3. Make your changes with clear, descriptive commits
4. **Preview** locally before opening a PR
5. Open a Pull Request and describe what / why

## Development Setup

```bash
git clone https://github.com/ianalloway/openclaw-theme-neon.git
cd openclaw-theme-neon

# static preview (resolves relative CSS/JS imports)
python -m http.server 8765
# open http://localhost:8765/docs/preview.html
```

Key files:

- `variables.css` — tokens
- `theme.css` — component styles (`@import`s variables)
- `matrix-rain.js` — canvas rain helper
- `variants/*.css` — optional palettes
- `docs/preview.html` — interactive demo
- `openclaw.plugin.json` — OpenClaw plugin manifest (theme ids, names, descriptions)
- `themes/*.json` — **generated** OpenClaw theme definitions; edit the CSS, then run `node scripts/build-plugin-themes.mjs`
- `scripts/check-plugin.mjs` — freshness, contrast, and real-OpenClaw load check (see README → Development checks)

### Bumping the OpenClaw pin

CI loads the plugin with the OpenClaw version in `.openclaw-version`, plus a
non-blocking run against `openclaw@latest`. To move the pin, run the check
against the new version, fix any reported theme diagnostics, and update
`.openclaw-version` and the `>=` floors in `package.json` (`peerDependencies`,
`openclaw.compat.pluginApi`, `openclaw.install.minHostVersion`) only if the
themes now rely on newer features, such as manifest `backgrounds`.

## Code Style

- Keep CSS custom properties on `:root`; variants should only override tokens
- Prefer existing class prefixes (`neon-*`) over new naming schemes
- Respect `prefers-reduced-motion` for animations and rain
- No generated screenshot binaries unless they are real captures of the preview (the `assets/` backgrounds are theme artwork, rendered by `scripts/render-backgrounds.py`)

## Pull Request Guidelines

- Keep PRs focused — one feature or bug fix per PR
- Include a clear description of **what** and **why**
- Reference related issues with `Closes #123` when applicable
- Be responsive to review feedback

## Reporting Bugs

Use the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md). Include:

- Steps to reproduce
- Expected vs actual behavior
- Browser / OS (this is a CSS/JS theme)

## Suggesting Features

Use the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md). Explain the problem it solves.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

Questions? Open an issue or reach out: **ian@allowayllc.com**
