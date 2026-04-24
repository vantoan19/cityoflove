# Fox — Pose 2: Presenting Right Hand (sprite loop)

## Source images (required, upload both for every frame)

- **Fox base (identity anchor):** `C:\Projects\zootopia\assets\base.png`
- **Pose reference (arm-out "behold" gesture):** `C:\Projects\zootopia\assets\ChatGPT Image Apr 20, 2026, 01_35_47 AM.png`

The fox's identity — fur, muzzle, sunglasses, outfit, proportions, scale, crayon style — must always match `base.png`. The arm-out pose must match the pose reference. **Every frame in this animation must look essentially IDENTICAL to frame 1 with only a tiny sprite-animation delta.**

## Animation description

Sprite loop of the "behold" presenting gesture. 5 frames with very gentle per-frame deltas, cycle 1 → 2 → 3 → 4 → 5 → 1.

## Sprite-animation rules

- Every frame shares the same identity (from `base.png`), the same pose (from pose reference), the same outfit, palette, framing, scale, clean white background, and crayon style.
- Per-frame deltas are **tiny** — 1–2 pixel shifts or sub-degree tilts. Nothing else changes.
- Do not re-pose the fox. Do not change the face, sunglasses, or outfit.
- White muzzle and tail tip stay fully opaque. No paper texture, no black fill.

---

## Frame 1 — Matches pose reference exactly

```text
Use the uploaded fox base image (identity anchor) and the uploaded presenting pose reference. Create a full-body image of the same fox character with identity exactly from the base, in the exact pose shown in the pose reference, on a clean white background, in the same crayon style. Right arm extended toward screen-left in a welcoming "behold" gesture, elbow gently bent, palm open and fingers slightly spread, torso leaning slightly toward the city, tail counterbalancing right, mouth in a confident side-smile, sunglasses level. Preserve all fox identity from the base: orange fur, white muzzle, white tail tip, green eyes behind black sunglasses, light green shirt, purple striped tie, brown pants. Match the proportions and scale of the base exactly. Keep all white fur fully opaque.
```

## Frame 2 — Arm +1° higher

```text
Use the uploaded fox base image and the presenting pose reference. Recreate the EXACT same composition as frame 1 of the presenting sprite loop. Apply ONLY this micro-change: the right arm is raised about 1 degree higher. Every other detail — palm angle, fingers, torso lean, left arm, tail, face, sunglasses, outfit, background — IDENTICAL. Preserve opaque white fur. Do not re-pose the fox.
```

## Frame 3 — Arm +2° higher, palm 2° more open

```text
Use the uploaded fox base image and the presenting pose reference. Recreate the EXACT same composition as frame 1 of the presenting sprite loop. Apply ONLY these micro-changes: the right arm is raised about 2 degrees higher than the reference, and the palm tilts about 2 degrees more upward so a touch more palm is visible. Every other detail IDENTICAL. Preserve opaque white fur. Do not re-pose the fox.
```

## Frame 4 — Arm +1° higher (settling back)

```text
Use the uploaded fox base image and the presenting pose reference. Recreate the EXACT same composition as frame 1 of the presenting sprite loop. Apply ONLY this micro-change: the right arm sits about 1 degree higher than the reference (halfway settled from the peak). Palm angle, fingers, and everything else IDENTICAL. Preserve opaque white fur. Do not re-pose the fox.
```

## Frame 5 — Arm at baseline with 1px tail drift

```text
Use the uploaded fox base image and the presenting pose reference. Recreate the EXACT same composition as frame 1 of the presenting sprite loop. Apply ONLY this micro-change: the tail has drifted about 1 pixel lower than the reference. Arm, palm, face, sunglasses, outfit, and everything else IDENTICAL. Preserve opaque white fur. Do not re-pose the fox.
```

---

## Save frames as

- `frame1.png` … `frame5.png`
