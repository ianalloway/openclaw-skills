#!/usr/bin/env node
// Generate OpenClaw plugin theme definitions (themes/*.json) from the CSS
// palettes in variables.css and variants/*.css, so the CSS stays the single
// source of truth. Run with --check to fail when the JSON is out of date.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(join(ROOT, "openclaw.plugin.json"), "utf8"));

// Theme id -> CSS files layered in order (later wins), plus presentation extras.
const SOURCES = {
  matrix: ["variables.css"],
  blue: ["variables.css", "variants/neon-blue.css"],
  amber: ["variables.css", "variants/neon-amber.css"],
  red: ["variables.css", "variants/neon-red.css"],
  dracula: ["variables.css", "variants/neon-dracula.css"],
};
const FONT = '"IBM Plex Mono", "JetBrains Mono", "Fira Code", ui-monospace, monospace';
const WORKING_PHRASES = ["Jacking in", "Decrypting", "Tracing the signal", "Rerouting", "Compiling"];

function readVars(files) {
  const vars = {};
  for (const file of files) {
    const css = readFileSync(join(ROOT, file), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    for (const [, name, value] of css.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) {
      vars[name] = value.replace(/\s+/g, " ").trim();
    }
  }
  return vars;
}

function hex(value) {
  const m = /^#([0-9a-f]{6})$/i.exec(value);
  if (!m) throw new Error(`expected #rrggbb, got ${value}`);
  return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16));
}
function toHex(rgb) {
  return "#" + rgb.map((c) => Math.round(c).toString(16).padStart(2, "0")).join("");
}
// Solid blend of `top` over `base` at weight t (0..1).
function mix(top, base, t) {
  const a = hex(top);
  const b = hex(base);
  return toHex(a.map((c, i) => c * t + b[i] * (1 - t)));
}

export function buildPalette(v) {
  return {
    background: v["neon-bg"],
    foreground: v["neon-text"],
    card: v["neon-bg-soft"],
    "card-foreground": v["neon-text"],
    popover: mix(v["neon-primary"], v["neon-bg-soft"], 0.06),
    "popover-foreground": v["neon-text"],
    primary: v["neon-primary"],
    "primary-foreground": v["neon-bg"],
    secondary: mix(v["neon-primary"], v["neon-bg"], 0.14),
    "secondary-foreground": v["neon-text"],
    muted: mix(v["neon-primary"], v["neon-bg"], 0.07),
    "muted-foreground": v["neon-text-mid"],
    accent: v["neon-secondary"],
    "accent-foreground": v["neon-bg"],
    destructive: v["neon-error"],
    "destructive-foreground": v["neon-bg"],
    border: v["neon-border"],
    input: v["neon-border-mid"],
    ring: v["neon-primary"],
    "font-sans": FONT,
    "font-mono": FONT,
  };
}

export function buildDefinitions() {
  const out = {};
  for (const theme of manifest.themes) {
    const files = SOURCES[theme.id];
    if (!files) throw new Error(`no CSS source mapping for theme ${theme.id}`);
    out[theme.source] = {
      name: theme.name,
      description: theme.description,
      workingIndicator: "dots",
      workingPhrases: WORKING_PHRASES,
      dark: buildPalette(readVars(files)),
    };
  }
  return out;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const check = process.argv.includes("--check");
  let stale = 0;
  for (const [rel, def] of Object.entries(buildDefinitions())) {
    const path = join(ROOT, rel);
    const text = JSON.stringify(def, null, 2) + "\n";
    if (check) {
      if (!existsSync(path) || readFileSync(path, "utf8") !== text) {
        console.error(`stale: ${rel} (run node scripts/build-plugin-themes.mjs)`);
        stale++;
      }
    } else {
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, text);
      console.log(`wrote ${rel}`);
    }
  }
  if (stale) process.exit(1);
}
