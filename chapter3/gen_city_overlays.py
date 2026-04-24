"""
Stage 2 of the Ch3 city-layer animation pipeline.

Input:  chapter3/backgrounds/city_overlays/_shimmer/frame{1..8}.png
        (produced by nano-banana in stage 1 — see CITY_LAYER.md)

Output: chapter3/backgrounds/city_overlays/frame{1..8}.png

For each input shimmer frame this script:
  1. Pastes the base's bottom strip (bank / rowboat) over the shimmer frame — locks the bottom.
  2. Scrubs the bottom-left flower corner with clean bank texture sampled from the base.
  3. Additively blends window halos + firefly glows on top (proper "light adds light" blend).

All overlay positions + phases are constants. Opacity pulses are deterministic
sinusoids, so nothing drifts frame-to-frame.

All compositing for the glows uses NUMPY ADDITIVE BLENDING, not PIL alpha_composite —
alpha_composite tints the background instead of adding light, which made the halos
invisible on already-bright windows.
"""

from pathlib import Path
import math
from PIL import Image, ImageFilter
import numpy as np

ROOT      = Path("C:/Projects/city/chapter3/backgrounds/city_overlays")
SHIMMER   = ROOT / "_shimmer"
BASE_PATH = Path("C:/Projects/city/chapter3/backgrounds/city.png")
N_FRAMES  = 8

# --- Bank paste region ---------------------------------------------------
# Paste the bottom strip of the base (below the river band) over each shimmer
# frame — locks the bank, rowboat, and bank silhouettes in place across all
# 8 frames.
#
# IMPORTANT: we start at x=28%, NOT x=0%. The base has a wildflower fringe in
# its bottom-left corner (roughly x 0–28%), and the shimmer frames from Gemini
# already render that corner as clean empty stone bank (per the "no flowers"
# prompt). By skipping the left 28% of the paste, we keep Gemini's clean bank
# intact on the left AND the base's rowboat/stone/silhouettes intact on the
# right. No need for a separate flower-scrub step.
BANK_PASTE_X0_PCT = 0.28
BANK_PASTE_X1_PCT = 1.00
BANK_PASTE_Y0_PCT = 0.80
BANK_PASTE_Y1_PCT = 1.00

# Feather width at the left edge of the paste so the boundary between shimmer's
# clean bank (left of x=28%) and base's bank (x=28%+) is not a hard seam.
BANK_PASTE_LEFT_FEATHER_PCT = 0.04   # fraction of canvas width

# --- Window halos --------------------------------------------------------
# (x_pct, y_pct, peak_frame_1_indexed) — all positions verified opaque in city.png
# alpha (i.e. actually on painted buildings, not in transparent sky).
WINDOW_HALOS = [
    (0.30, 0.52, 1),
    (0.36, 0.50, 3),
    (0.46, 0.50, 5),
    (0.54, 0.42, 7),   # hero-spire tip (moved down from 0.35 to stay in opaque spire)
    (0.53, 0.55, 2),
    (0.58, 0.48, 4),
    (0.68, 0.50, 6),
    (0.75, 0.58, 8),
]
HALO_RADIUS_REF   = 130             # halo radius in px at 2752-wide reference; scales with width
HALO_COLOR        = (255, 220, 150) # warm gold light
HALO_INTENSITY_BASE  = 0.32         # at center of halo, brightness added to base (0..1)
HALO_INTENSITY_SWING = 0.18         # sinusoidal ±swing on intensity → 0.14..0.50

# --- Fireflies -----------------------------------------------------------
# 45 fixed positions distributed across the full width of the bank on a
# jittered grid. Staggered phases across the 8-frame loop so different subsets
# peak in different frames — gentle, continuous "swarm of fireflies drifting
# over the bank" feel.
import random as _rng_mod
def _gen_firefly_positions(n: int, seed: int = 11) -> list[tuple[float, float, int]]:
    rng = _rng_mod.Random(seed)
    pts: list[tuple[float, float, int]] = []
    # spread evenly across x then add per-point jitter
    for k in range(n):
        t = (k + 0.5) / n                             # 0..1 evenly spaced
        xp = 0.04 + t * 0.92                          # 4% .. 96%
        xp += rng.uniform(-0.012, 0.012)              # small x jitter
        yp = rng.uniform(0.78, 0.93)                  # bank-height range
        peak = 1 + (k * 3 + rng.randint(0, 2)) % 8    # staggered across 8 frames
        pts.append((round(xp, 3), round(yp, 3), peak))
    return pts

FIREFLIES = _gen_firefly_positions(45)
FIREFLY_CORE_RADIUS_REF = 6         # solid core radius in px at 2752-wide ref
FIREFLY_HALO_RADIUS_REF = 22        # outer halo radius at 2752-wide ref
FIREFLY_CORE_COLOR      = (255, 220, 140)
FIREFLY_INTENSITY_BASE  = 0.55
FIREFLY_INTENSITY_SWING = 0.40


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
    """Add a soft radial glow onto an (H, W, 3) uint8 image array, in place.

    intensity is 0..1 — the multiplier on the peak add at the center. Falloff is
    quadratic so the halo feathers cleanly.
    """
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
    dx = xx - cx
    dy = yy - cy
    dist = np.sqrt(dx * dx + dy * dy)
    t = np.clip(dist / radius, 0, 1)
    falloff = (1 - t) ** 2                         # 1.0 at center, 0 at edge
    add_scale = falloff * intensity                # 0..1

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
    """Firefly = bright solid core + feathered halo, both additively blended."""
    if intensity <= 0 or halo_r < 2:
        return
    # Outer halo first (dimmer, larger)
    additive_blob(arr, cx, cy, halo_r, color, intensity * 0.7)
    # Solid-ish core (brighter, smaller): a short-radius blob at nearly full brightness
    additive_blob(arr, cx, cy, max(core_r * 2, core_r + 4), color, min(1.0, intensity * 1.2))


