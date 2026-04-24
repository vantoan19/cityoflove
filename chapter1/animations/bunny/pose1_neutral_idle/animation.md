# Bunny — Pose 1: Neutral Idle (sprite breathing loop)

## Source image (required, upload for every frame)

- **Bunny base:** `C:\Projects\zootopia\assets\basee.png`

This is the canonical bunny character — the idle pose itself. **Every generated frame must look essentially IDENTICAL to this base image.** Only a tiny sprite-animation delta is applied per frame.

## Animation description

A sprite-animation idle breathing loop: the bunny stands in the exact pose of `basee.png` and only breathes. 5 frames, tiny per-frame deltas, loop 1 → 2 → 3 → 4 → 5 → 1.

## Sprite-animation rules

- **Every frame must match `basee.png` exactly** in pose, outfit, palette, proportions, framing, scale, background, and crayon / colored-pencil style.
- Frame-to-frame changes are deliberately **tiny** — a 1–2 pixel shift of the ears, hat, or torso. Nothing else moves.
- Do not re-pose the bunny. Do not change the face, hat badge, or outfit.
- Clean white background. All white fur stays fully opaque.

---

## Frame 1 — Identical to base

```text
Use the uploaded bunny base image. Recreate the same bunny character in the EXACT same pose, outfit, palette, proportions, framing, scale, clean white background, and crayon / colored-pencil style. This is frame 1 of a sprite idle-breathing loop — it must look effectively IDENTICAL to the base image. Do not alter the pose, face, or outfit. Preserve white fur with pink inner ears, soft blush cheeks, black eyes, blue police uniform, orange reflective safety vest with yellow striping, and blue police hat with badge. Keep all white fur fully opaque.
```

## Frame 2 — Micro-breath in (ears +1px)

```text
Use the uploaded bunny base image. Recreate the exact same pose and composition as the base, on a clean white background, in the same crayon style. This is frame 2 of a sprite idle-breathing loop. Compared with the base, apply ONLY these micro-changes: both ears have risen about 1 pixel, torso a hair (1%) taller. Every other detail — hands, arms, legs, tail, hat, face, outfit, background — IDENTICAL to the base. Preserve opaque white fur. Do not re-pose the bunny.
```

## Frame 3 — Peak breath in (ears +2px, hat +1px)

```text
Use the uploaded bunny base image. Recreate the exact same pose and composition as the base, on a clean white background, in the same crayon style. This is frame 3 of a sprite idle-breathing loop — top of the inhale. Compared with the base, apply ONLY these micro-changes: both ears have risen about 2 pixels, the hat has shifted about 1 pixel upward with the body rise, torso 2% taller. Every other detail IDENTICAL. Preserve opaque white fur.
```

## Frame 4 — Exhale start (ears +1px)

```text
Use the uploaded bunny base image. Recreate the exact same pose and composition as the base, on a clean white background, in the same crayon style. This is frame 4 of the sprite idle-breathing loop — start of the exhale. Compared with the base, apply ONLY this micro-change: both ears sit about 1 pixel higher than the base (settling down from the peak). Everything else IDENTICAL. Preserve opaque white fur. Do not re-pose the bunny.
```

## Frame 5 — Settled (ears -1px)

```text
Use the uploaded bunny base image. Recreate the exact same pose and composition as the base, on a clean white background, in the same crayon style. This is frame 5 of the sprite idle-breathing loop, just before it returns to frame 1. Compared with the base, apply ONLY this micro-change: both ears sit about 1 pixel lower than the base (relaxed). Everything else IDENTICAL. Preserve opaque white fur. Do not re-pose the bunny.
```

---

## Save frames as

- `frame1.png` … `frame5.png`
