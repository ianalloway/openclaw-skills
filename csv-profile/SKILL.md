---
name: csv-profile
description: "Inspect the shape and completeness of a local CSV or TSV before importing or charting it."
metadata: {"openclaw":{"requires":{"bins":["python3"]}}}
---
# CSV Profile

Run the bundled profiler on a UTF-8 file with a header row.

```bash
python3 "{baseDir}/scripts/profile_csv.py" "daily-results.csv"
python3 "{baseDir}/scripts/profile_csv.py" --delimiter tab "measurements.tsv"
```

Read the JSON report for the number of data records, records shorter or longer than the header, and blank cells per column. Position identifies each column even when names repeat. A missing trailing field counts as blank, as does a field containing only whitespace. Quoted delimiters and multiline fields belong to their original record. Entirely empty lines are skipped.

When summarizing the report, mention any uneven rows and identify columns with missing values by name and position. The profiler runs locally and prints aggregate counts and header names.
