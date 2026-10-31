#!/usr/bin/env node
// Validate every skill folder with OpenClaw's own SKILL.md parser.
//
// Usage: node scripts/check_upstream_format.mjs <path-to-node_modules/openclaw>
//
// The parser is not a public export of the `openclaw` package, so this script
// locates the bundled chunk that carries `src/skills/loading/frontmatter.ts`
// and imports it by file path. The pinned version lives in .openclaw-version;
// see CONTRIBUTING.md ("Upstream format check") for how to bump it.
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SKIP = new Set(["bundles", "tests", "scripts", "node_modules"]);

// ClawHub's registry reads a few keys the OpenClaw runtime ignores. Keep this in
// sync with openclaw/clawhub docs/skill-format.md ("Full field reference").
const CLAWHUB_ONLY_KEYS = new Set(["envVars", "nix", "config"]);
// Body references like $FOO_API_KEY must be declared (requires.env or envVars).
const ENV_REF = /\$\{?([A-Z][A-Z0-9_]*_(?:API_KEY|KEY|TOKEN|SECRET))\b/g;
// CLIs that shell recipes commonly assume. When one starts a command in a
// fenced shell block it must appear in requires.bins or requires.anyBins.
// Install lines ("pip install x", "brew install x", ...) are skipped.
const KNOWN_TOOLS = new Set([
  "curl", "jq", "python3", "node", "npm", "npx", "pip", "pip3", "pip-audit", "gh", "git",
  "uplot", "termgraph", "gnuplot", "peekaboo", "juryrig", "docker",
]);
const INSTALL_LINE = /^\s*(?:sudo\s+)?(?:pip3?|brew|gem|npm|uv|pipx|apt(?:-get)?)\s+(?:install|i|add|tool\s+install)\b/;

function undeclaredTools(body, declared) {
  const missing = new Set();
  for (const [, block] of body.matchAll(/```(?:bash|sh|shell|zsh|console)\n([\s\S]*?)```/g)) {
    for (const line of block.split("\n")) {
      if (!line.trim() || line.trim().startsWith("#") || INSTALL_LINE.test(line)) continue;
      for (const seg of line.split(/\|\||&&|\||;|\$\(/)) {
        const cmd = seg.trim().split(/\s+/)[0];
        if (KNOWN_TOOLS.has(cmd) && !declared.has(cmd)) missing.add(cmd);
      }
    }
  }
  return [...missing];
}

function fail(msg) {
  console.error(`error: ${msg}`);
  process.exit(2);
}

const pkgDir = resolve(process.argv[2] ?? fail("pass the path to node_modules/openclaw"));
const pkg = JSON.parse(readFileSync(join(pkgDir, "package.json"), "utf8"));
const distDir = join(pkgDir, "dist");

// Find a chunk by its source region marker and map its minified export aliases.
function loadChunk(regionMarker, wanted) {
  for (const file of readdirSync(distDir)) {
    if (!file.endsWith(".mjs") && !file.endsWith(".js")) continue;
    const text = readFileSync(join(distDir, file), "utf8");
    if (!text.includes(regionMarker)) continue;
    const exp = text.match(/export\s*\{([^}]*)\};?\s*$/m);
    if (!exp) continue;
    const alias = {};
    for (const part of exp[1].split(",")) {
      const m = part.trim().match(/^(\w+)\s+as\s+(\w+)$/);
      if (m) alias[m[1]] = m[2];
      else if (part.trim()) alias[part.trim()] = part.trim();
    }
    if (wanted.every((name) => name in alias)) return { file: join(distDir, file), alias };
  }
  fail(`could not find ${wanted.join(", ")} in openclaw@${pkg.version} dist; the bundle layout changed`);
}

const skillChunk = loadChunk("//#region src/skills/loading/frontmatter.ts", [
  "parseSkillFrontmatter",
  "resolveSkillManifestMetadata",
]);
const sharedChunk = loadChunk("resolveOpenClawManifestBlock", ["resolveOpenClawManifestBlock"]);
const skillMod = await import(pathToFileURL(skillChunk.file).href);
const sharedMod = await import(pathToFileURL(sharedChunk.file).href);
const parseSkillFrontmatter = skillMod[skillChunk.alias.parseSkillFrontmatter];
const resolveSkillManifestMetadata = skillMod[skillChunk.alias.resolveSkillManifestMetadata];
const resolveOpenClawManifestBlock = sharedMod[sharedChunk.alias.resolveOpenClawManifestBlock];

// The runtime's metadata keys come from the parser itself: whatever
// resolveSkillManifestMetadata returns for a block that sets nothing.
const RUNTIME_KEYS = new Set(
  Object.keys(resolveSkillManifestMetadata({ metadata: '{"openclaw":{}}' }) ?? {}),
);
if (RUNTIME_KEYS.size === 0) fail("parser returned no metadata keys; the probe needs updating");

const skills = readdirSync(ROOT)
  .filter((n) => !n.startsWith(".") && !SKIP.has(n))
  .filter((n) => statSync(join(ROOT, n)).isDirectory())
  .sort();

let errors = 0;
for (const name of skills) {
  const file = join(ROOT, name, "SKILL.md");
  const problems = [];
  if (!existsSync(file)) {
    problems.push("missing SKILL.md");
  } else {
    const content = readFileSync(file, "utf8");
    let fm;
    try {
      fm = parseSkillFrontmatter(content);
    } catch (err) {
      problems.push(String(err.message ?? err));
    }
    if (fm) {
      if (fm.name !== name) problems.push(`frontmatter name ${JSON.stringify(fm.name)} != folder`);
      if (!fm.description) problems.push("missing description");
      const raw = resolveOpenClawManifestBlock({ frontmatter: fm });
      const meta = resolveSkillManifestMetadata(fm);
      if (fm.metadata && !raw) problems.push("metadata present but no openclaw block was parsed");
      if (raw) {
        for (const key of Object.keys(raw)) {
          if (!RUNTIME_KEYS.has(key) && !CLAWHUB_ONLY_KEYS.has(key)) {
            problems.push(`metadata.openclaw.${key} is not an OpenClaw or ClawHub field (ignored)`);
          }
        }
        const rawReq = raw.requires ?? {};
        for (const key of Object.keys(rawReq)) {
          if (!(key in (meta?.requires ?? {}))) problems.push(`requires.${key} is not a known field`);
        }
        const rawInstall = Array.isArray(raw.install) ? raw.install : [];
        const parsedIds = new Set((meta?.install ?? []).map((s) => s.id));
        for (const spec of rawInstall) {
          if (!parsedIds.has(spec.id)) {
            problems.push(
              `install entry ${JSON.stringify(spec.id ?? spec.kind)} (kind ${JSON.stringify(spec.kind)}) is dropped by the parser`,
            );
          }
        }
        const reqEnv = new Set(meta?.requires?.env ?? []);
        if (meta?.primaryEnv && !reqEnv.has(meta.primaryEnv)) {
          problems.push(`primaryEnv ${meta.primaryEnv} is not listed in requires.env`);
        }
        const declared = new Set([
          ...reqEnv,
          ...(Array.isArray(raw.envVars) ? raw.envVars.map((v) => v?.name) : []),
        ]);
        const body = content.replace(/^---[\s\S]*?\n---\s*\n/, "");
        for (const [, env] of body.matchAll(ENV_REF)) {
          if (!declared.has(env)) problems.push(`body uses $${env} but it is not declared in requires.env or envVars`);
        }
        const bins = new Set([...(meta?.requires?.bins ?? []), ...(meta?.requires?.anyBins ?? [])]);
        for (const tool of undeclaredTools(body, bins)) {
          problems.push(`shell recipes run \`${tool}\` but it is not in requires.bins or requires.anyBins`);
        }
      }
    }
  }
  if (problems.length) {
    errors += problems.length;
    for (const p of [...new Set(problems)]) console.log(`FAIL ${name}: ${p}`);
  } else {
    console.log(`ok   ${name}`);
  }
}

console.log(`\nChecked ${skills.length} skills against openclaw@${pkg.version} (runtime keys: ${[...RUNTIME_KEYS].join(", ")}).`);
if (errors) {
  console.log(`${errors} problem(s) found.`);
  process.exit(1);
}
