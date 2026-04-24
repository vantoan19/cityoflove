"""
Generate sprite-animation frames for the Ch3 starry-night sky twinkle.

Strategy — keep frames *essentially identical* to sky.png:
- Base pixels are never regenerated; we only alpha-composite subtle warm glints
  onto a copy of sky.png.
- Many star positions, each with a brightness that cycles at a staggered
  phase across FRAMES frames. Max glint is a small radial spot — tiny delta
  per-star, but the whole field twinkles busily.
- Output resolution is downscaled from the huge master (26MB) to 2400px wide
  so four frames weigh in at a manageable total size.

Output files: chapter3/backgrounds/sky_overlays/frame{1..N}.png
"""

from pathlib import Path
import math
import random
from PIL import Image, ImageDraw, ImageFilter

BASE       = Path("C:/Projects/city/chapter3/backgrounds/sky.png")
OUT_DIR    = Path("C:/Projects/city/chapter3/backgrounds/sky_overlays")
FRAMES     = 4
N_STARS    = 163                 # total twinkling stars across the sky
GLINT_R_REF_W = 2400             # glint radius is calibrated at this canvas width
GLINT_R_BASE  = 10               # glint radius (in px) when canvas width == GLINT_R_REF_W
GLINT_MAX  = 215                 # peak alpha (0..255) of the glint core
HERO_EVERY = 8                   # every Nth star gets a cross-flare + bigger radius
SEED       = 7


def _gen_stars(n: int, seed: int) -> list[tuple[float, float]]:
    """Deterministic star positions, heavily weighted to the upper half of the sky.

    The city silhouette covers roughly the lower 60% of the composed scene, so
    stars below y≈0.45 are largely occluded. We push ~70% of stars into the top
    band, another ~20% along the Milky Way diagonal (which still spends most of
    its arc in the upper sky), and only ~10% across the lower sky for continuity
    at the horizon where the city opens up.
    """
    rng = random.Random(seed)
    pts: list[tuple[float, float]] = []

    n_top     = int(n * 0.70)    # dense field across the top half
    n_band    = int(n * 0.20)    # Milky Way diagonal streak
    n_lower   = n - n_top - n_band

    # Top-half cluster — full width, jittered y
    for _ in range(n_top):
        x = rng.uniform(0.02, 0.98)
        # pull toward very top but allow some spread to mid-upper
        y = abs(rng.gauss(0.0, 0.18))
        y = max(0.015, min(0.45, y))
        pts.append((x, y))

    # Milky Way band — diagonal with perpendicular jitter
    for _ in range(n_band):
        t = rng.uniform(0.04, 0.96)
        perp = rng.gauss(0.0, 0.10)
        x = max(0.02, min(0.98, t + perp))
        y = max(0.02, min(0.65, 0.85 * t - perp))  # compress so it sits higher
        pts.append((x, y))

    # Lower sky — sparse so the horizon isn't bare under animated beams
    for _ in range(n_lower):
        x = rng.uniform(0.02, 0.98)
        y = rng.uniform(0.45, 0.72)
        pts.append((x, y))

    # de-duplicate anything too close together so glints don't stack
    MIN_DIST = 0.010
    unique: list[tuple[float, float]] = []
    for x, y in pts:
        if all((x - ux) ** 2 + (y - uy) ** 2 > MIN_DIST ** 2 for ux, uy in unique):
            unique.append((x, y))
    return unique


STARS = _gen_stars(N_STARS, SEED)


def brightness_at(i: int, frame: int) -> float:
    """0..1 brightness for star i on frame f, staggered so stars peak at different frames."""
    phase = (i / len(STARS) * FRAMES + frame) / FRAMES  # 0..1 across the loop
    # smooth cosine: 1 at phase=0, 0 at phase=0.5, back to 1 at phase=1
    return (math.cos(phase * 2 * math.pi) + 1) / 2


def draw_glint(
    draw: ImageDraw.ImageDraw,
    cx: int,
    cy: int,
    peak_alpha: int,
    radius: int,
    cross_flare: bool = False,
) -> None:
    """Radial glint: bright center with quadratic falloff. Optional cross-flare for heroes."""
    if peak_alpha < 4:
        return
    for r in range(radius, 0, -1):
        t = r / radius
        a = int(peak_alpha * (1 - t) ** 2)
        if a <= 0:
            continue
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(255, 245, 212, a))
    if not cross_flare:
        return
    # thin 4-point cross-flare — a couple of elongated rhombuses
    half = radius * 2
    flare = int(peak_alpha * 0.55)
    if flare > 0:
        draw.polygon(
            [(cx - half, cy), (cx, cy - 1), (cx + half, cy), (cx, cy + 1)],
            fill=(255, 245, 220, flare),
        )
        draw.polygon(
            [(cx, cy - half), (cx - 1, cy), (cx, cy + half), (cx + 1, cy)],
            fill=(255, 245, 220, flare),
        )


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    base = Image.open(BASE).convert("RGBA")
    W, H = base.size
    print(f"sky.png (native): {W}x{H}")

    # glint radius scales with canvas width so visual size matches across resolutions
    scale = W / GLINT_R_REF_W
    glint_r = max(2, int(round(GLINT_R_BASE * scale)))
    blur_r = max(0.8, 0.8 * scale)
    print(f"glint radius: {glint_r}px (scale {scale:.2f}), blur: {blur_r:.2f}px")
    print(f"stars: {len(STARS)} (requested {N_STARS})")

    for f in range(FRAMES):
        overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        draw = ImageDraw.Draw(overlay)
        for i, (xp, yp) in enumerate(STARS):
            cx = int(xp * W)
            cy = int(yp * H)
            peak_alpha = int(brightness_at(i, f) * GLINT_MAX)
            is_hero = (i % HERO_EVERY) == 0
            draw_glint(
                draw,
                cx,
                cy,
                peak_alpha,
                radius=glint_r + (int(round(2 * scale)) if is_hero else 0),
                cross_flare=is_hero,
            )

        # soften the glint overlay so it feels painted, not vector
        overlay = overlay.filter(ImageFilter.GaussianBlur(radius=blur_r))

        frame_img = Image.alpha_composite(base, overlay).convert("RGB")
        out_path = OUT_DIR / f"frame{f + 1}.png"
        frame_img.save(out_path, format="PNG", optimize=True)
        size_kb = out_path.stat().st_size // 1024
        print(f"  frame {f + 1}: {out_path.name} ({size_kb} KB)")


if __name__ == "__main__":
    main()
