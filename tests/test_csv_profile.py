import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class CsvProfileTests(unittest.TestCase):
    def test_installed_profile_handles_ragged_quoted_rows_and_repeated_headers(self):
        with tempfile.TemporaryDirectory() as folder:
            dest = Path(folder) / "skills"
            subprocess.run(["bash", ROOT / "install.sh", "--dest", dest, "csv-profile"], check=True, capture_output=True)
            script = dest / "csv-profile/scripts/profile_csv.py"
            path = Path(folder) / "sample.tsv"
            path.write_text('\ufeffname\tvalue\tvalue\nA\t"multi\nline"\t \n\nB\nC\t0\t""\textra\n', encoding="utf-8")
            report = json.loads(subprocess.check_output([sys.executable, script, "--delimiter", "tab", path]))
            self.assertEqual((report["records"], report["short_rows"], report["long_rows"]), (3, 1, 1))
            self.assertEqual(report["columns"], [
                {"position": 1, "name": "name", "filled": 3, "blank": 0},
                {"position": 2, "name": "value", "filled": 2, "blank": 1},
                {"position": 3, "name": "value", "filled": 0, "blank": 3},
            ])

    def test_empty_and_malformed_files_fail_without_partial_json(self):
        script = ROOT / "csv-profile/scripts/profile_csv.py"
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / "sample.csv"
            for data in ("\n", 'a,b\n"unclosed'):
                with self.subTest(data=data):
                    path.write_text(data)
                    result = subprocess.run([sys.executable, script, path], text=True, capture_output=True)
                    self.assertNotEqual(result.returncode, 0)
                    self.assertEqual(result.stdout, "")
                    self.assertIn(str(path), result.stderr)
