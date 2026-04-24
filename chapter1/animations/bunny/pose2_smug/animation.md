# Bunny — Pose 2: Smug / Eyebrow Raised (sprite loop)

## Source image (required, upload for every frame)

- **Bunny base (identity anchor):** `C:\Projects\zootopia\assets\basee.png`

Identity from `basee.png`. The smug pose is described in the frame 1 prompt. **Every frame must look essentially IDENTICAL to frame 1 with only a tiny sprite delta.**

## Animation description

Sprite loop of the smug "hmm, is that so?" smirk. 5 frames, very gentle deltas, cycle 1 → 2 → 3 → 4 → 5 → 1.

## Sprite-animation rules

- Identity + outfit + palette + framing + scale + background from `basee.png` — same across all frames.
- Per-frame deltas are **tiny** — 1–2 pixel shifts or sub-degree tilts only.
- Do not re-pose the bunny. Do not change the face, hat, or outfit.

---

## Frame 1 — Smug pose baseline

```text
Use the uploaded bunny base image (identity anchor). Create a full-body image of the same bunny character with identity exactly from the base, on a clean white background, in the same crayon style and same framing, scale, and proportions. Pose: same as the base with these small pose changes only — weight shifted slightly to her left leg so the left hip pops out a few pixels, right eyebrow arched noticeably higher than the left, eyes slightly narrowed, mouth closed with the right corner pulled upward in a smirk ("hmm, is that so?" expression), left ear tilting slightly outward. Hands stay on hips as in the base. Preserve white fur with pink inner ears, black eyes, blue police uniform, orange safety vest, blue police hat with badge. Keep all white fur fully opaque.
```

## Frame 2 — Head tilt +1° to bunny's right

```text
Use the uploaded bunny base image. Recreate the EXACT same composition as frame 1 of the smug sprite loop. Apply ONLY this micro-change: the head tilts about 1 degree to the bunny's right (toward the fox). Eyebrow, smirk, ears, hips, hands, hat, outfit, background IDENTICAL. Preserve opaque white fur. Do not re-pose the bunny.
```

## Frame 3 — Head tilt +2°, smirk 1px wider

```text
Use the uploaded bunny base image. Recreate the EXACT same composition as frame 1 of the smug sprite loop. Apply ONLY these micro-changes: the head tilts about 2 degrees to the bunny's right, and the smirk is about 1 pixel wider at the raised corner. Eyebrow, ears, hips, hands, hat, outfit, background IDENTICAL. Preserve opaque white fur. Do not re-pose the bunny.
```

## Frame 4 — Head tilt +1° (settling back)

```text
Use the uploaded bunny base image. Recreate the EXACT same composition as frame 1 of the smug sprite loop. Apply ONLY this micro-change: the head tilts about 1 degree to the bunny's right (settled halfway back from the peak). Everything else IDENTICAL. Preserve opaque white fur. Do not re-pose the bunny.
```

## Frame 5 — Hip +1px more pronounced

```text
Use the uploaded bunny base image. Recreate the EXACT same composition as frame 1 of the smug sprite loop. Apply ONLY this micro-change: the popped left hip is about 1 pixel more pronounced (small weight-shift overshoot). Head is level, eyebrow and smirk match frame 1. Everything else IDENTICAL. Preserve opaque white fur. Do not re-pose the bunny.
```

---

## Save frames as

- `frame1.png` … `frame5.png`
