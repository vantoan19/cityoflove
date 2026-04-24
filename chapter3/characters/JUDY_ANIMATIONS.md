# JUDY — Animation Generation Guidelines

## Base & Settings

| Field | Value |
|---|---|
| Base image | `chapter3/characters/judy_date_base.png` |
| Base dimensions | 848 × 1264 (2:3) |
| `mode` | `generate` (never `edit` — resolution param silently drops in edit mode) |
| `model_tier` | `nb2` (upgrade to `pro` if style drifts after 2 regens) |
| `resolution` | `2k` |
| `aspect_ratio` | `2:3` |
| `input_image_path_1` | always `judy_date_base.png` — never chain from a prior frame |
| `negative_prompt` | `text, letters, numbers, labels, captions, watermarks, annotations, legends, solid color fills, flat colors, smooth shading, photorealistic, vector art, clean edges` |

### Style lock phrase (include in every prompt)

> Keep the exact same palette, saturation, brightness, contrast, stroke thickness, paper grain, and ink-outline weight as the reference base. Do NOT recolor, re-saturate, smooth, stylize, or re-render any pixel that is not part of the pose change described below. Every surface — fur, dress, ears, shoes — must retain loose visible crayon hatching strokes. Pure white background. Fur must remain near-white with only the faintest light grey hatching, NOT grey.

---

## Character reference

Judy is an anthropomorphic rabbit with:
- Near-white fur with only the faintest light-grey crayon hatching (NOT grey)
- Long tall rabbit ears, white exterior with soft pink inner-ear hatching
- Large expressive dark eyes with rosy cheek blush marks
- Small pink nose, warm smile
- Dusty rose A-line short dress with small bow at collar, filled with crayon hatching
- Simple flat grey shoes
- Thick wobbly ink outlines on all elements, pure white background

---

## 1. `judy_leaning.png` — Hover pose

**Trigger:** paired with `nick_leaning.png` — both characters lean in when any bar is hovered.
**Output:** `chapter3/characters/judy_leaning.png`

### Pose description
Body leaning forward ~15° from the hips toward the chocolate box (screen center/right). Both forearms resting on an implied table edge, hands forward near the box. Ears tilted slightly forward and down — engaged, curious. Eyes wide with curiosity. Small closed-mouth smile. Head angled down toward the box. One foot slightly lifted at the heel (weight shifted forward). Dress hangs naturally with the forward lean.

### Prompt template

```
You are generating a single character pose illustration. The ONE reference image is the STATIC BASE CHARACTER. Reproduce the character's style pixel-for-pixel: same palette, silhouettes, stroke texture, ink outlines, paper grain, crayon hatching on all surfaces.

COLOR AND STYLE CONSISTENCY IS THE TOP PRIORITY. Keep the exact same palette, saturation, brightness, contrast, stroke thickness, paper grain, and ink-outline weight as the reference base. Fur must remain near-white with only the faintest light grey hatching. Do NOT recolor, re-saturate, smooth, stylize, or re-render any pixel that is not part of the pose change described below.

Pose change from base: the rabbit's body leans forward ~15° from the hips, as if peering down at something on a table in front of her. Both forearms rest on an implied table edge, hands forward near the object. Her ears tilt slightly forward and downward — engaged and curious. Her eyes are wide with curiosity. She has a small closed-mouth smile. Her head angles down toward the box. One foot is slightly lifted at the heel with weight shifted forward. The dusty rose dress hangs naturally with the lean. Everything else — fur color, crayon style, white background — is identical to the reference.
```

---

## 2. `judy_reaching.png` — Unwrap grab pose

**Trigger:** plays on click of a wrapped bar — the moment Judy reaches for it (0.2s fade-in, snappier than normal).
**Output:** `chapter3/characters/judy_reaching.png`

