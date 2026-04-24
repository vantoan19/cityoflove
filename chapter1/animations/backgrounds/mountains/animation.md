# Background — Mountains (sprite sway loop)

## Source image

- `C:\Projects\zootopia\assets\mountains.png`

**Every generated frame must look essentially IDENTICAL to this base image.** Only a tiny sprite-animation delta is applied per frame.

## Animation description

Sprite sway loop: the mountain layer shifts a pixel left or right in a slow rhythm. 5 frames, cycle 1 → 2 → 3 → 4 → 5 → 1.

## Sprite-animation rules

- Every frame matches the base `mountains.png` exactly in silhouette, palette, crayon stroke, and aspect ratio.
- Per-frame delta is a **tiny** horizontal shift of 1–2 pixels. Nothing else changes.

---

## Frame 1 — Identical to base

```text
Use the uploaded mountain base image. Recreate the EXACT same mountain silhouette and composition in the same crayon style, palette, and aspect ratio. This is frame 1 of a sprite sway loop — it must look effectively IDENTICAL to the base image.
```

## Frame 2 — 1px left shift

```text
Use the uploaded mountain base image. Recreate the EXACT same composition as the base. Apply ONLY this micro-change: the whole mountain silhouette is shifted about 1 pixel to the LEFT. Palette, silhouette shape, and crayon stroke IDENTICAL.
```

## Frame 3 — Back at baseline

```text
Use the uploaded mountain base image. Recreate the EXACT same composition as the base. No horizontal shift — frame sits at the baseline position, matching the base exactly.
```

## Frame 4 — 2px right shift (peak sway)

```text
Use the uploaded mountain base image. Recreate the EXACT same composition as the base. Apply ONLY this micro-change: the whole mountain silhouette is shifted about 2 pixels to the RIGHT. Palette and silhouette IDENTICAL.
```

## Frame 5 — 1px right shift (returning)

```text
Use the uploaded mountain base image. Recreate the EXACT same composition as the base. Apply ONLY this micro-change: the whole mountain silhouette is shifted about 1 pixel to the RIGHT (halfway back from the peak sway). Palette and silhouette IDENTICAL.
```

---

## Save frames as

- `frame1.png` … `frame5.png`