def _build_canonical_bank(shimmer_frame1: Image.Image, base_scaled: Image.Image) -> Image.Image:
    """Produce the single canonical bottom-strip image used for EVERY frame.

    Takes shimmer-frame-1 as the left portion (Gemini's clean empty bank, no
    flowers) and blends in the base's bottom strip on the right (gets the
    rowboat, stone bank, silhouettes exactly as painted). Returns a full-width
    RGBA image the size of the bottom strip (0 .. W wide, BANK_PASTE_Y0_PCT ..
    100% tall).
    """
    W, H = shimmer_frame1.size
    ay0, ay1 = int(BANK_PASTE_Y0_PCT * H), int(BANK_PASTE_Y1_PCT * H)
    strip_h = ay1 - ay0

    # Start from shimmer frame 1's bottom strip (clean empty left bank)
    bank = shimmer_frame1.crop((0, ay0, W, ay1)).copy()

    # Paste base's bottom strip (right of x=28%) over it with a left feather
    ax0, ax1 = int(BANK_PASTE_X0_PCT * W), int(BANK_PASTE_X1_PCT * W)
    base_strip = base_scaled.crop((ax0, ay0, ax1, ay1))

    strip_w = ax1 - ax0
    feather_px = max(8, int(BANK_PASTE_LEFT_FEATHER_PCT * W))
    mask_np = np.full((strip_h, strip_w), 255, dtype=np.uint8)
    for x in range(min(feather_px, strip_w)):
        mask_np[:, x] = int(round(255 * x / feather_px))
    # AND with the base's alpha so any transparent base pixels stay transparent
    base_strip_alpha = np.asarray(base_strip.split()[-1])
    combined = np.minimum(mask_np, base_strip_alpha)
    mask = Image.fromarray(combined, mode="L")
    bank.paste(base_strip, (ax0, 0), mask)
    return bank


def main() -> None:
    base_full = Image.open(BASE_PATH).convert("RGBA")

    # Load frame 1's shimmer first so we can build the canonical bank once and
    # reuse it for every frame (ensures the bank is pixel-identical in all 8).
    shimmer1_path = SHIMMER / "frame1.png"
    if not shimmer1_path.exists():
        print("ERROR: _shimmer/frame1.png missing — need frame 1 to build canonical bank")
        return
    shimmer1 = Image.open(shimmer1_path).convert("RGBA")
    W, H = shimmer1.size
    base_scaled = base_full.resize((W, H), Image.LANCZOS)
    canonical_bank = _build_canonical_bank(shimmer1, base_scaled)
    bank_y0 = int(BANK_PASTE_Y0_PCT * H)
    print(f"  built canonical bank: {canonical_bank.size} at y={bank_y0}")

    for i in range(1, N_FRAMES + 1):
        in_path = SHIMMER / f"frame{i}.png"
        out_path = ROOT / f"frame{i}.png"
        if not in_path.exists():
            print(f"skip: {in_path.name} missing")
            continue

        img = Image.open(in_path).convert("RGBA")
        scale = img.size[0] / 2752

        # Paste the canonical bank over this frame's bottom strip.
        # Same pixels on every frame → 100% consistent bank across the loop.
        img.paste(canonical_bank, (0, bank_y0))

        # --- Step C: additive halos + fireflies on numpy RGB array -----------
        rgb = np.asarray(img.convert("RGB")).copy()

        # Window halos
        halo_r = max(20, int(round(HALO_RADIUS_REF * scale)))
        for xp, yp, peak in WINDOW_HALOS:
            cx, cy = int(xp * W), int(yp * H)
            intensity = pulse(i, peak, HALO_INTENSITY_BASE, HALO_INTENSITY_SWING)
            additive_blob(rgb, cx, cy, halo_r, HALO_COLOR, intensity)

        # Fireflies
        core_r = max(3, int(round(FIREFLY_CORE_RADIUS_REF * scale)))
        halo_fr = max(10, int(round(FIREFLY_HALO_RADIUS_REF * scale)))
        for xp, yp, peak in FIREFLIES:
            cx, cy = int(xp * W), int(yp * H)
            intensity = pulse(i, peak, FIREFLY_INTENSITY_BASE, FIREFLY_INTENSITY_SWING)
            additive_firefly(rgb, cx, cy, core_r, halo_fr, FIREFLY_CORE_COLOR, intensity)

        # --- Step D: restore the base's alpha channel so the upper ~40% sky stays
        # transparent in the output (so this overlay composites cleanly over sky.png
        # in the parallax stack). Gemini outputs opaque PNGs — without this the sky
        # region would be solid white and hide whatever's behind it.
        base_alpha = np.asarray(base_scaled.split()[-1])  # H x W
        rgba = np.dstack([rgb, base_alpha])
        Image.fromarray(rgba, mode="RGBA").save(out_path, format="PNG", optimize=True)
        size_kb = out_path.stat().st_size // 1024
        print(f"  frame {i}: {out_path.name} ({W}×{H}, {size_kb} KB)")


if __name__ == "__main__":
    main()