### Pose description
Body still slightly leaned in from the hover. Right arm extended forward and downward, paw open with fingers soft and slightly spread — about to pick something up. Left hand still resting on the implied table. Head angled to follow her right hand. Mouth slightly open in a small anticipatory "oh" shape. Ears upright and alert. Tail visible behind her with a slight upward curve (excited but controlled). The extended right paw appears to align with the top-right corner of the active chocolate bar.

### Prompt template

```
You are generating a single character pose illustration. The ONE reference image is the STATIC BASE CHARACTER. Reproduce the character's style pixel-for-pixel: same palette, silhouettes, stroke texture, ink outlines, paper grain, crayon hatching on all surfaces.

COLOR AND STYLE CONSISTENCY IS THE TOP PRIORITY. Keep the exact same palette, saturation, brightness, contrast, stroke thickness, paper grain, and ink-outline weight as the reference base. Fur must remain near-white with only the faintest light grey hatching. Do NOT recolor, re-saturate, smooth, stylize, or re-render any pixel that is not part of the pose change described below.

Pose change from base: the rabbit's body is slightly leaned forward (less than the hover lean — about 8°). Her right arm is extended forward and downward, paw open with fingers soft and slightly spread, as if about to pick something up from a table. Her left hand rests on the implied table edge. Her head turns to follow her right hand, angling downward. Her mouth is slightly open in a small anticipatory "oh" shape — not a smile, just a soft open expression of focus. Her ears are upright and alert. A small tail is visible behind her with a slight upward curve. The dusty rose dress drapes naturally. Everything else — fur color, crayon style, white background — is identical to the reference.
```

---

## 3. `judy_excited_point.png` — Reaction pose

**Trigger:** Judy's assigned pose for bars #2 and #8 — excited, pointing at or toward the box.
**Output:** `chapter3/characters/judy_excited_point.png`

### Pose description
Body upright with a slight forward lean of energy. One arm (right or left) extended forward and slightly upward, index finger pointing toward the box, the gesture filled with delight. Other hand raised near her face or mid-chest with excitement. Mouth open in a wide happy grin. Eyes wide and sparkling. Ears perked fully upright, slightly apart from excitement. Weight on one foot, slight bounce energy in the stance. Rosy cheeks prominent.

### Prompt template

```
You are generating a single character pose illustration. The ONE reference image is the STATIC BASE CHARACTER. Reproduce the character's style pixel-for-pixel: same palette, silhouettes, stroke texture, ink outlines, paper grain, crayon hatching on all surfaces.

COLOR AND STYLE CONSISTENCY IS THE TOP PRIORITY. Keep the exact same palette, saturation, brightness, contrast, stroke thickness, paper grain, and ink-outline weight as the reference base. Fur must remain near-white with only the faintest light grey hatching. Do NOT recolor, re-saturate, smooth, stylize, or re-render any pixel that is not part of the pose change described below.

Pose change from base: the rabbit is energetically upright with one arm extended forward and slightly upward, index finger pointing ahead with delight. Her other hand is raised near her face or mid-chest in an excited gesture. Her mouth is open in a wide happy grin. Her eyes are wide and bright. Her ears are fully perked upright, slightly apart from excitement. Her weight shifts to one foot with bounce energy in her stance. Her rosy cheeks are prominent. The dusty rose dress moves naturally with the energetic pose. Everything else — fur color, crayon style, white background — is identical to the reference.
```

---

## 4. Judy bounce — 3-frame animation

**Trigger:** plays on bar #3 ("Almost didn't happen") — full 1.0s cycle played twice, then settles into `judy_excited_point.png`.
**Duration:** 150ms + 200ms + 150ms = 500ms per cycle × 2 = ~1.0s total.
**Outputs:** `judy_bounce_prep.png`, `judy_bounce_peak.png`, `judy_bounce_land.png`

### Frame state table

