"""
Ch3 city-night animation pipeline — single-base approach.

Takes ONE base image (city_base.png, produced by nano-banana as an upscaled
sky-removed version of base/night.png) and generates N animation frames by
adding halos + fireflies programmatically on top.

No per-frame AI calls. The base is static, style/color/silhouettes are locked
across every frame; only halo/firefly opacities pulse.

Input:  chapter3/backgrounds/city_night/city_base.png  (5504x3072, white sky)
Output: chapter3/backgrounds/city_night/frames/frame{1..N}.png  (RGBA with
        transparent sky so it layers cleanly over sky.png in the parallax stack)
"""

from pathlib import Path
import math
import random
from PIL import Image
import numpy as np

ROOT       = Path("C:/Projects/city/chapter3/backgrounds/city_night")
BASE_PATH  = ROOT / "city_base.png"
OUT_DIR    = ROOT / "frames"
N_FRAMES   = 8

# --- Sky transparency mask -----------------------------------------------
# After nano-banana removed the sky, the upper region is (mostly) white paper.
# We turn the sky region into transparent alpha via a flood fill from the top
# edge — any near-white pixel connected to the top of the canvas becomes
# transparent. This is more robust than a fixed threshold because paper grain
# and cloud haze around the mountain tops can be slightly off-white and a
# simple threshold leaves a visible halo.
SKY_WHITE_MEAN_THRESHOLD = 210   # pixel qualifies as "skyish" if RGB mean >= this
SKY_WHITE_PER_CHANNEL_MIN = 180  # AND each channel >= this (avoid bright colored reflections)

# --- Window halos (fixed positions, pulse via cosine phase) --------------
# x_pct, y_pct, peak_frame_1_indexed. Positions hand-picked on the actual
# lit-window clusters in the base painting.
WINDOW_HALOS = [
    (0.28, 0.52, 3),
    (0.36, 0.50, 5),
    (0.44, 0.48, 7),
    (0.50, 0.40, 1),   # near hero-spire tip
    (0.54, 0.45, 4),   # hero-spire mid
    (0.58, 0.50, 6),
    (0.66, 0.48, 2),
    (0.74, 0.52, 8),
    (0.82, 0.55, 5),
]
HALO_RADIUS_REF      = 140
HALO_COLOR           = (255, 220, 150)
HALO_INTENSITY_BASE  = 0.32
HALO_INTENSITY_SWING = 0.18

# --- Fireflies (procedurally generated, seeded jitter) -------------------
N_FIREFLIES      = 45
FIREFLY_SEED     = 11
FIREFLY_X_RANGE  = (0.04, 0.96)
FIREFLY_Y_RANGE  = (0.78, 0.93)
FIREFLY_CORE_RADIUS_REF = 6
FIREFLY_HALO_RADIUS_REF = 22
FIREFLY_CORE_COLOR      = (255, 220, 140)
FIREFLY_INTENSITY_BASE  = 0.55
FIREFLY_INTENSITY_SWING = 0.40


def _gen_firefly_positions() -> list[tuple[float, float, int]]:
    rng = random.Random(FIREFLY_SEED)
    n = N_FIREFLIES
    pts: list[tuple[float, float, int]] = []
    for k in range(n):
        t = (k + 0.5) / n
        xp = FIREFLY_X_RANGE[0] + t * (FIREFLY_X_RANGE[1] - FIREFLY_X_RANGE[0])
        xp += rng.uniform(-0.012, 0.012)
        yp = rng.uniform(*FIREFLY_Y_RANGE)
        peak = 1 + (k * 3 + rng.randint(0, 2)) % 8
        pts.append((round(xp, 3), round(yp, 3), peak))
    return pts


FIREFLIES = _gen_firefly_positions()


def pulse(frame: int, peak: int, base: float, swing: float) -> float:
    v = base + swing * math.cos(2 * math.pi * (frame - peak) / N_FRAMES)
    return max(0.0, min(1.0, v))


