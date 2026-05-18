#!/usr/bin/env python3
"""Strip Micro Integrator tabs/sections, normalize Ballerina-only notes, map ballerina fences for Prism."""
from __future__ import annotations

import re
from pathlib import Path

DOCS = Path(__file__).resolve().parent.parent / "docs"

OLD_NOTE_RE = re.compile(
    r":::note\n"
    r"WSO2 Open Healthcare offers \*\*two distinct solutions\*\* \(Ballerina and Micro Integrator\).*?"
    r":::\s*",
    re.DOTALL,
)

NEW_NOTE = """:::note
These guides use [Ballerina](https://ballerina.io/), a language designed for integration and network services, to build healthcare integrations as microservices.
:::

"""

IMPORT_TABS = re.compile(
    r"^import Tabs from '@theme/Tabs';\nimport TabItem from '@theme/TabItem';\n\n?",
    re.MULTILINE,
)

TWO_TAB_RE = re.compile(
    r"<Tabs>\s*"
    r'<TabItem value="ballerina" label="Ballerina">\s*(.*?)\s*</TabItem>\s*'
    r'<TabItem value="micro-integrator"[^>]*>.*?</TabItem>\s*'
    r"</Tabs>",
    re.DOTALL,
)

ONE_TAB_RE = re.compile(
    r"<Tabs>\s*"
    r'<TabItem value="ballerina" label="Ballerina">\s*(.*?)\s*</TabItem>\s*'
    r"</Tabs>",
    re.DOTALL,
)

# Remove trailing MI section when it starts with this heading (MkDocs-era split layout).
MI_TAIL_RE = re.compile(r"\n### Micro Integrator\n[\s\S]*\Z")

# Docker doc uses an H2 for the MI image section.
MI_DOCKER_H2_RE = re.compile(
    r"\n## WSO2 Open Healthcare Micro Integrator\n[\s\S]*\Z"
)


def process(text: str) -> str:
    text = OLD_NOTE_RE.sub(NEW_NOTE, text)
    text = IMPORT_TABS.sub("", text, count=1)
    new, n = TWO_TAB_RE.subn(r"\1", text, count=1)
    if n:
        text = new
    else:
        new, n = ONE_TAB_RE.subn(r"\1", text, count=1)
        if n:
            text = new
    text = text.replace("```ballerina", "```typescript")
    text = MI_TAIL_RE.sub("", text)
    text = MI_DOCKER_H2_RE.sub("", text)
    return text


def main() -> None:
    for path in sorted(DOCS.rglob("*.md")):
        raw = path.read_text(encoding="utf-8")
        updated = process(raw)
        if updated != raw:
            path.write_text(updated, encoding="utf-8", newline="\n")
            print(path.relative_to(DOCS.parent))


if __name__ == "__main__":
    main()
