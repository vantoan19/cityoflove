# Fox — Pose 4: Pointing Up (sprite loop)

## Source images (required, upload both for every frame)

- **Fox base (identity anchor):** `C:\Projects\zootopia\assets\base.png`
- **Pose reference (pointing up):** `C:\Projects\zootopia\assets\ChatGPT Image Apr 20, 2026, 01_40_20 AM.png`

Identity from `base.png`. Pose from the pointing reference. **Every frame must look essentially IDENTICAL to frame 1 with only a tiny sprite delta.**

## Animation description

Sprite loop of the "look up there" finger-point. 5 frames, very gentle deltas, cycle 1 → 2 → 3 → 4 → 5 → 1.

## Sprite-animation rules

- Identity + outfit + palette + framing + scale + background from the base and pose reference — same across all frames.
- Per-frame deltas are **tiny** — 1–2 pixel shifts or sub-degree tilts only.
- Do not re-pose the fox.

---

## Frame 1 — Matches pose reference exactly

```text
Use the uploaded fox base image (identity anchor) and the uploaded pointing-up pose reference. Create a full-body image of the same fox character with identity exactly from the base, in the exact pointing pose shown in the reference, on a clean white background, in the same crayon style. Right arm raised, elbow slightly bent, index finger extended straight up, other fingers curled, chin tilted up, mouth open mid-speech, tail arcing upward behind him. Preserve fox identity from base: orange fur, white muzzle, white tail tip, green eyes behind sunglasses, light green shirt, purple striped tie, brown pants. Match base proportions and scale exactly. Keep all white fur fully opaque.
```

## Frame 2 — Finger +1° higher

```text
Use the uploaded fox base and the pointing-up pose reference. Recreate the EXACT same composition as frame 1 of the pointing sprite loop. Apply ONLY this micro-change: the index finger pushes about 1 degree higher. Arm, chin, mouth, tail, sunglasses, outfit, background IDENTICAL. Preserve opaque white fur. Do not re-pose the fox.
```

## Frame 3 — Finger +2° higher, chin +1°

```text
Use the uploaded fox base and the pointing-up pose reference. Recreate the EXACT same composition as frame 1 of the pointing sprite loop. Apply ONLY these micro-changes: the index finger is about 2 degrees higher than the reference and the chin is about 1 degree higher. Everything else IDENTICAL. Preserve opaque white fur. Do not re-pose the fox.
```

## Frame 4 — Finger +1° higher (settling)

```text
Use the uploaded fox base and the pointing-up pose reference. Recreate the EXACT same composition as frame 1 of the pointing sprite loop. Apply ONLY this micro-change: the finger sits about 1 degree higher than the reference (halfway back from peak). Everything else IDENTICAL. Preserve opaque white fur. Do not re-pose the fox.
```

## Frame 5 — Tail -1px micro-settle

```text
Use the uploaded fox base and the pointing-up pose reference. Recreate the EXACT same composition as frame 1 of the pointing sprite loop. Apply ONLY this micro-change: the tail arcs about 1 pixel lower than the reference. Arm, finger, chin, mouth, sunglasses, outfit, background IDENTICAL. Preserve opaque white fur. Do not re-pose the fox.
```

---

## Save frames as

- `frame1.png` … `frame5.png`
