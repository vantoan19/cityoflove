# Chapter 3 — "The Night That Almost Didn't Happen"
## Design Spec
_2026-04-24_

---

## Overview

`chapter3/index.html` is a single-page, fixed-viewport experience with two sequential phases. The Ch3 night parallax background runs only in Phase 1. Phase 2 is a full-screen chocolate box game with no background or characters.

---

## Phase 1 — Small Talk

### Background
- Ch3 night parallax active from load: sky layer (5% scroll speed) + city layer (40% scroll speed)
- Ambient loops running: star twinkle, river shimmer, city window halos, fireflies
- Scroll is disabled during Phase 1 — scroll events are captured and used to advance beats instead

### Characters
- Ch1 fox (left side) and Ch1 bunny (right side), fixed position on screen
- CSS night-lighting overlay applied to each character wrapper:
  - Fox: `mix-blend-mode: multiply` gradient — cool blue from left, warm amber from right (city glow on his right)
  - Bunny: same technique, gradient flipped (city glow on her left)
- Characters crossfade between poses (0.3s ease) on each beat advance

### Narration beats

| # | Text | Fox pose | Bunny pose |
|---|------|----------|------------|
| 1 | "There was a night that almost didn't exist." | pose1_neutral_idle | pose1_neutral_idle |
| 2 | "A badminton session." | pose4_pointing_up | pose5_amused |
| 3 | "A message." | pose6_finger_guns | pose3_curious_pointing |
| 4 | "A low battery." | pose3_shrug | pose4_surprised |
| 5 | "And somehow…" | pose1_neutral_idle | pose6_warm_happy |
| 6 | _(silent hold — characters fade out)_ | fade to opacity 0 | fade to opacity 0 |

**Text appearance:** Caveat font, off-white `#FAFAF0`, centered between the two characters, `font-size: clamp(24px, 3.5vw, 48px)`. Fades in over 0.5s, holds, fades out over 0.4s before next beat.

### Advance mechanic
- Auto-timer: 2s after text fully appears → advance to next beat
- Tap/click anywhere on screen → advance immediately
- Scroll event (any direction) → advance immediately
- Beat 6 (silent hold): 1.5s, then characters fade to `opacity: 0` over 0.6s → Phase 2 begins

---

## Transition — Phase 1 → Phase 2

1. Characters fade to `opacity: 0` (0.6s ease)
2. Night parallax fades to `opacity: 0` simultaneously (0.6s ease)
3. `chocolate_box_open.png` slides up from below into view (0.8s ease-out) — covers 100% of viewport
4. Phase 2 interaction becomes active

---

## Phase 2 — Chocolate Game

### Layout
- Full-screen render: `chocolate_box_open.png` (2k asset), `width: 100vw; height: 100vh; object-fit: contain`, dark background behind (`#0d0a1a`)
- No background parallax, no characters
- The box image contains the full scene: open box with 8 bar compartments visible

### Bar buttons
- Each bar has a small rounded HTML button element absolutely positioned over its compartment (not baked into the image asset)
- Button style: `border-radius: 999px`, soft warm cream background (`#F5EFE0`), ink border (`#2A2118`), `~40px` wide, Caveat font label — "open"
- Positions computed at runtime: JS measures the rendered image rect (`getBoundingClientRect`) and maps each bar's grid cell (2 rows × 4 cols) to screen coordinates
- Bar #8 button: shows padlock icon instead of "open", pointer-events disabled until bars 1–7 are opened

### Bar hover
- Hovering a bar (not its button): bar lifts `translateY(-8px)` + shadow deepens (280ms ease-out)
- On hover-leave: returns to rest (280ms ease-in-out)
- The shimmer sweep (`shimmer_sweep.png`) plays once on each hover-enter, clipped to the wrapper shape

### Click interaction — unwrap sequence
Clicking a bar's button triggers the unwrap animation:

| Frame | Asset | Duration | Transition |
|---|---|---|---|
| 1 | `bar_N_wrapped.png` | — | hard swap |
| 2 | `bar_N_unwrap_2_cornerlift.png` | 120ms | hard swap |
| 3 | `bar_N_unwrap_3_topflap45.png` | 180ms | hard swap |
| 4 | `bar_N_unwrap_4_topflap90.png` | 220ms | hard swap |
| 5 | `bar_N_unwrap_5_fullyopen.png` | 240ms | hard swap |
| 6 | `bar_N_unwrap_6_tucked.png` | 200ms | crossfade 180ms |

During unwrap: bar element translates `translateY(-12px)` over the full ~960ms (ease-out) + subtle rotation wobble `rotate(0 → -2deg → 1deg → 0)`.

After frame 6 settles (250ms delay): the button disappears and the message reveals above the bar.

### Message reveal
- Text: Caveat font, ink `#2A2118`, `~32px`, slight random rotation between `-1.5deg` and `+1.5deg`
- Position: floats just above the unwrapped bar, anchored to bar's center-top
- Animation: `opacity: 0→1` + `translateY(8px→0)` over 400ms; crayon underline swoosh draws in from left 200ms after text starts
- Only one message visible at a time — opening a different bar fades the previous message out (300ms) before the new unwrap starts
- The bar's open button does not reappear once a bar is opened

### Bar #8 lock
- While locked: button shows padlock icon, clicking triggers padlock jiggle (`rotate(-8deg → 8deg → -8deg → 0)` over 400ms) + ghost caption "open the others first" fades in briefly
- When bars 1–7 are all opened: lock-break animation plays automatically:
  - Bar pulses `scale(1 → 1.06 → 1)` (400ms)
  - Padlock rattles (250ms)
  - Padlock snaps open — swap to `padlock_open.png` (200ms)
  - Padlock lifts off `translateY(-24px) opacity→0` + sparkle cross (350ms)
  - Wrapper desaturation lifts `saturate(0.85→1)` + warm glow pulse (500ms)
- After lock-break: bar #8 button becomes active

---

## Asset dependencies

All assets referenced here must exist before implementation. Key ones:

**Ch1 characters (already exist):**
- `chapter1/animations/fox/pose{1..7}/frame{1..5}.png`
- `chapter1/animations/bunny/pose{1..6}/frame{1..5}.png`

**Ch3 backgrounds (already exist):**
- `chapter3/backgrounds/sky.png`
- `chapter3/backgrounds/city.png`
- `chapter3/backgrounds/sky_overlays/frame{1..4}.png`
- `chapter3/backgrounds/city_overlays/frame{1..8}.png`
- `chapter3/backgrounds/city_night/frames/frame{1..8}.png`

**Ch3 chocolate assets (to be created or confirmed):**
- `chapter3/chocolate_box_open.png`
- `chapter3/bars/bar_{1..8}_wrapped.png`
- `chapter3/bars/bar_{1..8}_unwrap_{2..6}.png`
- `chapter3/bars/shimmer_sweep.png`
- `chapter3/bars/padlock_closed.png`
- `chapter3/bars/padlock_open.png`
- `chapter3/bars/sparkle_cross.png`
- `chapter3/bars/message_underline.png`

---

## Navigation
- Entry: linked from `chapter2/index.html` "next chapter →" button
- Exit: after bar #8's message reveals, a soft "next chapter →" button fades in at the bottom
