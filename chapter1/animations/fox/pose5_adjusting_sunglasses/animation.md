# Fox — Pose 5: Adjusting Sunglasses (sprite loop)

## Source images (required, upload both for every frame)

- **Fox base (identity anchor):** `C:\Projects\zootopia\assets\base.png`
- **Pose reference (hand on sunglasses):** `C:\Projects\zootopia\assets\ChatGPT Image Apr 20, 2026, 01_47_19 AM.png`

Identity from `base.png`. Pose from the sunglasses-touch reference. **Every frame must look essentially IDENTICAL to frame 1 with only a tiny sprite delta.**

## Animation description

Sprite loop of the sunglasses tilt. 5 frames, very gentle deltas, cycle 1 → 2 → 3 → 4 → 5 → 1.

## Sprite-animation rules

- Identity + outfit + palette + framing + scale + background from the base and pose reference — same across all frames.
- Per-frame deltas are **tiny** — sub-degree glasses tilt, 1-pixel finger shift. Nothing else changes.
- Do not re-pose the fox.

---

## Frame 1 — Matches pose reference exactly

```text
Use the uploaded fox base image (identity anchor) and the uploaded sunglasses-touch pose reference. Create a full-body image of the same fox character with identity exactly from the base, in the exact pose shown in the reference, on a clean white background, in the same crayon style. Right hand touches the sunglasses frame from below-right, index and middle fingers on the bridge or right-lens edge, glasses level, mouth with a slight smirk, tail neutral. Preserve fox identity from base: orange fur, white muzzle, white tail tip, green eyes behind sunglasses, light green shirt, purple striped tie, brown pants. Match base proportions and scale exactly. Keep all white fur fully opaque.
```

## Frame 2 — Glasses tilted +2° (right side up)

```text
Use the uploaded fox base and the sunglasses-touch pose reference. Recreate the EXACT same composition as frame 1 of the sunglasses sprite loop. Apply ONLY this micro-change: the sunglasses are tilted about 2 degrees (right side slightly up, left side slightly down). Hand position, face, outfit, background IDENTICAL. Preserve opaque white fur. Do not re-pose the fox.
```

## Frame 3 — Glasses tilted +4°, tiny sliver of green eye above left lens

```text
Use the uploaded fox base and the sunglasses-touch pose reference. Recreate the EXACT same composition as frame 1 of the sunglasses sprite loop. Apply ONLY these micro-changes: the sunglasses are tilted about 4 degrees (right side up, left side lowered), and a tiny sliver of one green eye barely peeks over the lowered left lens. Hand position, outfit, background IDENTICAL. Preserve opaque white fur. Do not re-pose the fox.
```

## Frame 4 — Glasses tilted +2° (settling)

```text
Use the uploaded fox base and the sunglasses-touch pose reference. Recreate the EXACT same composition as frame 1 of the sunglasses sprite loop. Apply ONLY this micro-change: the sunglasses are tilted about 2 degrees (halfway back toward level). Eye no longer peeks over the lens. Hand position, outfit, background IDENTICAL. Preserve opaque white fur. Do not re-pose the fox.
```

## Frame 5 — Glasses level, smirk 1px wider

```text
Use the uploaded fox base and the sunglasses-touch pose reference. Recreate the EXACT same composition as frame 1 of the sunglasses sprite loop. Apply ONLY this micro-change: the smirk is about 1 pixel wider at the raised corner. Glasses level (matching the reference), hand position, outfit, background IDENTICAL. Preserve opaque white fur. Do not re-pose the fox.
```

---

## Save frames as

- `frame1.png` … `frame5.png`
