# Chapter 7 — Sprout Growth Image Set
## Image Generation Guide (nano-banana)

---

## Global Style Reference

**Art style:** Colored-pencil sketch illustration on a pure white background.
The style must exactly match the Zootopia-inspired characters in this project (Nick the fox, Judy the bunny):
- Hand-drawn pencil outlines — slightly imperfect, warm, not mechanical
- Hatched colored-pencil fill — visible crosshatch strokes inside shapes
- Soft crayon-like texture throughout
- No clean digital lines, no gradients, no photorealistic shading
- No text, labels, numbers, or words anywhere in the image

**Tone:** Warm, hand-made, gentle — like a sketch from a personal notebook.

---

## Shared Composition Rules (apply to ALL 6 images)

| Property | Value |
|----------|-------|
| Canvas | 2752 × 1536 px (2K 16:9 — matches all other project backgrounds) |
| Background | Very light warm yellow — almost white, like aged paper (#FFFCF0 range). Subtle sketch texture: faint pencil grain or soft hatching over the background, very light, barely visible. Warm and gentle, not stark white. |
| Sprout horizontal position | Right half of canvas — stem base anchored at **x ≈ 75%** (≈2064px from left) |
| Sprout vertical position | Soil mound base at **y ≈ 93%** from top — just a small bottom padding, nearly touching the bottom edge |
| Growth direction | Strictly upward from the fixed base point |
| Left half (0–50% width) | Kept clean white — reserved for text overlay in the layout |
| Soil mound | Same small warm-earth-brown rounded mound — identical size, shape, position in every image |
| Color temperature | Warm greens only — sage, mint, soft olive. No cold/blue-green tones |
| Stem/leaf color | Consistent warm sage-green across all 6 stages, gaining richness gradually |

> **Critical:** This is a **sprout/seedling progression only** — no tree growth. All 6 stages remain at sprout or small seedling scale. The stem base never moves. Soil mound is pixel-identical in feel across all images. These 6 frames must look like animation frames of the same plant — same style, same colors, same position, only the growth state changes.

---

## Negative Prompt (apply to ALL 6 images)

```
text, words, labels, numbers, letters, watermark, signature, realistic, photographic,
3D render, flat vector, gradient background, cold green, blue-green, harsh lines,
clean digital illustration, smooth shading, anime, cartoon flat style
```

---

## Image 1 — Tiny Sprout

**Filename:** `sprout_stage_1.png`

**Growth state:**
A single tiny sprout just emerging from the soil mound. One thin curved stem, 2 small round cotyledon leaves (seed leaves) at the very tip. The entire plant is very small — stem height roughly **6% of canvas height** (~92px above soil mound).

**Sketch detail:**
- Stem: one thin pencil line, slightly curved, warm brown
- Leaves: 2 small symmetrical oval leaves, lightly hatched in soft warm green (sage)
- Soil mound: small rounded mound, warm earth brown, light hatching
- Pencil lines are light and tentative — just barely there

**Color palette:**
- Leaves: soft sage green `#B2CC8F`
- Stem: light warm brown `#A07850`
- Soil: warm earth `#C4976A`

**Emotional tone:** Delicate, new, quietly hopeful.

---

## Image 2 — Small Seedling

**Filename:** `sprout_stage_2.png`

**Growth state:**
The stem has grown taller — **~10% of canvas height** (~154px above soil mound). The two cotyledon leaves remain at a lower node. Two new slightly larger heart-shaped leaves appear higher up on the stem. The stem is slightly thicker than stage 1.

**Sketch detail:**
- Stem: slightly thicker, same warm brown, light hatching beginning near the base
- Lower leaves: same cotyledon pair from stage 1, now slightly lower on stem
- Upper leaves: 2 new heart-shaped leaves, more defined pencil-hatched veins
- Soil mound: identical to stage 1

**Color palette:**
- Leaves: slightly richer warm green `#9DC468`
- Stem: warm brown `#9B6B3A`
- Soil: same as stage 1

**Emotional tone:** Growing with small confidence, still tender.

---

## Image 3 — Growing Seedling

**Filename:** `sprout_stage_3.png`

**Growth state:**
Stem is now **~15% of canvas height** (~230px above soil mound). Slightly woody at the base. 4–5 leaves total: the original cotyledons low on the stem plus 2–3 new rounded/heart-shaped leaves higher up. Leaves have clearly visible pencil-hatched veins.

**Sketch detail:**
- Stem base: beginning to show faint bark texture through short hatched strokes
- Leaves: varied slightly in size — lower leaves older/smaller, upper leaves fresher/larger
- A very faint suggestion of roots visible just at the soil mound edge (2–3 thin lines going into the mound)

**Color palette:**
- Leaves: warm sage-green `#8FC45A`
- Stem/young trunk: medium warm brown `#8B5A30`
- Root hint: same brown, very faint

**Emotional tone:** Establishing itself. Quiet determination.

---

## Image 4 — Young Sapling

**Filename:** `sprout_stage_4.png`

**Growth state:**
The stem is now **~20% of canvas height** (~307px above soil mound). Slightly thicker and beginning to look woody at the base. 2 short side branches near the top, each with 2–3 small leaves. Still clearly a seedling, not a tree.

**Sketch detail:**
- Trunk: clear bark texture through hatched parallel strokes, warm brown
- Branches: short, angled upward at ~45°, thinner than trunk
- Leaves: clustered at branch tips, small rounded shapes, lightly hatched
- Base flare: slight widening at soil mound, suggesting root grip

**Color palette:**
- Leaves: warm mid-green `#7BBF45`
- Trunk: warm brown `#7A4E28`
- Branch tips: slightly lighter warm brown

**Emotional tone:** Young but real. This is becoming a tree.

---

## Image 5 — Taller Sapling

**Filename:** `sprout_stage_5.png`

**Growth state:**
The stem is **~26% of canvas height** (~400px above soil mound). Fuller seedling with 3–4 side shoots, 8–10 leaves total. The leaves are lush and overlapping slightly. Still a seedling — no tree trunk, no bark, just a well-developed leafy sprout with a confident stem.

**Sketch detail:**
- Trunk: confident hatched bark, more visible knots/texture
- Branches: varying lengths, upper ones shorter, lower ones slightly longer — natural tree silhouette
- Leaves: varied in size, clustered in small groups of 2–4 per branch, a few slightly yellowed at edges (warm golden tint) suggesting health not decay
- The overall silhouette is clearly a young tree

**Color palette:**
- Leaves: rich warm green `#6AB535`, with a few leaves in golden-warm `#C8A832`
- Trunk: deep warm brown `#6B4020`

**Emotional tone:** Thriving. Full of quiet energy.

---

## Image 6 — Small Leafy Tree in Full Bloom

**Filename:** `sprout_stage_6.png`

**Growth state:**
The stem is **~32% of canvas height** (~490px above soil mound). A lush, full seedling — 4–5 side shoots, 12–14 leaves of varying sizes, some overlapping, a few with warm golden-green edges. Still unmistakably a sprout/seedling, not a tree. 2–3 tiny soft peach-pink blossom buds tucked among the upper leaves.

**Sketch detail:**
- Trunk: rich hatched bark with visible character — slight bends, natural imperfections
- Branches: a full branching structure, upper canopy branches smaller
- Leaves: generous coverage, overlapping naturally, varied sizes, pencil-hatched veins
- Blossoms: 2–3 tiny 4-petal flower clusters (small, not dominant), soft peach-pink, lightly hatched
- The overall shape is a small, complete, lovingly-drawn tree

**Color palette:**
- Leaves: lush warm green `#5AAA28`
- Leaf accents: warm golden edge tint `#C8A832`
- Blossoms: soft peach-pink `#F0A898`
- Trunk: deep warm brown `#5A3418`

**Emotional tone:** Complete. Quietly in love with being alive.

---

## Generation Notes

- Use `mode="generate"` for all 6 images (no input image — pure generation)
- Resolution: **2752 × 1536** (2K 16:9 — same as all other project backgrounds)
- Generate one at a time, verify stage consistency before proceeding to next
- If a stage drifts from the sketch style (becomes too clean/digital), add to prompt: *"rough pencil lines, visible hand-drawn strokes, imperfect hatching, colored-pencil texture"*
- The soil mound must appear identical in all 6 — if it drifts, note and correct in subsequent prompts
- The left half of every image must stay clean white — if any sketch elements bleed left, regenerate

---

## Master Prompt Template

```
Wide 16:9 illustration, pure white background.
A single [GROWTH DESCRIPTION] growing from a small rounded soil mound,
positioned in the RIGHT HALF of the frame at roughly three-quarters from the left edge,
soil mound sitting just above the very bottom edge of the frame — minimal bottom padding only.
The left half of the image has no plant elements — just the soft warm background.
The plant occupies only the lower-right quadrant of the frame.
Background is a very light warm yellow like aged sketch paper, with faint pencil grain texture — not pure white.
Colored-pencil sketch illustration style matching the Zootopia character reference,
hand-drawn pencil outlines with hatched colored-pencil fill,
soft crayon-like texture, slightly imperfect warm linework,
warm sage-green leaves with pencil-hatched veins,
warm brown stem with hatched texture,
small rounded warm-earth-brown soil mound at base,
no text, no labels, no scenery, no sky, no cast shadows
```
