# NICK — Animation Generation Guidelines

## Base & Settings

| Field | Value |
|---|---|
| Base image | `chapter3/characters/nick_date_base.png` |
| Base dimensions | 848 × 1264 (2:3) |
| `mode` | `generate` (never `edit` — resolution param silently drops in edit mode) |
| `model_tier` | `nb2` (upgrade to `pro` if style drifts after 2 regens) |
| `resolution` | `2k` |
| `aspect_ratio` | `2:3` |
| `input_image_path_1` | always `nick_date_base.png` — never chain from a prior frame |
| `negative_prompt` | `text, letters, numbers, labels, captions, watermarks, annotations, legends, solid color fills, flat colors, smooth shading, photorealistic, vector art, clean edges` |

### Style lock phrase (include in every prompt)

> Keep the exact same palette, saturation, brightness, contrast, stroke thickness, paper grain, and ink-outline weight as the reference base. Do NOT recolor, re-saturate, smooth, stylize, or re-render any pixel that is not part of the pose change described below. Every surface — fur, shirt, tie, trousers, tail — must retain loose visible crayon hatching strokes. Pure white background.

---

## Character reference

Nick is an anthropomorphic fox with:
- Orange fur filled with loose crayon hatching strokes
- White chest/muzzle area
- Dark opaque sunglasses (signature — always present unless explicitly noted)
- Confident relaxed expression
- Pink short-sleeve button-up shirt with purple/white diagonal striped tie
- Brown/tan trousers
- Big fluffy white-tipped tail, large pointed ears
- Thick wobbly ink outlines on all elements

---

## 1. `nick_leaning.png` — Hover pose

**Trigger:** played when the user hovers any chocolate bar in the box.
**Output:** `chapter3/characters/nick_leaning.png`

### Pose description
Body tilted forward ~15° from the hips toward the chocolate box (screen left/center). One hand rests on an implied table edge, fingers slightly curled. Other hand raised slightly at waist height, palm facing up as if about to gesture. Head angled downward toward the box. Sunglasses pushed slightly down the muzzle so the top of his bright green eyes are visible over the frames — his signature "paying attention" tell. Mouth closed in a small interested smile. Ears angled slightly forward. Tail curled comfortably behind him, not raised.

### Prompt template

```
You are generating a single character pose illustration. The ONE reference image is the STATIC BASE CHARACTER. Reproduce the character's style pixel-for-pixel: same palette, silhouettes, stroke texture, ink outlines, paper grain, crayon hatching on all surfaces.

COLOR AND STYLE CONSISTENCY IS THE TOP PRIORITY. Keep the exact same palette, saturation, brightness, contrast, stroke thickness, paper grain, and ink-outline weight as the reference base. Do NOT recolor, re-saturate, smooth, stylize, or re-render any pixel that is not part of the pose change described below.

Pose change from base: the fox's body leans forward ~15° from the hips, as if peering down at something on a table in front of him. One hand rests on an implied table edge, fingers slightly curled. The other hand is raised slightly at waist height, palm up, about to gesture. His head angles downward. His dark sunglasses are pushed slightly down his muzzle so the top of his bright green eyes are visible above the frames. His mouth is in a small interested closed smile. Ears angled slightly forward. Tail curled behind, not raised. Everything else — outfit, fur color, crayon style, white background — is identical to the reference.
```

---

## 2. `nick_heart.png` — Final bar reveal pose

**Trigger:** played after bar #8's message fully reveals — the sincere emotional beat.
**Output:** `chapter3/characters/nick_heart.png`

### Pose description
Standing upright (no lean), right paw placed flat over left chest — not a cartoon heart shape, just a genuine hand-on-chest gesture. Left arm loose at side. Head tilted slightly downward and to the left. Soft closed-mouth smile — genuine, not grinning. Eyes soft and direct, not squinting. Ears relaxed, not perked. Tail still — not wagging. Sunglasses on (normal position, not pushed down).

### Prompt template

