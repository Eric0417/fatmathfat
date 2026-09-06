from __future__ import annotations

import subprocess
from datetime import date
from pathlib import Path
from typing import Any, BinaryIO

from markitdown import MarkItDown
from markitdown._base_converter import DocumentConverter, DocumentConverterResult
from markitdown._stream_info import StreamInfo


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "S5_book_photo"
OUTPUT_DIR = ROOT / "content" / "s5" / "ocr"
SWIFT_HELPER = Path(__file__).with_name("vision_ocr.swift")


class VisionImageConverter(DocumentConverter):
    def accepts(
        self,
        file_stream: BinaryIO,
        stream_info: StreamInfo,
        **kwargs: Any,
    ) -> bool:
        extension = (stream_info.extension or "").lower()
        mimetype = (stream_info.mimetype or "").lower()
        return extension in {".jpg", ".jpeg", ".png"} or mimetype.startswith(
            ("image/jpeg", "image/png")
        )

    def convert(
        self,
        file_stream: BinaryIO,
        stream_info: StreamInfo,
        **kwargs: Any,
    ) -> DocumentConverterResult:
        local_path = stream_info.local_path
        if not local_path:
            return DocumentConverterResult(markdown="")
        completed = subprocess.run(
            ["swift", str(SWIFT_HELPER), local_path],
            check=True,
            capture_output=True,
            text=True,
        )
        return DocumentConverterResult(markdown=completed.stdout.strip())


def frontmatter(source_name: str) -> str:
    today = date.today().isoformat()
    return f"""---
title: S5 教材 OCR 來源 {source_name}
type: note
status: draft
tags: [memory, s5-source, ocr]
created: {today}
updated: {today}
---
"""


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    converter = MarkItDown(enable_builtins=False)
    converter.register_converter(VisionImageConverter(), priority=-10)

    image_paths = sorted(SOURCE_DIR.glob("*.jpeg"))
    index_lines: list[str] = [
        "# S5 教材 OCR 來源索引",
        "",
        "| 原圖 | Markdown |",
        "|------|----------|",
    ]

    for image_path in image_paths:
        result = converter.convert(str(image_path))
        output_name = f"{image_path.stem.lower().replace('_', '-')}.md"
        output_path = OUTPUT_DIR / output_name
        document = (
            frontmatter(image_path.name)
            + f"# {image_path.name}\n\n"
            + f"來源：`S5_book_photo/{image_path.name}`\n\n"
            + result.markdown
            + "\n"
        )
        output_path.write_text(document, encoding="utf-8")
        index_lines.append(
            f"| `{image_path.name}` | [{output_name}]({output_name}) |"
        )

    (ROOT / "content" / "s5" / "README.md").write_text(
        "\n".join(index_lines) + "\n",
        encoding="utf-8",
    )
    print(f"converted {len(image_paths)} images into {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
