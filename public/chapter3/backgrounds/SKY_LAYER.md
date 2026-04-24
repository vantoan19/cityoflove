# Ch3 Sky Layer — Starry Night

> **Static base:** [`sky.png`](./sky.png) (already drawn — do not regenerate)
> **Overlays:** [`sky_overlays/`](./sky_overlays/)

The sky is the back-most parallax layer. Full-bleed deep-indigo canvas with a painted star field, a faint Milky Way band running diagonally, and pale lavender cloud wisps in the upper corners. The base painting is static; motion is layered on via SVG + CSS overlays.

Goal: the sky should feel **quiet but alive** — no flashy motion, just stars that breathe and a barely-there drift.

---

## Base: `sky.png`

| Field | Value |
|---|---|
| Dimensions | file's native resolution; full-bleed, 16:9 composed |
| Palette | deep cobalt indigo `#1A2B5C` base, lighter indigo `#2D3F75` where the Milky Way glows, pale lavender `#C8B8D8` on cloud wisps |
| Texture | painted paper grain; tiny star dots baked into the field |
| What's baked in | cloud wisps (upper-left + upper-right), Milky Way diagonal band, dense static star field |
| What's NOT baked in | twinkle halos, the city silhouette, searchlight glow — those are overlays |

`sky.png` is **approved and final**. Do not regenerate unless explicitly requested.

---

## Animation overlays

### A. `sky_overlays/stars.svg` — twinkle layer (REQUIRED)

SVG on top of `sky.png` with ~40 `<circle>` stars positioned over the brightest spots in the painted field. We're not re-drawing the field — we're *accenting* ~40 of the painted stars so they twinkle.

**Groups — staggered twinkle so they never sync:**

| Group | Count | Star size | Animation |
|---|---|---|---|
| A | 14 | 2–3px | `opacity: 0.5 → 1.0 → 0.5`, 2.8s loop, no offset |
| B | 14 | 2–3px | same, 3.6s loop, offset start 1.3s |
| C | 12 | 1.5–2.5px | same, 4.4s loop, offset start 2.2s |

**Hero stars (5 total, distributed across groups):**
- Size 4–5px
- Plus `scale(1 → 1.2 → 1)` synced to their twinkle peak
- Plus a 4-point cream cross-flare (4 thin elongated rhombuses, `#FFF5D4`, `opacity: 0 → 0.8 → 0`)

**Placement rules:**
- Pick the 40 brightest painted stars in `sky.png` by eye
- Even distribution across the sky — no clumping in one quadrant
- Denser along the Milky Way diagonal to reinforce the painted band

### B. Milky Way pulse — CSS only (no new asset)

Applied directly to the `sky.png` element:

```css
animation: milky-breathe 10s ease-in-out infinite;
@keyframes milky-breathe {
  0%, 100% { filter: brightness(0.95); }
  50%      { filter: brightness(1.05); }
}
```

Near-imperceptible but gives the whole sky a slow heartbeat.

### C. Sky drift — CSS only (no new asset)

Applied to the sky container:

```css
animation: sky-drift 45s ease-in-out infinite;
@keyframes sky-drift {
  0%, 100% { background-position: 0 0; }
  50%      { background-position: 30px 0; }
}
```

Sells a slow air current without any animated cloud asset.

---

## Asset generation prompts

Only use these if `sky.png` needs to be regenerated. For `stars.svg` below, hand-author the SVG (don't image-gen it).

### `sky.png` (reference prompt — DO NOT RERUN without approval)

> Full-bleed night sky painted with visible oil-pastel / crayon brush strokes on textured paper. Deep cobalt indigo base `#1A2B5C`. A faint lighter-indigo Milky Way band sweeps diagonally from upper-left to lower-right. Pale lavender cloud wisps `#C8B8D8` tuck into the upper-left and upper-right corners, drawn with soft feathered strokes. Dense field of small cream-white star dots scattered across the canvas, concentrated along the Milky Way band. No moon, no city, no ground. Hand-drawn feel, not photographic. Paper grain visible throughout. 16:9 aspect.

### `sky_overlays/stars.svg`

Author by hand. No image-gen. Structure:

```xml
<svg viewBox="0 0 1672 941" ...>
  <g id="stars-a">
    <!-- 14 <circle> elements with class="twinkle-a" -->
  </g>
  <g id="stars-b">
    <!-- 14 <circle> elements with class="twinkle-b" -->
  </g>
  <g id="stars-c">
    <!-- 12 <circle> elements with class="twinkle-c" -->
  </g>
  <g id="stars-hero">
    <!-- 5 <g> groups each containing a circle + 4 cross-flare rhombuses -->
  </g>
</svg>
```

Accompanying CSS carries the per-group `@keyframes`.

---

## Z-order (bottom → top)

1. `sky.png` — absolute background, 5% scroll speed
2. `sky_overlays/stars.svg` — same scroll as sky
3. *(everything above is `city.png` and forward — see [`CITY_LAYER.md`](./CITY_LAYER.md))*