```
You are generating a single character pose illustration. The ONE reference image is the STATIC BASE CHARACTER. Reproduce the character's style pixel-for-pixel: same palette, silhouettes, stroke texture, ink outlines, paper grain, crayon hatching on all surfaces.

COLOR AND STYLE CONSISTENCY IS THE TOP PRIORITY. Keep the exact same palette, saturation, brightness, contrast, stroke thickness, paper grain, and ink-outline weight as the reference base. Do NOT recolor, re-saturate, smooth, stylize, or re-render any pixel that is not part of the pose change described below.

Pose change from base: the fox stands fully upright, right paw placed flat over his left chest in a sincere hand-on-heart gesture (not a cartoon heart, just a natural paw resting on chest). Left arm hangs loosely at his side. Head tilts slightly downward and to the left. His expression is a soft genuine closed-mouth smile — warm, not grinning. Eyes are soft and direct. Ears are relaxed, not perked. Tail is still. Sunglasses remain in their normal position on his muzzle. Everything else — outfit, fur color, crayon style, white background — is identical to the reference.
```

---

## 3. Nick chuckle — 3-frame micro-animation

**Trigger:** plays over the current pose on bar #4 ("Unseen message") and bar #6 ("Tiny bravery"). Head-only swap — the body stays on the held pose underneath.
**Duration:** 300ms × 3 frames = 900ms total, then hold.
**Outputs:** `nick_chuckle_1.png`, `nick_chuckle_2.png`, `nick_chuckle_3.png`

### Frame state table

| Frame | File | Duration | Head position | Eyes | Mouth |
|---|---|---|---|---|---|
| 1 | `nick_chuckle_1.png` | 300ms | Normal upright | Normal behind sunglasses | Closed, small relaxed smile (baseline) |
| 2 | `nick_chuckle_2.png` | 300ms | Tilted back ~6° | Closed into happy crescents (visible above pushed-down sunglasses) | Open — soft short "heh" shape, not a full laugh |
| 3 | `nick_chuckle_3.png` | 300ms | Returning, ~3° back | Eyes slightly reopening, still soft | Half-closing, transitioning back to smile |

**Playback:** frame 1 → 2 → 3 → hold on the underlying pose.

### Prompt template (fill in per-frame state)

```
You are generating FRAME {N} of 3 in a chuckle micro-animation. The ONE reference image is the STATIC BASE CHARACTER. Reproduce the full character style pixel-for-pixel: same palette, ink outlines, crayon hatching, paper grain, white background.

COLOR AND STYLE CONSISTENCY IS THE TOP PRIORITY. Keep the exact same palette, saturation, brightness, contrast, stroke thickness, and crayon character as the reference. Do NOT re-render any part of the body, outfit, or tail.

This frame shows only a subtle head position change on top of the neutral standing pose:
{insert per-frame head/eye/mouth description from the state table above}

The body, shirt, tie, trousers, tail, and all outfit details are unchanged from the reference. Only the head angle, eye shape, and mouth shape differ. Everything else is identical to the reference.
```

### Per-frame overlay states (paste into prompt)

**Frame 1:**
> Head in normal upright position. Sunglasses in standard position. Mouth in a small relaxed closed smile — the baseline "about to chuckle" expression. Body completely unchanged from reference.

**Frame 2:**
> Head tilted back approximately 6° (chin up slightly, as if mid-laugh). Sunglasses pushed slightly down the muzzle so both eyes are visible — eyes closed into happy upward crescents. Mouth open in a soft short shape — a quiet "heh", not a wide open laugh, teeth just barely visible. Body completely unchanged from reference.

**Frame 3:**
> Head returning toward neutral, approximately 3° back (halfway between frame 2 and upright). Eyes reopening slightly — still soft and warm, not fully open yet. Mouth half-closing, transitioning from the open "heh" back toward a smile. Body completely unchanged from reference.

---

## Generation workflow notes

- **Never chain frames** — always pass `input_image_path_1 = nick_date_base.png` for every frame. Do not pass the previous frame as a second input.
- **For the chuckle animation**, the 3 frames are HEAD overlays. Crop/mask to the head region in code for swapping; generate full-body for consistency then extract.
- **Delta check** — after generating, verify adjacent chuckle frames differ in < 5% of pixels (only the head area should change).
- **Color check** — per-channel mean RGB should vary < 2 units across all frames of the same animation.
- **If style drifts** after 2 regenerations, switch `model_tier` to `pro`.
