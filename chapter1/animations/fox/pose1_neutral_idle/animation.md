# Fox — Pose 1: Neutral Idle (sprite breathing loop)

## Source image (required, upload for every frame)

- **Fox base:** `C:\Projects\zootopia\assets\base.png`

This is the canonical fox character — the idle pose itself. **Every generated frame must look essentially IDENTICAL to this base image.** Only a tiny sprite-animation delta is applied per frame.

## Animation description

A sprite-animation idle breathing loop: the fox stands in the exact pose of `base.png` and only breathes. 5 frames, tiny per-frame deltas, loop 1 → 2 → 3 → 4 → 5 → 1.

## Sprite-animation rules (read carefully)

- **Every frame must match `base.png` exactly** in pose, outfit, palette, proportions, framing, scale, background, and crayon / colored-pencil style.
- Frame-to-frame changes are deliberately **tiny** — a 1–2 pixel shift of the shoulders, tail tip, or tie. Nothing else moves.
- Do not re-pose the fox. Do not change the arm, leg, or head position.
- Do not re-draw the sunglasses, face, or outfit.
- Clean white background. White muzzle and tail tip stay fully opaque white. No paper texture, no black fill, no crop artifacts.

---

## Frame 1 — Identical to base

```text
Use the uploaded fox base image. Recreate the same fox character in the EXACT same pose, outfit, palette, proportions, framing, scale, clean white background, and crayon / colored-pencil style. This is frame 1 of a sprite idle-breathing loop — it must look effectively IDENTICAL to the base image. Do not alter the pose, sunglasses, face, or outfit. Preserve orange fur, white muzzle, white tail tip, green eyes behind black sunglasses, light green shirt, purple striped tie, brown pants. Keep all white fur fully opaque.
```

## Frame 2 — Micro-breath in (shoulders +1px)

```text
Use the uploaded fox base image. Recreate the exact same pose and composition as the base, on a clean white background, in the same crayon style. This is frame 2 of a sprite idle-breathing loop. Compared with the base, apply ONLY these micro-changes: shoulders lifted about 1 pixel, torso a hair (1%) wider. Every other detail — arm position, leg position, tail, tie, sunglasses, face, outfit, background — must be IDENTICAL to the base. Preserve opaque white fur. Do not re-pose the fox.
```

## Frame 3 — Peak breath in (shoulders +2px, tie drift +1px right)

```text
Use the uploaded fox base image. Recreate the exact same pose and composition as the base, on a clean white background, in the same crayon style. This is frame 3 of a sprite idle-breathing loop — the top of the inhale. Compared with the base, apply ONLY these micro-changes: shoulders lifted about 2 pixels, torso 2% wider, and the tie has drifted 1 pixel to the fox's right. Every other detail — arm position, leg position, tail, sunglasses, face, outfit, background — IDENTICAL to the base. Preserve opaque white fur.
```

## Frame 4 — Exhale start (shoulders +1px, tie back to center)

```text
Use the uploaded fox base image. Recreate the exact same pose and composition as the base, on a clean white background, in the same crayon style. This is frame 4 of a sprite idle-breathing loop — the start of the exhale. Compared with the base, apply ONLY these micro-changes: shoulders lifted about 1 pixel (settling down from frame 3), torso width back to baseline, tie has returned to center. Every other detail IDENTICAL to the base. Preserve opaque white fur. Do not re-pose the fox.
```

## Frame 5 — Settled (shoulders -1px, tail tip -1px)

```text
Use the uploaded fox base image. Recreate the exact same pose and composition as the base, on a clean white background, in the same crayon style. This is frame 5 of a sprite idle-breathing loop, just before it returns to frame 1. Compared with the base, apply ONLY these micro-changes: shoulders lowered about 1 pixel (settled below neutral), tail tip 1 pixel lower than the base. Everything else IDENTICAL to the base. Preserve opaque white fur. Do not re-pose the fox.
```

---

## Save frames as

- `frame1.png` … `frame5.png`
