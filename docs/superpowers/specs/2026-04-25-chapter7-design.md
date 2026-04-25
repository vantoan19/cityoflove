# Chapter 7 — "What I Learned" Design Spec
**Date:** 2026-04-25
**Status:** Approved

---

## Overview

Chapter 7 follows the combined chapter 5+6 (speedrun + blur). It is the emotional resolution — calm, warmth, self-growth through love. The visual metaphor is a growing sprout: as the user reads, the plant grows.

**Core mechanic:** The chapter 2 love letter scroll mechanic is reused on the left side. A new `chapter7/letter_long.png` (same lined-paper sketch style) carries the chapter 7 script. As the letter scrolls, the sprout on the right grows through 6 stages via GSAP ScrollTrigger.

---

## Layout

```
┌─────────────────────────────┬──────────────────────────┐
│                             │                          │
│    LETTER (left ~55%)       │   SPROUT (right ~45%)    │
│    scrolls / pans           │   sticky, grows with     │
│    same mechanic as ch2     │   scroll progress        │
│                             │                          │
└─────────────────────────────┴──────────────────────────┘
```

- Left panel: `ch7-letter-wrap` — contains the tall `letter_long.png` with HTML text overlaid, pans vertically via GSAP as user scrolls (identical to chapter 2 implementation)
- Right panel: `ch7-sprout-panel` — `position: sticky; top: 0; height: 100vh` — shows one of 6 sprout images, cross-fades between stages based on scroll progress

---

## Scroll Mechanic

### Letter (left)
Reuse chapter 2's pan logic exactly:
- `letter_long.png` probed for aspect ratio on load
- Letter height = `window.innerWidth * imgRatio` (portrait letter in left column)
- GSAP animates `y` of the letter element based on scroll position
- Text messages (`.ch7-message`) positioned absolutely on the letter, fade in as letter pans to their position via IntersectionObserver

### Sprout (right)
- 6 image stages: `/chapter7/sprout_stage_1.png` → `sprout_stage_6.png`
- All 6 images preloaded on mount
- Scroll progress `p = scrollY / (document.body.scrollHeight - window.innerHeight)` clamped 0→1
- Stage index = `Math.floor(p * 6)` clamped to 0–5
- Cross-fade: current image fades out (opacity 0, duration 0.6s), next fades in (opacity 1)
- Transition triggered only when stage index changes (not on every scroll event)

---

## Script — Letter Content

The letter `chapter7/letter_long.png` is a new asset in the same style as ch2 (lined paper, sketch border), but with the chapter 7 script hand-written. The text is also overlaid as HTML for accessibility and typing effects.

### Text beats mapped to scroll stages

| Scroll % | Stage | Text |
|----------|-------|------|
| 0–16% | 1 — tiny sprout | *"After all the noise…"* / *"there was this quiet."* |
| 17–33% | 2 — seedling | *"Staying near you makes the world feel calm."* |
| 34–50% | 3 — growing | *"We were learning."* / *"Not from a book."* / *"Just two people, figuring it out."* |
| 51–66% | 4 — branching | *"We're learning how to love each other."* / *"And that, somehow, is its own kind of brave."* |
| 67–83% | 5 — lush | *"Something unexpected started happening."* / *"I started liking myself more."* / *"Not because you fixed me."* / *"But because loving you made me want to be worth it."* |
| 84–100% | 6 — blossoming | *"You make the me inside me want to become a better me."* / *"And that's the most unexpected gift."* |

---

## Assets Required

### New assets to generate
| Asset | Notes |
|-------|-------|
| `public/chapter7/letter_long.png` | Same sketch style as ch2 letter — lined paper, warm sketch border. Blank lines only (no text — text overlaid as HTML). Taller than ch2 to accommodate 6 beats. |

### Existing assets reused
| Asset | Source |
|-------|--------|
| `public/chapter7/sprout_stage_1–6.png` | Generated ✅ |
| Scroll/pan logic | Chapter 2 `index.tsx` |
| GSAP | Already in project |

---

## Component Structure

```
components/chapters/Chapter7/
  index.tsx          — main component
  chapter7.css       — styles
```

### `index.tsx` skeleton

```tsx
'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './chapter7.css'

const STAGES = [1,2,3,4,5,6].map(n => `/chapter7/sprout_stage_${n}.png`)

export default function Chapter7({ onComplete }: { onComplete: () => void }) {
  // Letter pan logic (same as ch2)
  // Sprout stage switching on scroll
  // 6 preloaded images, cross-fade on stage change
}
```

---

## CSS Notes

- `ch7-root`: `display: flex; height: 100vh; overflow: hidden`
- `ch7-letter-col`: `width: 55%; position: relative; overflow: hidden`
- `ch7-sprout-col`: `width: 45%; position: sticky; top: 0; height: 100vh`
- `ch7-sprout-img`: `position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: opacity 0.6s ease`
- All 6 sprout images stacked, only active one has `opacity: 1`

---

## Spec Self-Review

- ✅ No TBD sections
- ✅ Letter asset generation is the only open item (clearly scoped)
- ✅ Scroll logic reuses proven ch2 code — no reinvention
- ✅ Sprout switching is simple index math, no drift risk
- ✅ Scoped to a single chapter component — no architectural changes needed