| Frame | File | Duration | Body height | Feet | Arms | Ears | Mouth |
|---|---|---|---|---|---|---|---|
| 1 | `judy_bounce_prep.png` | 150ms | Compressed ~8% shorter — knees bent deep, body squished down | Both flat on ground | Arms tucked slightly inward | Drooping slightly forward | Scrunched pre-launch grin — lips pressed together with effort |
| 2 | `judy_bounce_peak.png` | 200ms | Stretched ~6% taller than neutral — full extension | Both feet off ground, gap visible below | Arms out wide to both sides | Straight up and slightly apart — maximum height | Wide open-mouth grin, teeth visible, eyes wide and round |
| 3 | `judy_bounce_land.png` | 150ms | Compressed ~4% (softer than prep) — knees bent on landing | Just touched down | Arms swinging back inward | Mid-flop, halfway between up and drooping | Closed happy smile — soft landing relief |

**Playback:** prep → peak → land → prep → peak → land (2 full cycles), then crossfade to `judy_excited_point.png`.

### Prompt template (fill in per-frame state)

```
You are generating FRAME {N} of 3 in a bounce animation cycle. The ONE reference image is the STATIC BASE CHARACTER. Reproduce the full character style pixel-for-pixel: same palette, ink outlines, crayon hatching, paper grain, white background.

COLOR AND STYLE CONSISTENCY IS THE TOP PRIORITY. Keep the exact same palette, saturation, brightness, contrast, stroke thickness, and crayon character as the reference. Fur must remain near-white. Do NOT re-render any part of the character that is not changing in this frame.

This frame shows the following bounce state:
{insert per-frame description from the state table above}

The dusty rose dress moves naturally with the body position — compress or stretch slightly with the body. The fur color, dress color, shoe color, ink outlines, and white background are all identical to the reference.
```

### Per-frame overlay states (paste into prompt)

**Frame 1 — bounce-prep:**
> The rabbit's body is compressed approximately 8% shorter than the reference — knees are bent deep, the torso is squished downward as if loading energy for a jump. Both feet are flat on the ground. Arms are tucked slightly inward toward the body. Ears droop slightly forward from the compressed posture. Her expression is a scrunched pre-launch grin — lips pressed together with effort and anticipation. The dress compresses naturally with the body.

**Frame 2 — bounce-peak:**
> The rabbit's body is stretched approximately 6% taller than the reference — full upward extension at the peak of the jump. Both feet are off the ground with a visible gap beneath them. Arms are spread out wide to both sides. Ears are straight upward and slightly apart — at their maximum height. Her expression is a wide open-mouth grin with teeth visible, eyes wide and round with joy. The dress flares outward slightly at the skirt with the upward motion.

**Frame 3 — bounce-land:**
> The rabbit has just landed — body compressed approximately 4% (softer than the prep frame, a gentle absorption). Knees are slightly bent on landing impact. Arms are swinging back inward toward her sides. Ears are mid-flop — halfway between fully upright and drooping, caught in motion. Her expression is a soft closed happy smile — the relief and delight of a good landing. The dress settles naturally downward.

---

## Generation workflow notes

- **Never chain frames** — always pass `input_image_path_1 = judy_date_base.png` for every frame. Do not pass the previous frame as a second input.
- **Fur color is the most common failure mode** — if any frame shows grey fur instead of near-white, regenerate immediately with stronger color-lock language.
- **Bounce proportions** — the body scale changes (+6% / −8% / −4%) should feel exaggerated and cartoony, not subtle. If the model produces a too-subtle bounce, add "the body scale change is deliberately exaggerated in cartoon style" to the prompt.
- **Dress behavior** — for bounce-peak, explicitly mention the skirt flaring; for prep/land, mention it compresses/drapes naturally. The dress is the most visible indicator of body scale change.
- **Delta check** — after generating, verify the bounce frames each differ from the base in the 5–15% range (body scale changes should touch a meaningful portion of pixels).
- **Color check** — per-channel mean RGB should vary < 2 units across all 3 bounce frames.
- **If style drifts** after 2 regenerations, switch `model_tier` to `pro`.
