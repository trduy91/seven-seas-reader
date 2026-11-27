#!/usr/bin/env python3
"""Validate Reader catalog references and local Markdown image links."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path, PurePosixPath
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "site"
CATALOG = SITE / "data/catalog.json"
IMAGE_LINK = re.compile(r"!\[[^]]*\]\(([^)]+)\)")


def fail(message: str) -> None:
    raise SystemExit("VALIDATION ERROR: " + message)


def main() -> int:
    try:
        catalog = json.loads(CATALOG.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        fail(f"cannot read catalog.json: {exc}")

    if not isinstance(catalog.get("stories"), list):
        fail("catalog.stories must be an array")

    story_ids = set()
    total_chapters = 0
    for story in catalog["stories"]:
        story_id = story.get("id")
        if not story_id or story_id in story_ids:
            fail(f"missing or duplicate story id: {story_id}")
        story_ids.add(story_id)

        files = set()
        numbers = set()
        for chapter in story.get("chapters", []):
            total_chapters += 1
            value = chapter.get("file")
            if not isinstance(value, str) or not value:
                fail(f"{story_id}: chapter has no file path")
            relative = PurePosixPath(value.removeprefix("./"))
            if relative.is_absolute() or ".." in relative.parts:
                fail(f"{story_id}: unsafe chapter path {value}")
            if value in files:
                fail(f"{story_id}: duplicate chapter path {value}")
            files.add(value)

            chapter_path = SITE.joinpath(*relative.parts)
            if not chapter_path.is_file():
                fail(f"{story_id}: chapter file does not exist: {value}")

            number = chapter.get("num") or chapter.get("chapter_number")
            if number:
                if number in numbers:
                    fail(f"{story_id}: duplicate chapter number {number}")
                numbers.add(number)

            markdown = chapter_path.read_text(encoding="utf-8")
            for match in IMAGE_LINK.finditer(markdown):
                target = match.group(1).split("#", 1)[0]
                parsed = urlparse(target)
                if parsed.scheme in ("http", "https", "data"):
                    continue
                if not target:
                    fail(f"{story_id}: empty image target in {value}")
                image_path = (chapter_path.parent / target).resolve()
                if not image_path.is_relative_to(SITE.resolve()):
                    fail(f"{story_id}: image path escapes site: {target}")
                if not image_path.is_file():
                    fail(f"{story_id}: local image does not exist: {target} in {value}")

    print(f"Reader catalog validation passed: {len(story_ids)} stories, {total_chapters} chapters.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
