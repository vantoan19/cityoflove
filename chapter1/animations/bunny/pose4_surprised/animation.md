# Bunny — Pose 4: Surprised (sprite loop)

## Source image (required, upload for every frame)

- **Bunny base (identity anchor):** `C:\Projects\zootopia\assets\basee.png`

Identity from `basee.png`. The surprised pose is described in the frame 1 prompt (no existing reference). **Every frame must look essentially IDENTICAL to frame 1 with only a tiny sprite delta.**

## Animation description

Sprite loop of a surprise reaction. 5 frames, very gentle deltas with one blink frame. Cycle 1 → 2 → 3 → 4 → 5 → 1.

## Sprite-animation rules

- Identity + outfit + palette + framing + scale + background from `basee.png` — same across all frames.
- Per-frame deltas are **tiny** — 1–2 pixel shifts or a simple blink.
- Do not re-pose the bunny. Do not change the face structure or outfit.

---

## Frame 1 — Surprise pose baseline

```text
Use the uploaded bunny base image (identity anchor). Create a full-body image of the same bunny character with identity exactly from the base, on a clean white background, in the same crayon style and same framing, scale, and proportions as the base. Pose: same body stance as the base with these surprise-expression changes only — eyes fully round and wide (maximum) with a small shine highlight in each eye, both ears fully extended upward and slightly apart at the tips, mouth fully open in a round "oh!", both hands floating slightly off the hips with arms bent about 15° outward, body leans back about 2°, soft pink blush circles on both cheeks. Preserve white fur with pink inner ears, blue police uniform, orange safety vest, blue police hat with badge. Keep all white fur fully opaque.
```

## Frame 2 — Eyes 1px smaller

```text
Use the uploaded bunny base image. Recreate the EXACT same composition as frame 1 of the surprise sprite loop. Apply ONLY this micro-change: both eyes are about 1 pixel smaller (a hair less wide). Ears, mouth, hands, body lean, blush, outfit, background IDENTICAL. Preserve opaque white fur. Do not re-pose the bunny.
```

## Frame 3 — Ears +1px higher

```text
Use the uploaded bunny base image. Recreate the EXACT same composition as frame 1 of the surprise sprite loop. Apply ONLY this micro-change: both ears are about 1 pixel higher. Eyes match frame 1, mouth, hands, body lean, blush, outfit, background IDENTICAL. Preserve opaque white fur. Do not re-pose the bunny.
```

## Frame 4 — Blink (eyes closed)

```text
Use the uploaded bunny base image. Recreate the EXACT same composition as frame 1 of the surprise sprite loop. Apply ONLY this micro-change: the eyes are closed, drawn as two gentle curved lines for closed eyelids (a quick blink). No irises, no highlights — just the curves. Ears, mouth, hands, body lean, blush, outfit, background IDENTICAL to frame 1. Preserve opaque white fur. Do not re-pose the bunny.
```

## Frame 5 — Mouth 1px smaller

```text
Use the uploaded bunny base image. Recreate the EXACT same composition as frame 1 of the surprise sprite loop. Apply ONLY this micro-change: the open "oh" mouth is about 1 pixel smaller in diameter (settling slightly). Eyes match frame 1, ears, hands, body lean, blush, outfit, background IDENTICAL. Preserve opaque white fur. Do not re-pose the bunny.
```

---

## Save frames as

- `frame1.png` … `frame5.png`
