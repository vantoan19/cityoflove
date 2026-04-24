# Background — Foreground Bushes + Stone Wall (sprite sway loop)

## Source image

- `C:\Projects\zootopia\assets\foreground.png`

**Every generated frame must look essentially IDENTICAL to this base image.** Only a tiny sprite-animation delta is applied per frame — and only the bushes move. **The stone wall is identical in every frame.**

## Animation description

Sprite sway loop: gentle wind through the bushes while the stone wall stays perfectly still. 5 frames, cycle 1 → 2 → 3 → 4 → 5 → 1.

## Sprite-animation rules

- Every frame matches the base `foreground.png` exactly in composition, palette, crayon style, and stone wall detail.
- The stone wall, its stones, cracks, and textures must be **byte-for-byte identical** across all 5 frames.
- Only the bush tilt changes — sub-degree tilts. No other motion.
- Clean background. No paper texture.

---

## Frame 1 — Identical to base

```text
Use the uploaded foreground base image (stone wall with bushes on top). Recreate the EXACT same composition in the same crayon style, palette, and aspect ratio. This is frame 1 of a sprite sway loop — it must look effectively IDENTICAL to the base image.
```

## Frame 2 — Bushes tilt 1° LEFT (wall unchanged)

```text
Use the uploaded foreground base image. Recreate the EXACT same composition as the base. Apply ONLY this micro-change: the bushes tilt about 1 degree to the LEFT from their base origins. The stone wall and every stone, crack, and texture detail are IDENTICAL to the base. No other changes.
```

## Frame 3 — Bushes back at baseline (wall unchanged)

```text
Use the uploaded foreground base image. Recreate the EXACT same composition as the base. The bushes are at their baseline upright position (matching the base exactly). Stone wall IDENTICAL to the base.
```

## Frame 4 — Bushes tilt 1° RIGHT (wall unchanged)

```text
Use the uploaded foreground base image. Recreate the EXACT same composition as the base. Apply ONLY this micro-change: the bushes tilt about 1 degree to the RIGHT from their base origins. Stone wall IDENTICAL to the base. No other changes.
```

## Frame 5 — Bushes tilt 0.5° RIGHT (returning)

```text
Use the uploaded foreground base image. Recreate the EXACT same composition as the base. Apply ONLY this micro-change: the bushes tilt about 0.5 degrees to the RIGHT (halfway back toward upright). Stone wall IDENTICAL to the base.
```

---

## Save frames as

- `frame1.png` — bushes neutral
- `frame2.png` — bushes 1° left
- `frame3.png` — bushes neutral
- `frame4.png` — bushes 1° right
- `frame5.png` — bushes 0.5° right
