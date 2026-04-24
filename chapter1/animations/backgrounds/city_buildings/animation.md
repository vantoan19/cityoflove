# Background — City Buildings (sprite drift loop)

## Source image

- `C:\Projects\zootopia\assets\city.png`

**Every generated frame must look essentially IDENTICAL to this base image.** Only a tiny sprite-animation delta is applied per frame.

## Animation description

Sprite drift loop: the city skyline shifts horizontally by a few pixels to sell parallax depth. 5 frames, cycle 1 → 2 → 3 → 4 → 5 → 1.

## Sprite-animation rules

- Every frame matches the base `city.png` exactly in building shapes, colors, spire positions, bottom fade-to-transparent, and crayon stroke.
- Per-frame delta is a **tiny** horizontal shift of 1–3 pixels. Nothing else changes.

---

## Frame 1 — Identical to base

```text
Use the uploaded city skyline base image. Recreate the EXACT same skyline composition, building shapes, colors, and soft fade-to-transparent at the bottom, in the same crayon style. This is frame 1 of a sprite drift loop — it must look effectively IDENTICAL to the base image.
```

## Frame 2 — 1px left drift

```text
Use the uploaded city skyline base image. Recreate the EXACT same composition as the base. Apply ONLY this micro-change: the whole skyline is shifted about 1 pixel to the LEFT. Building shapes, colors, and bottom fade IDENTICAL.
```

## Frame 3 — 2px left drift

```text
Use the uploaded city skyline base image. Recreate the EXACT same composition as the base. Apply ONLY this micro-change: shifted about 2 pixels to the LEFT. Everything else IDENTICAL.
```

## Frame 4 — 3px left drift (peak)

```text
Use the uploaded city skyline base image. Recreate the EXACT same composition as the base. Apply ONLY this micro-change: shifted about 3 pixels to the LEFT. Everything else IDENTICAL.
```

## Frame 5 — 1px left drift (returning)

```text
Use the uploaded city skyline base image. Recreate the EXACT same composition as the base. Apply ONLY this micro-change: shifted about 1 pixel to the LEFT (returning toward the baseline). Everything else IDENTICAL.
```

---

## Save frames as

- `frame1.png` … `frame5.png`
