# Background — Sky (sprite pan loop)

## Source image

- `C:\Projects\zootopia\assets\sky.png`

**Every generated frame must look essentially IDENTICAL to this base image.** Only a tiny sprite-animation delta is applied per frame.

## Animation description

Sprite pan loop: the sky painting drifts a few pixels horizontally over 5 frames. Cycle 1 → 2 → 3 → 4 → 5 → 1.

## Sprite-animation rules

- Every frame matches the base `sky.png` exactly in palette, composition, crayon stroke texture, and aspect ratio.
- Per-frame delta is a **tiny** horizontal shift (1–4 pixels). No repainting.
- Fill any new edge content with natural sky extension so the frame stays fully populated. No paper texture, no black fill.

---

## Frame 1 — Identical to base

```text
Use the uploaded wide sky base image. Recreate the same sky painting in the EXACT same crayon / colored-pencil style, aspect ratio, palette, and composition. This is frame 1 of a sprite pan loop — it must look effectively IDENTICAL to the base image. Preserve crayon stroke texture and every cloud-mass position.
```

## Frame 2 — 1px left drift

```text
Use the uploaded wide sky base image. Recreate the EXACT same composition as the base on the same aspect ratio, in the same crayon style. Apply ONLY this micro-change: the whole sky painting is shifted about 1 pixel to the LEFT. Fill the right edge naturally so the frame is fully populated. Palette and gradient IDENTICAL.
```

## Frame 3 — 2px left drift

```text
Use the uploaded wide sky base image. Recreate the EXACT same composition as the base. Apply ONLY this micro-change: shifted about 2 pixels to the LEFT compared with the base. Fill the right edge naturally. Everything else IDENTICAL.
```

## Frame 4 — 3px left drift

```text
Use the uploaded wide sky base image. Recreate the EXACT same composition as the base. Apply ONLY this micro-change: shifted about 3 pixels to the LEFT. Fill the right edge naturally. Everything else IDENTICAL.
```

## Frame 5 — 4px left drift (pre-loop wrap)

```text
Use the uploaded wide sky base image. Recreate the EXACT same composition as the base. Apply ONLY this micro-change: shifted about 4 pixels to the LEFT, with fresh sky content filling the right edge so the loop wraps smoothly back to frame 1. Palette and gradient IDENTICAL.
```

---

## Save frames as

- `frame1.png` … `frame5.png`
