"""Exercise installer behavior in disposable source and destination folders."""

import os
import shlex
import shutil
import subprocess
import tempfile
import unittest
from pathlib import Path

INSTALLER = Path(__file__).resolve().parents[1] / "install.sh"


class InstallerTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.base = Path(self.temp.name)
        self.source = self.base / "source"
        self.source.mkdir()
        shutil.copy2(INSTALLER, self.source / "install.sh")
        for name in ("alpha", "beta"):
            folder = self.source / name
            folder.mkdir()
            (folder / "SKILL.md").write_text(f"# {name}\n")
            (folder / "example.txt").write_text("new content\n")
        self.dest = self.base / "installed skills"

    def run_install(self, *args, env_overrides=None):
        env = dict(os.environ, OPENCLAW_SKILLS_DIR=str(self.dest))
        env.update(env_overrides or {})
        return subprocess.run(
            ["bash", str(self.source / "install.sh"), *args],
            cwd=self.source,
            env=env,
            text=True,
            capture_output=True,
            timeout=10,
        )

    def test_installs_multiple_skills_into_path_with_spaces(self):
        result = self.run_install("alpha", "beta")
        self.assertEqual(result.returncode, 0, result.stderr)
        for name in ("alpha", "beta"):
            self.assertTrue((self.dest / name / "SKILL.md").is_file())
        self.assertEqual(sorted(p.name for p in self.dest.iterdir()), ["alpha", "beta"])

    def test_replaces_selected_skill_and_preserves_unrelated_files(self):
        existing = self.dest / "alpha"
        existing.mkdir(parents=True)
        (existing / "stale.txt").write_text("stale\n")
        (self.dest / "keep.txt").write_text("keep\n")
        result = self.run_install("alpha")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertFalse((existing / "stale.txt").exists())
        self.assertTrue((existing / "SKILL.md").exists())
        self.assertEqual((self.dest / "keep.txt").read_text(), "keep\n")

    def test_invalid_later_skill_does_not_replace_existing_installation(self):
        existing = self.dest / "alpha"
        existing.mkdir(parents=True)
        (existing / "custom.txt").write_text("keep me\n")
        result = self.run_install("alpha", "missing")
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual((existing / "custom.txt").read_text(), "keep me\n")
        self.assertFalse((existing / "SKILL.md").exists())

    def test_rejects_path_traversal_before_creating_destination(self):
        for name in ("..", "../source/alpha", ".", "/tmp", "alpha/beta"):
            with self.subTest(name=name):
                result = self.run_install(name)
                self.assertNotEqual(result.returncode, 0)
                self.assertIn("Invalid skill name", result.stderr)
        self.assertFalse(self.dest.exists())
        self.assertTrue((self.source / "alpha" / "SKILL.md").exists())

    def test_rejects_missing_option_values_with_clear_errors(self):
        for option in ("--dest", "--bundle"):
            with self.subTest(option=option):
                result = self.run_install(option)
                self.assertNotEqual(result.returncode, 0)
                self.assertIn(f"{option} requires a value", result.stderr)

    def test_rejects_unknown_options(self):
        result = self.run_install("--unknown")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("Unknown option", result.stderr)

    def test_refuses_installing_over_source_checkout(self):
        result = self.run_install("--dest", str(self.source), "alpha")
        self.assertNotEqual(result.returncode, 0)
        self.assertTrue((self.source / "alpha" / "SKILL.md").exists())

    def test_refuses_destination_alias_to_source_checkout(self):
        alias = self.base / "alias"
        alias.symlink_to(self.source, target_is_directory=True)
        result = self.run_install("--dest", str(alias), "alpha")
        self.assertNotEqual(result.returncode, 0)
        self.assertTrue((self.source / "alpha" / "SKILL.md").exists())

    def test_refuses_symlinked_target_without_touching_target(self):
        self.dest.mkdir()
        (self.dest / "alpha").symlink_to(self.source / "alpha", target_is_directory=True)
        result = self.run_install("alpha")
        self.assertNotEqual(result.returncode, 0)
        self.assertTrue((self.dest / "alpha").is_symlink())
        self.assertTrue((self.source / "alpha" / "SKILL.md").exists())

    def test_duplicate_skills_are_installed_once(self):
        result = self.run_install("alpha", "alpha")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(result.stdout.count("Installed alpha"), 1)
        self.assertFalse((self.dest / "alpha" / "alpha").exists())

    def test_failed_replacement_restores_previous_installation(self):
        existing = self.dest / "alpha"
        existing.mkdir(parents=True)
        (existing / "custom.txt").write_text("keep me\n")
        mock_bin = self.base / "bin"
        mock_bin.mkdir()
        wrapper = mock_bin / "mv"
        real_mv = shlex.quote(shutil.which("mv"))
        wrapper.write_text(
            '#!/bin/sh\ncase "$2" in */new/alpha) exit 1 ;; esac\n'
            f'exec {real_mv} "$@"\n'
        )
        wrapper.chmod(0o755)
        result = self.run_install(
            "alpha", env_overrides={"PATH": f"{mock_bin}{os.pathsep}{os.environ['PATH']}"}
        )
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual((existing / "custom.txt").read_text(), "keep me\n")
        self.assertFalse((existing / "SKILL.md").exists())
        self.assertEqual([p.name for p in self.dest.iterdir()], ["alpha"])

    def test_bundle_cannot_silently_override_explicit_skills(self):
        result = self.run_install("--bundle", "sports-bettor", "alpha")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("Choose a bundle or individual skills", result.stderr)

    def test_non_skill_directory_is_not_installed(self):
        (self.source / "docs").mkdir()
        result = self.run_install("docs")
        self.assertNotEqual(result.returncode, 0)
        self.assertFalse(self.dest.exists())


if __name__ == "__main__":
    unittest.main()
