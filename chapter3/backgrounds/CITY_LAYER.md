# Ch3 City Layer — River Shimmer + Gentle Lights

> **Static base:** [`city.png`](./city.png) (already drawn — do not regenerate)
> **Final frames:** [`city_overlays/frame{1..8}.png`](./city_overlays/) — 8-frame loop

The city layer animates as **one unified sprite-frame loop** over the base `city.png`. Each final frame is produced by a **two-stage pipeline**:

1. **API stage** — nano-banana generates 8 river-shimmer variants of `city.png` where only the painted water reflections subtly shift. Saved as `city_overlays/_shimmer/frame{1..8}.png` (intermediate — kept on disk so halos can be re-tuned without re-running the API).
2. **Composite stage** — a local Python script draws window halos + fireflies programmatically (PIL) on top of each river-shimmer frame, using fixed positions and deterministic opacity pulses. Final output saved as `city_overlays/frame{1..8}.png`.

**What changed vs. the earlier plan:** beam searchlights are **removed entirely** (they were the hardest element to make look consistent). Window halos and fireflies are now drawn programmatically in PIL — precise, zero drift, perfect frame-to-frame stability.

---

## Base: `city.png`

| Field | Value |
|---|---|
| Dimensions | 5504 × 3072 (16:9) |
| Transparency | upper ~40% is real alpha (the sky shows through) |
| Contents | mountains (left third), Zootopia skyline (center-right), hero spire (tallest tower, near center), river with vertical reflection streaks in amber / marigold / pink / teal / magenta, small rowboat silhouette, stone bank/pier (bottom), wildflower fringe (bottom-left only) |

`city.png` is **approved and final**. Do not regenerate.

---

## Stage 1 — River shimmer (API-generated)

**Output:** 8 intermediate frames `city_overlays/river_shimmer_frame{1..8}.png`, each at 2k resolution (2752 × 1536).

### What moves

Only the **vertical reflection streaks within the river band** (canvas y between 55% and 78%). Nothing else changes — not mountains, not buildings, not silhouettes, not the sky, not the rowboat, not the bank, not the flowers.

### Shimmer focal points

Six fixed focal points within the river band. Each one has a radius of influence where pixels undergo a small horizontal displacement per frame. Outside the radius, pixels stay at baseline.

| # | x (% canvas) | y (% canvas) | Radius (% canvas width) | Associated streak color |
|---|---|---|---|---|
| 1 | 28% | 66% | 6% | amber/marigold (from left-skyline lit windows) |
| 2 | 38% | 70% | 5% | pink (neon) |
| 3 | 46% | 68% | 5% | amber/marigold |
| 4 | 54% | 67% | 8% | **magenta** (hero-spire — largest, most visible) |
| 5 | 64% | 69% | 6% | teal |
| 6 | 76% | 67% | 6% | amber/marigold |

### Per-frame horizontal displacement (in pixels)

Each focal point oscillates on its own sinusoidal phase. Phase step is 1/8 of a full cycle per frame. Amplitude is ±2 px (the magenta hero-spire point gets ±3 px — thickest streak, most visible motion).

| Frame | Point 1 | Point 2 | Point 3 | Point 4 (magenta) | Point 5 | Point 6 |
|---|---|---|---|---|---|---|
| 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2 | +1 | +1 | +1 | +2 | +1 | +1 |
| 3 | +2 | +2 | +2 | +3 | +2 | +2 |
| 4 | +1 | +1 | +1 | +2 | +1 | +1 |
| 5 | 0 | 0 | 0 | 0 | 0 | 0 |
| 6 | −1 | −1 | −1 | −2 | −1 | −1 |
| 7 | −2 | −2 | −2 | −3 | −2 | −2 |
| 8 | −1 | −1 | −1 | −2 | −1 | −1 |

Loop wraps smoothly: frame 8 → frame 1 is a natural continuation of the sine wave.

### Global sprite-animation rules (API stage)

