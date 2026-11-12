#!/usr/bin/env python3
"""Render static matrix-rain backgrounds (assets/matrix-rain-<theme>.webp).

OpenClaw plugin themes cannot run JavaScript, so the animated rain from
matrix-rain.js ships as still artwork instead. Upload one in Control UI
Settings -> Appearance -> Background -> Custom image. Output is deterministic
(fixed seed) and stays under the 512 KiB limit OpenClaw applies to theme
backgrounds. Requires Pillow: pip install pillow
"""
from __future__ import annotations

import json
import random
import re
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
W, H = 1600, 1000
CELL = 20
GLYPHS = "0123456789ABCDEFZ:=*+<>|"
FONT_CANDIDATES = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
    "/Library/Fonts/Menlo.ttc",
    "C:/Windows/Fonts/consola.ttf",
]
LIMIT = 512 * 1024  # OpenClaw rejects background files over 512 KiB


def theme_vars(files: list[str]) -> dict[str, str]:
    out: dict[str, str] = {}
    for f in files:
        css = re.sub(r"/\*.*?\*/", "", (ROOT / f).read_text(), flags=re.S)
        out.update({k: v.strip() for k, v in re.findall(r"--([\w-]+)\s*:\s*([^;]+);", css)})
    return out


def rgb(h: str) -> tuple[int, int, int]:
    h = h.lstrip("#")
    return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))  # type: ignore[return-value]


def render(bg: str, fg: str, seed: int) -> Image.Image:
    rnd = random.Random(seed)
    img = Image.new("RGB", (W, H), rgb(bg))
    draw = ImageDraw.Draw(img)
    font = next((ImageFont.truetype(p, CELL - 4) for p in FONT_CANDIDATES if Path(p).exists()), None)
    font = font or ImageFont.load_default()
    b, f = rgb(bg), rgb(fg)
    for col in range(W // CELL):
        if rnd.random() > 0.55:
            continue
        head = rnd.randrange(-10, H // CELL + 10)
        length = rnd.randrange(6, 26)
        for i in range(length):
            row = head - i
            if not 0 <= row < H // CELL:
                continue
            t = (1 - i / length) * (0.9 if i == 0 else 0.55)
            color = tuple(round(f[k] * t + b[k] * (1 - t)) for k in range(3))
            draw.text((col * CELL + 3, row * CELL), rnd.choice(GLYPHS), font=font, fill=color)
    return img


def main() -> int:
    manifest = json.loads((ROOT / "openclaw.plugin.json").read_text())
    sources = {
        "matrix": ["variables.css"],
        "blue": ["variables.css", "variants/neon-blue.css"],
        "amber": ["variables.css", "variants/neon-amber.css"],
        "red": ["variables.css", "variants/neon-red.css"],
        "dracula": ["variables.css", "variants/neon-dracula.css"],
    }
    for i, theme in enumerate(manifest["themes"]):
        dark = f"assets/matrix-rain-{theme['id']}.webp"
        v = theme_vars(sources[theme["id"]])
        img = render(v["neon-bg"], v["neon-primary"], seed=1337 + i)
        out = ROOT / dark
        out.parent.mkdir(parents=True, exist_ok=True)
        img.save(out, "WEBP", lossless=True, method=6)
        size = out.stat().st_size
        print(f"wrote {dark} ({size // 1024} KiB)")
        if size > LIMIT:
            print(f"error: {dark} exceeds 512 KiB", file=sys.stderr)
            return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
