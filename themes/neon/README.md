# openclaw-theme-neon

**Neon cyberpunk themes for OpenClaw.** Five plugin themes for the Control UI (Matrix green, Blue, Amber, Red, Dracula), plus the original CSS + JS kit (matrix rain canvas, glowing terminals, dark-glass panels) for your own pages. Make your personal AI assistant look like it's running in 2077.

**Repo:** [github.com/ianalloway/openclaw-theme-neon](https://github.com/ianalloway/openclaw-theme-neon)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![OpenClaw plugin theme](https://img.shields.io/badge/OpenClaw-plugin_theme_%E2%89%A52026.10.9-brightgreen)](https://docs.openclaw.ai/plugins/manifest/surfaces#themes)
[![CSS + JS](https://img.shields.io/badge/stack-CSS%20%2B%20JS-00ff41)](theme.css)
[![Live preview](https://img.shields.io/badge/preview-GitHub%20Pages-00ff41)](https://ianalloway.github.io/openclaw-theme-neon/)

**Live preview:** [ianalloway.github.io/openclaw-theme-neon](https://ianalloway.github.io/openclaw-theme-neon/) — variant switcher, matrix rain toggle, CSS variable editor.

## Features

- 🌧️ **Matrix rain** background via `matrix-rain.js` (canvas; density/speed from CSS variables)
- 💚 **Neon green** primary accent with hot-pink secondary (plus color variants)
- 🪟 **Dark-glass** panel effect with frosted backdrop blur
- ⌨️ **Monospace everything** — IBM Plex Mono throughout
- 🔴 **Glowing borders** with pulse animation on active elements
- 📱 Responsive — works on mobile terminal views
- ♿ Reduced-motion mode respects `prefers-reduced-motion` (rain disabled)

## Install in OpenClaw

OpenClaw's Control UI does not load custom CSS or JavaScript. Themes are
**palettes** that OpenClaw validates and applies itself, delivered one of three
ways ([theme docs](https://docs.openclaw.ai/tools/theme)). This repo supports the
first two.

### 1. Plugin theme (recommended)

The repo is an OpenClaw plugin (`openclaw.plugin.json`, id `theme-neon`) that
adds five themes to **Settings → Appearance** and to the agent's `theme` tool.
Requires OpenClaw **2026.10.9** or newer.

```bash
openclaw plugins install git:github.com/ianalloway/openclaw-theme-neon@main
# or from a local checkout:
openclaw plugins install ./openclaw-theme-neon
```

OpenClaw asks you to confirm the non-ClawHub source. The plugin ships palettes
only: no tools, hooks, network access, or config. After a git install,
`openclaw plugins doctor` shows a `provenance-invalid` warning ("OpenClaw can't verify
where this plugin came from"). OpenClaw shows that for every git install outside
ClawHub or npm. It doesn't affect the themes. Restart the Gateway, or run
`openclaw plugins reload theme-neon` if it is already running. Then pick a theme in
**Settings → Appearance**, or ask your agent, for example "switch to the Neon Dracula theme".

| Theme | ID | Look |
|-------|----|------|
| Neon Matrix | `theme-neon/matrix` | Matrix green + hot pink on near-black |
| Neon Blue | `theme-neon/blue` | Cyan + electric purple, ocean rig |
| Neon Amber | `theme-neon/amber` | Amber phosphor + teal, retro terminal |
| Neon Red | `theme-neon/red` | Crimson + neon orange, danger mode |
| Neon Dracula | `theme-neon/dracula` | Official Dracula palette |

All five are dark-only, use IBM Plex Mono (falling back to JetBrains Mono, Fira
Code, then the system monospace) when installed locally, use dot working
indicators with a few cyberpunk status phrases, and meet WCAG AA contrast for text.
Uninstall with `openclaw plugins uninstall theme-neon`.

### 2. Personal theme (no plugin)

Ask your agent to import one definition with the `theme` tool. Each file in
[`themes/`](themes) is a complete definition:

> Import this as a personal theme called `neon` and apply it in dark mode: *(paste `themes/matrix.json`)*

The agent calls `theme` with `{"action": "import", "id": "neon", "apply": true, "mode": "dark", "definition": …}`.
Personal themes are saved to your Gateway profile and appear as `user/neon`.

### Matrix rain background

Plugin themes can't run JavaScript, so the animated rain doesn't run inside
OpenClaw. [`assets/`](assets) holds a still matrix-rain image for each theme
(lossless WebP, under 35 KiB). Upload one in **Settings → Appearance →
Background → Custom image**. Plugin-declared theme backgrounds are documented on
OpenClaw `main` but are not in a release yet (checked against 2026.10.9 and
2026.10.10-beta.5). Once they ship, the manifest can point each theme at its image.

### Not on ClawHub yet

The plugin isn't published to ClawHub or npm, so install it from git or a
checkout as shown above.

### Files

| File | Role |
|------|------|
| `openclaw.plugin.json` | Plugin manifest declaring the five themes |
| `themes/*.json` | OpenClaw theme definitions, **generated** from the CSS palettes |
| `index.js` | No-op runtime entry (the themes are read statically) |
| `assets/*.webp` | Still matrix-rain backgrounds for Appearance → Background |
| `variables.css` | Default palette + matrix knobs (source of truth for the colors) |
| `theme.css` | Components (panels, terminal, buttons, badges) for your own web pages |
| `matrix-rain.js` | Canvas rain (`MatrixRain.init()`) for your own web pages |
| `variants/*.css` | Optional palettes loaded after the defaults |
| `docs/preview.html` | Interactive preview (also on GitHub Pages) |
| `scripts/` | Theme generator, background renderer, and plugin check |

## Preview

**Live (GitHub Pages):** https://ianalloway.github.io/openclaw-theme-neon/

Includes a variant switcher, matrix-rain toggle, and a CSS variable editor sidebar. The site is published from the `main` branch root so `theme.css`, `matrix-rain.js`, and `variants/` resolve next to `docs/preview.html`.

### Local preview

No build step. From the repo root:

```bash
python -m http.server 8765
# open http://localhost:8765/docs/preview.html
```

Screenshot assets are intentionally not checked in — capture your own from this preview if you need README images ([issue #3](https://github.com/ianalloway/openclaw-theme-neon/issues/3)).

## ASCII vibe check

```text
╔══════════════════════════════════════════╗
║  ▓▒░ OPENCLAW NEON THEME ░▒▓            ║
║                                          ║
║  > How can I help you today?             ║
║  ▌                                       ║
╚══════════════════════════════════════════╝
```

## Customization

Edit `variables.css` (names match what `theme.css` actually consumes):

```css
:root {
  --neon-primary: #00ff41;    /* Matrix green */
  --neon-secondary: #ff0090;  /* Hot pink */
  --neon-accent: #00d4ff;     /* Cyan */
  --neon-bg: #090909;         /* Near-black */
  --neon-surface: rgba(0, 255, 65, 0.04);
  --neon-border: rgba(0, 255, 65, 0.2);
  --neon-glow: 0 0 12px rgba(0, 255, 65, 0.45), 0 0 30px rgba(0, 255, 65, 0.15);
  --neon-font-mono: 'IBM Plex Mono', 'Fira Code', monospace;
  --matrix-density: 0.03;     /* Rain density (0.01–0.1) */
  --matrix-speed: 1.0;        /* Rain speed multiplier */
  --matrix-opacity: 0.18;     /* Canvas opacity */
}
```

In HTML:

```html
<link rel="stylesheet" href="theme.css" />
<canvas class="neon-matrix-rain" id="matrix-rain"></canvas>
<script src="matrix-rain.js"></script>
```

`matrix-rain.js` auto-inits on DOM ready. Calling `MatrixRain.init()` again safely replaces the existing animation. Call `MatrixRain.destroy()` to cancel it and remove listeners, or `MatrixRain.setVariant('neon-blue')` to retint the rain primary.

Rain pauses while the tab is hidden and responds immediately when the system's reduced-motion preference changes. The preview's rain toggle stops the animation as well as hiding the canvas. Invalid density or speed values fall back to usable settings.

## Development checks

The animation lifecycle has a dependency-free regression suite. With Node.js 20 or newer:

```bash
node --test tests/*.test.cjs
```

The OpenClaw theme definitions are generated from the CSS. After changing a
palette in `variables.css` or `variants/`, regenerate and check them (Node.js 24+
for the OpenClaw step):

```bash
node scripts/build-plugin-themes.mjs
npm install --prefix /tmp/openclaw --no-save --ignore-scripts "openclaw@$(cat .openclaw-version)"
node scripts/check-plugin.mjs /tmp/openclaw/node_modules/openclaw/openclaw.mjs
```

`check-plugin.mjs` verifies the JSON is current and every text/surface pair meets
WCAG AA. It then installs the plugin into a throwaway OpenClaw home and runs
`openclaw plugins doctor`, which loads each theme with OpenClaw's own validators.
`python3 scripts/render-backgrounds.py` (Pillow) regenerates `assets/`.

## Variants

Load a variant **after** `theme.css` so it overrides `:root` tokens:

```html
<link rel="stylesheet" href="theme.css" />
<link rel="stylesheet" href="variants/neon-dracula.css" />
```

| Variant | Primary | Secondary | Vibe | File |
|---------|---------|-----------|------|------|
| `neon` (default) | Matrix green | Hot pink | Classic cyber | `variables.css` |
| `neon-blue` | Cyan | Electric purple | Ocean rig | `variants/neon-blue.css` |
| `neon-amber` | Amber | Teal | Retro terminal | `variants/neon-amber.css` |
| `neon-red` | Crimson | Neon orange | Danger mode | `variants/neon-red.css` |
| `neon-dracula` | Dracula green | Pink | Dracula palette | `variants/neon-dracula.css` |

In OpenClaw, each variant is a plugin theme: `theme-neon/matrix`, `theme-neon/blue`,
`theme-neon/amber`, `theme-neon/red`, and `theme-neon/dracula`.

## Related issues

- [#1](https://github.com/ianalloway/openclaw-theme-neon/issues/1) Dracula variant → shipped as `variants/neon-dracula.css`
- [#2](https://github.com/ianalloway/openclaw-theme-neon/issues/2) Theme preview page → [GitHub Pages preview](https://ianalloway.github.io/openclaw-theme-neon/)
- [#3](https://github.com/ianalloway/openclaw-theme-neon/issues/3) README screenshots → use the preview to capture real shots; no placeholder image files

## Author

[Ian Alloway](https://github.com/ianalloway) — building AI tools with style.

## License

MIT — see [LICENSE](LICENSE).