1. **Identity anchor:** every frame matches `city.png` pixel-for-pixel in palette, silhouettes, strokes, paper grain, framing, transparent sky region.
2. **Only river pixels change.** Everything above canvas y 55% and below canvas y 78% is untouched (except where displacement carries a streak pixel into the adjacent band).
3. **NO FLOWERS ANYWHERE.** Unlike the base (which has a wildflower fringe in the bottom-left), the animated frames contain NO flowers. Do NOT draw flowers, wildflowers, foliage, grass, leaves, plants, or vegetation anywhere. The bottom-left region must be empty stone bank — continuous with the bank extending to the right. The compositor also scrubs this region as a safety net, but the API should not generate flowers in the first place.
4. **No color / saturation / contrast drift** outside the river band.

---

## Stage 2 — Window halos + fireflies (programmatic PIL)

A Python script — `chapter3/gen_city_overlays.py` — runs after the API stage. For each river-shimmer frame it:

1. Loads the river-shimmer frame at its native resolution.
2. Draws eight window halos at **fixed pixel positions** with per-frame opacity pulses.
3. Draws five fireflies at **fixed pixel positions** with per-frame opacity pulses.
4. Saves the composite as `city_overlays/frame{i}.png`.

### Window halos

Eight fixed positions in the opaque city region. Same positions in every frame — only opacity changes.

| # | x (% canvas) | y (% canvas) | Pulse phase (frame of peak) |
|---|---|---|---|
| 1 | 32% | 55% | 1 |
| 2 | 37% | 45% | 3 |
| 3 | 47% | 48% | 5 |
| 4 | 54% | 35% | 7 |
| 5 | 53% | 55% | 2 |
| 6 | 58% | 48% | 4 |
| 7 | 68% | 50% | 6 |
| 8 | 75% | 58% | 8 |

**Halo style:** radial gradient, warm gold center (`#FFE8A8` at full opacity) fading to 0% at 18 px radius (in a 2752-wide frame — scaled with frame width). Additive blend mode — halo adds light to the baked window color, never replaces it.

**Opacity pulse:** `alpha(i) = 0.25 + 0.25 · cos(2π · (frame − peak_frame) / 8)`. That's a smooth sinusoid ranging 0%→50%, peaking at `peak_frame`, troughing 4 frames later. Every halo is always visible at some alpha between 0 and 50% — nothing ever fully disappears.

### Fireflies

Five fixed positions over the bank and flowers. Same positions in every frame — only opacity changes.

| # | x (% canvas) | y (% canvas) | Pulse phase (frame of peak) |
|---|---|---|---|
| 1 | 9% | 84% | 2 |
| 2 | 32% | 78% | 4 |
| 3 | 48% | 87% | 6 |
| 4 | 64% | 82% | 8 |
| 5 | 82% | 87% | 1 |

**Firefly style:** 4 px solid golden core (`#F5D06A`), 12 px feathered halo fading to 0% alpha at the outer edge. Additive blend.

**Opacity pulse:** `alpha(i) = 0.20 + 0.40 · cos(2π · (frame − peak_frame) / 8)`. Ranges 0%→60%, peaking at `peak_frame`. Slightly stronger amplitude than window halos so fireflies read as the more active element.

### Why programmatic for these two layers

- **Zero drift.** Halo positions, radii, colors, opacities are mathematically identical across frames — the AI can't "wander" them.
- **Fast.** Compositing 8 frames in PIL takes under 5 seconds total.
- **Easy to iterate.** Tweak halo color/radius/phase in the script, re-run, done — no API calls.

---

## Z-order in the full Ch3 stack (bottom → top)

1. `sky.png` — 5% scroll
2. `sky_overlays/frame{1..4}.png` — 5% scroll (star twinkle on the sky)
3. `city.png` — 40% scroll
4. `city_overlays/frame{1..8}.png` — the unified city-layer loop, 40% scroll *(sits below characters)*
5. Nick + Judy — 50% scroll
6. Chocolate box — 50% scroll

---

## Pipeline to run

```bash
# Stage 1 — generate 8 river-shimmer frames via nano-banana
#   (one API call per frame, base-only reference, mode=generate, resolution=2k)
# Script: chapter3/gen_city_river_frames.py  (prompts nano-banana sequentially)

# Stage 2 — composite halos + fireflies on top
py chapter3/gen_city_overlays.py
# Produces city_overlays/frame1.png ... frame8.png
```

Both scripts will live in `chapter3/` alongside `gen_sky_twinkle_frames.py`.
