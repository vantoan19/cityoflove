# Love Letter Animation Spec

## Overview

Two animation sets:
1. **Idle** (3 frames) — loops on page load, heart seal pulses gently
2. **Opening** (7 frames) — plays once on click, flap opens + letter rises

Then a CSS-only zoom transition to Chapter 1.

---

## Base Image Reference

`base/loveletter.png`

**Description:**
- Crayon / colored-pencil sketch illustration style — rough texture, visible pencil strokes
- Warm solid pink background (approx #F4A7B9)
- Pink sealed envelope centered, landscape orientation (wider than tall)
- Black crayon-drawn outlines on all shapes
- Triangular flap at top, sealed shut
- Pink heart seal centered on the envelope body (overlapping flap and body)
- Small pink floating hearts: upper-left, upper-right, left-center, right-center
- Floral sprigs: lower-left (pink blossoms + green leaves), lower-right (same)

---

## Style Rules (apply to every frame)

- Crayon / colored-pencil sketch texture throughout — no smooth gradients, no clean lines
- Same warm pink background (#F4A7B9 range)
- Same black crayon outline weight
- Same floral sprigs on lower-left and lower-right (unchanged in all frames)
- `negative_prompt` on every frame: `"text, labels, numbers, words, letters, handwriting, script, watermark"`
- `mode: generate` + `input_image_path_1: base/loveletter.png` on every frame (no chaining)
- `aspect_ratio: 16:9`
- `resolution: 2k` (2560×1440) on every frame — do NOT use edit mode as it caps at ~1376×768

---

## Set 1 — Idle Frames

Loop: frame1 → frame2 → frame3 → frame1  
Timing: 800ms per frame  
CSS fallback: heart seal `scale(1.0) → scale(1.03) → scale(1.0)`, 2.4s ease-in-out loop

### Frame 1 — Base (idle)

**File:** `loveletter/idle/frame1.png`  
**Delta:** Identical to base image — copy or regenerate exactly.

**Prompt:**
> Crayon colored-pencil sketch illustration. Warm solid pink background. Pink sealed envelope centered, slightly wider than tall, with black crayon-drawn outlines. Triangular flap at top sealed shut. Pink heart seal centered on the envelope body, vivid and intact. Small pink floating hearts: upper-left, upper-right, left-center, right-center. Floral sprigs with pink blossoms and green leaves on lower-left and lower-right. Crayon pencil texture throughout.

---

### Frame 2 — Heart Glow (idle peak)

**File:** `loveletter/idle/frame2.png`  
**Delta:** Heart seal is slightly larger (~2%) and more saturated/vivid pink — as if softly glowing. Everything else identical to frame 1.

**Prompt:**
> Crayon colored-pencil sketch illustration. Warm solid pink background. Pink sealed envelope centered, slightly wider than tall, with black crayon-drawn outlines. Triangular flap at top sealed shut. Pink heart seal centered on the envelope body — the heart is slightly more vivid and saturated than the envelope, with a soft warm glow, appearing very slightly larger and brighter as if pulsing with life. Small pink floating hearts: upper-left, upper-right, left-center, right-center. Floral sprigs with pink blossoms and green leaves on lower-left and lower-right. Crayon pencil texture throughout.

---

### Frame 3 — Base Return (idle)

**File:** `loveletter/idle/frame3.png`  
**Delta:** Same as frame 1 — heart back to normal. Loop closes here.

**Prompt:** *(same as Frame 1)*

---

## Set 2 — Opening Frames

Plays once on user click. Frames played sequentially.  
Timing: 120ms per frame (frames 1–4), 150ms per frame (frames 5–7)  
Total duration: ~0.93s

### Frame 1 — Flap Barely Lifts

**File:** `loveletter/opening/frame1.png`  
**Delta from base:** Flap apex tilts upward ~5°. A 2mm gap appears at the top-center. Heart seal stays intact and happy on the envelope body throughout all frames.

**Prompt:**
> Crayon colored-pencil sketch illustration. Warm solid pink background. Pink sealed envelope centered, slightly wider than tall, with black crayon-drawn outlines. The triangular top flap has just barely begun to lift — the apex of the flap tilts upward about 5 degrees, and a very thin 2mm gap is visible at the top-center edge where the flap separates from the envelope body. The pink heart seal is intact, cheerful, and centered on the envelope body. Small pink floating hearts: upper-left, upper-right, left-center, right-center. Floral sprigs with pink blossoms and green leaves on lower-left and lower-right. Crayon pencil texture throughout.

---

### Frame 2 — Flap 25° Open

**File:** `loveletter/opening/frame2.png`  
**Delta:** Flap lifted to ~25°, clear V-shaped gap. Interior of envelope just visible. Heart seal remains whole and intact on the envelope body — happy, not broken.

**Prompt:**
> Crayon colored-pencil sketch illustration. Warm solid pink background. Pink envelope centered, slightly wider than tall, black crayon-drawn outlines. The triangular top flap is now lifted to about 25 degrees — a clear V-shaped gap is visible at the top of the envelope, with a thin strip of dark interior showing. The pink heart seal remains whole and intact on the envelope body, unbroken and cheerful. Small pink floating hearts: upper-left, upper-right, left-center, right-center. Floral sprigs lower-left and lower-right. Crayon pencil texture throughout.

---

### Frame 3 — Flap 50° Open

**File:** `loveletter/opening/frame3.png`  
**Delta:** Flap at ~50°, wide gap, dark interior exposed. Heart seal still intact on the body. A tiny sliver of bright white letter paper peeks above the envelope opening.

**Prompt:**
> Crayon colored-pencil sketch illustration. Warm solid pink background. Pink envelope centered, black crayon-drawn outlines. The triangular top flap is now open at about 50 degrees — a wide gap exposes the dark interior of the envelope. The pink heart seal remains whole and intact on the envelope body, unbroken. A very thin sliver of bright white paper is just barely visible peeking above the top opening of the envelope. Small pink floating hearts: upper-left, upper-right, left-center, right-center. Floral sprigs lower-left and lower-right. Crayon pencil texture throughout.

---

### Frame 4 — Flap Fully Open, Letter Tip Visible

**File:** `loveletter/opening/frame4.png`  
**Delta:** Flap folded flat backward behind envelope top. Full opening exposed. Heart seal intact on the body. Bright white letter paper emerged ~15% above the opening.

**Prompt:**
> Crayon colored-pencil sketch illustration. Warm solid pink background. Pink envelope centered, black crayon-drawn outlines. The triangular top flap is fully open — folded flat backward behind the top of the envelope, nearly horizontal. The full top opening of the envelope is exposed as a wide gap. The pink heart seal remains whole and intact on the envelope body. A bright white folded letter paper has emerged about 15 percent from the opening — just the top folded edge clearly visible above the envelope rim, the paper is crisp bright white. Small pink floating hearts: upper-left, upper-right, left-center, right-center. Floral sprigs lower-left and lower-right. Crayon pencil texture throughout.

---

### Frame 5 — Letter 35% Risen

**File:** `loveletter/opening/frame5.png`  
**Delta:** Bright white letter paper risen ~35%. Upper third visible with abstract doodle lines. Heart seal still intact on envelope body below. Envelope slightly lower in composition.

**Prompt:**
> Crayon colored-pencil sketch illustration. Warm solid pink background. Pink envelope sits slightly lower in the frame, flap fully open flat behind it, black crayon-drawn outlines. The pink heart seal remains intact on the envelope body. A bright white letter paper has risen about 35 percent out of the envelope — the upper third of the letter is visible above the envelope rim. The letter paper is crisp bright white with a few horizontal abstract crayon-drawn doodle lines (purely decorative, no words). Small pink floating hearts drifting slightly upward. Floral sprigs lower-left and lower-right. Crayon pencil texture throughout.

---

### Frame 6 — Letter 65% Risen

**File:** `loveletter/opening/frame6.png`  
**Delta:** Bright white letter paper risen ~65%, dominates center. Heart seal visible on small envelope body below. Small heart doodle on the letter paper itself.

**Prompt:**
> Crayon colored-pencil sketch illustration. Warm solid pink background. Pink envelope sits in the lower portion of frame, flap open flat behind it, black crayon-drawn outlines. The pink heart seal remains intact on the small envelope body below. A bright white letter paper has risen about 65 percent out of the envelope — it is now the dominant visual element in the center of the composition. The letter is crisp bright white with several horizontal abstract doodle lines and a small crayon-drawn heart near the top center of the letter (purely decorative, no words). Small pink floating hearts drifting upward and outward. Floral sprigs at lower edges. Crayon pencil texture, warm pink palette.

---

### Frame 7 — Letter Fully Out (Transition Ready)

**File:** `loveletter/opening/frame7.png`  
**Delta:** Bright white letter fully free, floating large above small receding envelope. Heart seal visible on the tiny envelope below. Letter fills ~60% of frame height. Hearts scattered outward. Zoom target for CSS transition.

**Prompt:**
> Crayon colored-pencil sketch illustration. Warm solid pink background. A bright white letter paper is completely free from the envelope and floating prominently in the upper-center of the composition, very slightly angled as if drifting upward. The letter fills about 60 percent of the frame height. It is crisp bright white with several horizontal abstract doodle lines and a small crayon-drawn heart near the top center — no words, only decorative lines. The pink envelope is small and low in the frame, receding, its intact heart seal still visible on it. Small pink hearts scatter outward in all directions. Floral sprigs at lower edges. Crayon pencil texture throughout, warm pink tones.

---

## Phase 2 — CSS Zoom Transition (no new images)

Triggered when frame7 finishes playing.

```
duration: 800ms
easing: ease-in-out
transform: scale(1) → scale(5), centered on the letter paper element
opacity (Ch1 overlay): 0 → 1, starts at 400ms, duration 600ms
```

The letter paper's white fills the screen, then Chapter 1 layers cross-fade in on top:
1. Sky (opacity 0→1, 600ms)
2. City buildings (opacity 0→1, delay 200ms, 600ms)
3. Foreground bushes (opacity 0→1, delay 400ms, 600ms)
4. Fox character (opacity 0→1, delay 600ms, 800ms)

---

## Summary Table

| Set | Frame | File | Duration |
|-----|-------|------|----------|
| Idle | 1 | `idle/frame1.png` | 800ms |
| Idle | 2 | `idle/frame2.png` | 800ms |
| Idle | 3 | `idle/frame3.png` | 800ms |
| Opening | 1 | `opening/frame1.png` | 120ms |
| Opening | 2 | `opening/frame2.png` | 120ms |
| Opening | 3 | `opening/frame3.png` | 120ms |
| Opening | 4 | `opening/frame4.png` | 120ms |
| Opening | 5 | `opening/frame5.png` | 150ms |
| Opening | 6 | `opening/frame6.png` | 150ms |
| Opening | 7 | `opening/frame7.png` | 150ms |
| Transition | — | CSS only | 800ms |
| Ch1 reveal | — | CSS only | 600ms–1400ms |

**Total animation: ~3.4s from click to Chapter 1 fully visible.**
