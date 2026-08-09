#!/usr/bin/env python3
"""
sync-keys.py — Synchronize language JSON files against en.json (source of truth).

Usage:
    python3 sync-keys.py              # Dry run: show what would change
    python3 sync-keys.py --apply      # Actually write changes
    python3 sync-keys.py --check      # Exit 1 if any file is out of sync (for CI)

What it does:
    1. Reads lang/en.json as the canonical key set
    2. For each other lang/*.json:
       - Reports keys missing from that file (will be added as empty "")
       - Reports extra keys not in en.json (dead keys, will be removed with --apply)
    3. With --apply: writes updated files, preserving existing translations
"""

import json
import os
import sys
from pathlib import Path

LANG_DIR = Path(__file__).parent / "lang"
SOURCE = LANG_DIR / "en.json"
SKIP_FILES = {"en.json"}


def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def save_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")


def main():
    apply = "--apply" in sys.argv
    check = "--check" in sys.argv

    if not SOURCE.exists():
        print(f"ERROR: Source file not found: {SOURCE}")
        sys.exit(1)

    source = load_json(SOURCE)
    source_keys = set(source.keys())
    print(f"Source: {SOURCE.name} ({len(source_keys)} keys)")

    total_missing = 0
    total_extra = 0
    files_changed = 0

    for path in sorted(LANG_DIR.glob("*.json")):
        if path.name in SKIP_FILES:
            continue

        data = load_json(path)
        data_keys = set(data.keys())

        missing = source_keys - data_keys
        extra = data_keys - source_keys

        if not missing and not extra:
            continue

        files_changed += 1
        lang = path.stem

        if missing:
            total_missing += len(missing)
            print(f"\n  {lang}: missing {len(missing)} key(s):")
            for k in sorted(missing):
                print(f"    - {k}")
            if apply:
                for k in sorted(missing):
                    data[k] = ""

        if extra:
            total_extra += len(extra)
            print(f"\n  {lang}: extra {len(extra)} key(s) (not in en.json):")
            for k in sorted(extra):
                print(f"    - {k}: {data[k][:50]}")
            if apply:
                for k in sorted(extra):
                    del data[k]

        if apply:
            save_json(path, data)

    # Summary
    print(f"\n{'='*50}")
    print(f"Files checked:  {len(list(LANG_DIR.glob('*.json')))}")
    print(f"Files with gaps: {files_changed}")
    print(f"Total missing:  {total_missing}")
    print(f"Total extra:    {total_extra}")

    if apply and files_changed > 0:
        print(f"\n✅ Applied changes to {files_changed} file(s).")
    elif check and files_changed > 0:
        print(f"\n❌ {files_changed} file(s) out of sync. Run with --apply to fix.")
        sys.exit(1)
    elif check:
        print(f"\n✅ All files in sync.")
    elif files_changed > 0:
        print(f"\nDry run. Use --apply to write changes.")
    else:
        print(f"\n✅ All files already in sync.")


if __name__ == "__main__":
    main()