def additive_blob(
    arr: np.ndarray,
    cx: int,
    cy: int,
    radius: int,
    color: tuple[int, int, int],
    intensity: float,
) -> None:
    """Add a soft radial glow onto (H, W, 3) uint8 array, in place."""
    if intensity <= 0 or radius < 2:
        return
    H, W = arr.shape[:2]
    x0 = max(0, cx - radius)
    x1 = min(W, cx + radius)
    y0 = max(0, cy - radius)
    y1 = min(H, cy + radius)
    if x1 <= x0 or y1 <= y0:
        return
    yy, xx = np.ogrid[y0:y1, x0:x1]
    dist = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
    t = np.clip(dist / radius, 0, 1)
    add_scale = (1 - t) ** 2 * intensity
    region = arr[y0:y1, x0:x1].astype(np.float32)
    for ch in range(3):
        region[..., ch] = np.minimum(region[..., ch] + color[ch] * add_scale, 255)
    arr[y0:y1, x0:x1] = region.astype(np.uint8)


def additive_firefly(
    arr: np.ndarray,
    cx: int,
    cy: int,
    core_r: int,
    halo_r: int,
    color: tuple[int, int, int],
    intensity: float,
) -> None:
    if intensity <= 0 or halo_r < 2:
        return
    additive_blob(arr, cx, cy, halo_r, color, intensity * 0.7)
    additive_blob(arr, cx, cy, max(core_r * 2, core_r + 4), color, min(1.0, intensity * 1.2))


def _build_alpha_mask(rgb: np.ndarray) -> np.ndarray:
    """Flood-fill from the top edge through near-white pixels. Anything reachable
    that way becomes transparent; everything else stays opaque.

    Returns uint8 (H, W).
    """
    H, W = rgb.shape[:2]
    # A pixel qualifies as "skyish" if its mean brightness is high AND no
    # individual channel is very low (excludes vivid colors like the orange
    # building lights, purple water reflections, etc.)
    mean_ok = rgb.mean(axis=2) >= SKY_WHITE_MEAN_THRESHOLD
    min_ok  = rgb.min(axis=2) >= SKY_WHITE_PER_CHANNEL_MIN
    candidate = mean_ok & min_ok

    # Flood fill via scipy connected components — only keep "skyish" regions
    # that touch the top edge of the canvas.
    try:
        from scipy import ndimage
    except ImportError:
        print("WARN: scipy not available, falling back to threshold-only mask")
        return np.where(candidate, 0, 255).astype(np.uint8)

    labeled, _ = ndimage.label(candidate)
    # Find which labels touch the top row (y=0)
    top_labels = np.unique(labeled[0, :])
    top_labels = top_labels[top_labels != 0]  # drop background
    if len(top_labels) == 0:
        print("WARN: no skyish region touches top edge; keeping all opaque")
        return np.full((H, W), 255, dtype=np.uint8)

    transparent = np.isin(labeled, top_labels)
    alpha = np.where(transparent, 0, 255).astype(np.uint8)
    return alpha


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    base = Image.open(BASE_PATH).convert("RGB")
    W, H = base.size
    scale = W / 2752
    print(f"base: {W}x{H}, scale={scale:.2f}")

    base_rgb = np.asarray(base).copy()
    alpha_mask = _build_alpha_mask(base_rgb)
    print(f"alpha mask: {(alpha_mask == 0).sum()} transparent px, {(alpha_mask == 255).sum()} opaque px")

    halo_r = max(20, int(round(HALO_RADIUS_REF * scale)))
    core_r = max(3, int(round(FIREFLY_CORE_RADIUS_REF * scale)))
    halo_fr = max(10, int(round(FIREFLY_HALO_RADIUS_REF * scale)))

    for i in range(1, N_FRAMES + 1):
        rgb = base_rgb.copy()

        # Window halos
        for xp, yp, peak in WINDOW_HALOS:
            cx, cy = int(xp * W), int(yp * H)
            intensity = pulse(i, peak, HALO_INTENSITY_BASE, HALO_INTENSITY_SWING)
            additive_blob(rgb, cx, cy, halo_r, HALO_COLOR, intensity)

        # Fireflies
        for xp, yp, peak in FIREFLIES:
            cx, cy = int(xp * W), int(yp * H)
            intensity = pulse(i, peak, FIREFLY_INTENSITY_BASE, FIREFLY_INTENSITY_SWING)
            additive_firefly(rgb, cx, cy, core_r, halo_fr, FIREFLY_CORE_COLOR, intensity)

        rgba = np.dstack([rgb, alpha_mask])
        out = Image.fromarray(rgba, mode="RGBA")
        out_path = OUT_DIR / f"frame{i}.png"
        out.save(out_path, format="PNG", optimize=True)
        size_kb = out_path.stat().st_size // 1024
        print(f"  frame {i}: {out_path.name} ({W}×{H}, {size_kb} KB)")


if __name__ == "__main__":
    main()
