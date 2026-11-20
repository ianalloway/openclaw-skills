"""Summarize column completeness for a local delimited file."""

import argparse
import csv
import json
from pathlib import Path


def profile(stream, delimiter):
    reader = csv.reader(stream, delimiter=delimiter, strict=True)
    header = next((row for row in reader if row), None)
    if header is None:
        raise ValueError("file contains no header row")
    blank = [0] * len(header)
    records = short_rows = long_rows = 0
    for row in reader:
        if not row:
            continue
        records += 1
        short_rows += len(row) < len(header)
        long_rows += len(row) > len(header)
        for i in range(len(header)):
            if i >= len(row) or not row[i].strip():
                blank[i] += 1
    return {
        "records": records,
        "short_rows": short_rows,
        "long_rows": long_rows,
        "columns": [
            {"position": i + 1, "name": name, "blank": blank[i], "filled": records - blank[i]}
            for i, name in enumerate(header)
        ],
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("file", type=Path)
    delimiters = {"comma": ",", "tab": "\t", "semicolon": ";"}
    parser.add_argument("--delimiter", choices=delimiters, default="comma")
    args = parser.parse_args()
    try:
        with args.file.open(newline="", encoding="utf-8-sig") as stream:
            report = profile(stream, delimiters[args.delimiter])
    except (OSError, ValueError, csv.Error) as error:
        parser.exit(1, f"{args.file}: {error}\n")
    print(json.dumps(report, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
