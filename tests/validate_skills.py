#!/usr/bin/env python3
"""Smoke tests for OpenClaw skill folders.

Each skill directory must have SKILL.md with YAML frontmatter (name,
description matching the folder) and a markdown H1. README.md must
document every skill so the published count cannot drift.
"""
from __future__ import annotations

import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKIP_DIRS = {".git", ".github", "bundles", "tests"}
FRONTMATTER_RE = re.compile(r"\A---\s*\n(.*?)\n---\s*\n", re.DOTALL)
H1_RE = re.compile(r"^#\s+\S", re.MULTILINE)
STALE_COUNT_RE = re.compile(r"\b(\d+)\+\s+skills?\b", re.IGNORECASE)
EXACT_COUNT_RE = re.compile(r"\b(\d+)\s+skills?\b", re.IGNORECASE)


def skill_dirs() -> list[Path]:
    dirs: list[Path] = []
    for path in sorted(ROOT.iterdir()):
        if not path.is_dir():
            continue
        if path.name.startswith(".") or path.name in SKIP_DIRS:
            continue
        dirs.append(path)
    return dirs


def parse_frontmatter(text: str) -> dict[str, str] | None:
    match = FRONTMATTER_RE.match(text)
    if not match:
        return None
    data: dict[str, str] = {}
    for line in match.group(1).splitlines():
        if not line or line[0] in " \t-#":
            continue
        if ":" not in line:
            continue
        key, _, value = line.partition(":")
        key = key.strip()
        if key in {"name", "description"}:
            data[key] = value.strip().strip("\"'")
    return data


class SkillSmokeTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.skills = skill_dirs()
        cls.readme = (ROOT / "README.md").read_text(encoding="utf-8")

    def test_discovers_skill_directories(self) -> None:
        self.assertGreaterEqual(
            len(self.skills),
            1,
            "expected at least one skill directory at repo root",
        )

    def test_each_skill_has_skill_md(self) -> None:
        missing = [p.name for p in self.skills if not (p / "SKILL.md").is_file()]
        self.assertEqual(missing, [], f"missing SKILL.md: {missing}")

    def test_skill_md_frontmatter_and_title(self) -> None:
        errors: list[str] = []
        for path in self.skills:
            skill_md = path / "SKILL.md"
            if not skill_md.is_file():
                continue
            text = skill_md.read_text(encoding="utf-8")
            match = FRONTMATTER_RE.match(text)
            if match is None:
                errors.append(f"{path.name}: SKILL.md missing YAML frontmatter")
                continue
            fm = parse_frontmatter(text) or {}
            name = fm.get("name", "")
            description = fm.get("description", "")
            if not name:
                errors.append(f"{path.name}: frontmatter missing name")
            elif name != path.name:
                errors.append(
                    f"{path.name}: frontmatter name {name!r} does not match folder"
                )
            if not description:
                errors.append(f"{path.name}: frontmatter missing description")
            body = text[match.end() :]
            if not H1_RE.search(body):
                errors.append(f"{path.name}: SKILL.md missing markdown H1 title")
        self.assertEqual(errors, [], "\n".join(errors))

    def test_readme_lists_every_skill(self) -> None:
        missing = [p.name for p in self.skills if f"`{p.name}`" not in self.readme]
        self.assertEqual(
            missing,
            [],
            "README.md must mention each skill as `skill-name`:\n" + "\n".join(missing),
        )

    def test_readme_skill_count_matches_folders(self) -> None:
        count = len(self.skills)
        stale = STALE_COUNT_RE.findall(self.readme)
        self.assertEqual(
            stale,
            [],
            f"README uses approximate count {stale!r}; actual count is {count}",
        )
        exact = EXACT_COUNT_RE.findall(self.readme)
        self.assertTrue(
            exact,
            f"README should state the skill count ({count} skills)",
        )
        wrong = [n for n in exact if int(n) != count]
        self.assertEqual(
            wrong,
            [],
            f"README skill count {wrong!r} does not match {count} skill folders",
        )


if __name__ == "__main__":
    unittest.main(verbosity=2)
