#!/usr/bin/env node
// Check the OpenClaw plugin theme package.
//
//   node scripts/check-plugin.mjs                       # offline checks only
//   node scripts/check-plugin.mjs <path/to/openclaw.mjs> # + real OpenClaw load
//
// Offline: themes/*.json match the CSS palettes (scripts/build-plugin-themes.mjs)
// and every text/surface pair meets WCAG AA contrast (4.5:1).
// With an OpenClaw CLI: installs this folder into a throwaway OPENCLAW home and
// runs `openclaw plugins doctor --json`, which loads the manifest and every
// theme definition with OpenClaw's own validators and reports any theme it drops.
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(join(ROOT, "openclaw.plugin.json"), "utf8"));
let failures = 0;
const fail = (msg) => {
  console.error(`FAIL ${msg}`);
  failures++;
};

// 1. Generated definitions are current.
try {
  execFileSync(process.execPath, [join(ROOT, "scripts/build-plugin-themes.mjs"), "--check"], { stdio: "inherit" });
  console.log("ok   themes/*.json match the CSS palettes");
} catch {
  fail("themes/*.json are stale; run node scripts/build-plugin-themes.mjs");
}

// 2. Contrast.
function luminance(hex) {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) return undefined;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16) / 255);
  const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}
const PAIRS = [
  ["foreground", "background"],
  ["card-foreground", "card"],
  ["popover-foreground", "popover"],
  ["primary-foreground", "primary"],
  ["secondary-foreground", "secondary"],
  ["muted-foreground", "background"],
  ["muted-foreground", "muted"],
  ["accent-foreground", "accent"],
  ["destructive-foreground", "destructive"],
];
for (const theme of manifest.themes) {
  const def = JSON.parse(readFileSync(join(ROOT, theme.source), "utf8"));
  for (const mode of ["light", "dark"]) {
    const palette = def[mode];
    if (!palette) continue;
    for (const [fg, bg] of PAIRS) {
      const a = luminance(palette[fg]);
      const b = luminance(palette[bg]);
      if (a === undefined || b === undefined) continue;
      const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      if (ratio < 4.5) fail(`${theme.id} ${mode}: ${fg} on ${bg} contrast ${ratio.toFixed(2)} < 4.5`);
    }
  }
}
if (!failures) console.log("ok   WCAG AA contrast for all text/surface pairs");

// 3. Real OpenClaw load.
const cli = process.argv[2];
if (cli) {
  const home = mkdtempSync(join(tmpdir(), "openclaw-theme-check-"));
  const env = { ...process.env, HOME: home, OPENCLAW_HOME: undefined, OPENCLAW_STATE_DIR: undefined };
  const run = (args) => execFileSync(process.execPath, [resolve(cli), ...args], { env, encoding: "utf8" });
  try {
    console.log(run(["--version"]).trim());
    run(["plugins", "install", ROOT, "--force", "--accept-capabilities"]);
    const out = run(["plugins", "doctor", "--json"]);
    const report = JSON.parse(out.slice(out.indexOf("{")));
    const mine = [...(report.pluginErrors ?? []), ...(report.diagnostics ?? []), ...(report.configurationWarnings ?? [])]
      .filter((d) => JSON.stringify(d).includes(manifest.id));
    for (const d of mine) fail(`openclaw: ${d.message ?? JSON.stringify(d)}`);
    const inspectOut = run(["plugins", "inspect", manifest.id, "--json"]);
    const inspect = JSON.parse(inspectOut.slice(inspectOut.indexOf("{")));
    if (inspect.plugin?.status !== "loaded") fail(`openclaw: plugin status is ${inspect.plugin?.status}`);
    if (!mine.length && inspect.plugin?.status === "loaded") {
      console.log(`ok   OpenClaw loaded ${manifest.id} with ${manifest.themes.length} themes and no diagnostics`);
    }
  } catch (err) {
    fail(`openclaw run failed: ${err.stderr || err.message}`);
  } finally {
    rmSync(home, { recursive: true, force: true });
  }
}

if (failures) process.exit(1);
