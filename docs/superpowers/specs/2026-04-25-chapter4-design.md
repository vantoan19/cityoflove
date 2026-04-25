# Chapter 4 — "The Fun Part" — Design Spec

**Date:** 2026-04-25
**Status:** Approved

---

## Overview

Chapter 4 is a scroll-driven narrative chapter told through three scenes: Late Night (Scene A), The Food Date (Scene B), and The Laugh / The Eyes (Scene C). It uses the same step-navigation model as Chapter 5 — one scroll/swipe advances one beat — but with a warmer, more playful visual language. Typing reveal for prose; CSS animation reveal for special visual beats.

**Emotional arc:** Warm → Playful → Loud → Quietly tender
**Tone:** 70% playful / 30% emotional

---

## Files

| File | Purpose |
|---|---|
| `components/chapters/Chapter4/index.tsx` | React component |
| `components/chapters/Chapter4/chapter4.css` | All Ch4 styles (`ch4-` prefix) |
| `public/chapter4/bg_night_room.mp4` | Background video — Scene A night room |
| `public/chapter4/bg_tree_path.mp4` | Background video — Scene A tree path |
| `public/chapter4/bg_shelter.mp4` | Background video — Scene A shelter |
| `public/chapter4/bg_restaurant_table.mp4` | Background video — Scene B food table |

Background videos are copied from `chapter4/backgrounds/` to `public/chapter4/` so Next.js can serve them.

---

## SceneManager Changes

1. Add dynamic import: `const Chapter4 = dynamic(() => import('./chapters/Chapter4'), { ssr: false })`
2. Add render block for `currentChapter === 4`: `<Chapter4 onComplete={() => advanceChapter(5)} />`
3. Update the stub condition from `currentChapter > 3` to `currentChapter > 4` (or explicitly exclude 4)
4. `dirFor(4)` returns `'rtl'` (default) — no special transition direction needed

---

## Layer Stack

```
z-0   .ch4-bg-wash          CSS gradient, transition 2.2s ease-in-out
z-0   <video>.ch4-bg-video  4 videos, opacity 0 → 1 on activation (transition 1.8s)
z-1   .ch4-phone-glow       Radial amber glow, glowPulse 4s infinite
z-1   .ch4-warm-glow        Scene C warm overlay, fades in at beat 14
z-1   .ch4-doodle-layer     5 ambient floaters (→←, ✦, 🍃, ♡, 🍜)
z-10  .ch4-scroll           CSS grid, all 18 beats at grid-area 1/1
z-20  .ch4-hint             "scroll to begin" + bouncing ↓ arrow
z-20  .ch4-end              "Chapter 4" label + "Continue →" button
```

---

## Navigation

**Input handlers** (same as Ch5):
- `wheel` → `goTo(current + (deltaY > 0 ? 1 : -1))`
- `touchstart` / `touchend` → `goTo(...)` on swipe ≥ 40px
- `keydown ArrowDown / Space` → `goTo(current + 1)`
- `keydown ArrowUp` → `goTo(current - 1)`

**`goTo(next)` logic:**
1. Guard: `animating`, `next === current`, `next < -1`, `next >= 18` → return
2. Set `animating = true`, update `current`
3. If `prev === -1`: hide hint, short delay, then `doShow()`
4. Else: `hideBeat(prev, doShow)`
5. `doShow()` calls `showBeat(next)`, sets `animating = false` after lock duration

**Lock durations:**
- Beats 1–13: 600ms
- Beats 14–18 (Scene C): 1200ms (slower pacing)

**`hideBeat(i, cb)`:** removes `.ch4-on` from beat element and its `[data-d]` children, cancels pending typing timers, calls `cb` after transition delay.

**`showBeat(i)`:** adds `.ch4-on`, runs typing engine or triggers CSS animation, fires side effects.

---

## 18 Beats

| # | ID | Content | Reveal | Side Effect |
|---|---|---|---|---|
| 1 | ch4-b1 | "We started simple." | Typing 12ms | Stagger doodle layer in |
| 2 | ch4-b2 | Chat bubbles: "Jokes." / "Teasing." | CSS slide L+R | — |
| 3 | ch4-b3 | "A suspicious amount of jokes." | Typing 12ms | — |
| 4 | ch4-b4 | "There were nights that just didn't end." + stars window | Typing 12ms | `moreStars()` after 900ms |
| 5 | ch4-b5 | "Not because of insomnia." / "Because of you." | Typing 12ms | — |
| 6 | ch4-b6 | Leaves box: "We smelled tree leaves / like we were doing something illegal." | CSS reveal | Zone 2 → tree path video |
| 7 | ch4-b7 | "(We were not.)" | Typing 12ms | — |
| 8 | ch4-b8 | "The small talks." | Typing 12ms | — |
| 9 | ch4-b9 | "The 'how was your day' / that somehow unpacked everything." | Typing 12ms | — |
| 10 | ch4-b10 | "The kind that makes a long day / feel like it was worth it." | Typing 12ms | — |
| 11 | ch4-b11 | Shelter box: "You're my little ritual shelter." | Typing 12ms | Zone 3 → shelter video |
| 12 | ch4-b12 | Food table: 🍜🍜🥟🧋 | CSS pop-in | Zone 4 → restaurant video |
| 13 | ch4-b13 | Arrow pair + "👉👈 / (you know what I mean)" | CSS reveal | Arrow ping animation starts |
| 14 | ch4-b14 | "You laughed." | CSS laughBloom | Zone 5; warm glow on; heart doodle; sparkle burst at 600ms |
| 15 | ch4-b15 | "You smiled." | Typing 35ms | Zone 5 |
| 16 | ch4-b16 | "You coddled." | Typing 35ms | — |
| 17 | ch4-b17 | "And your eyes did that thing…" | Typing 35ms | — |
| 18 | ch4-b18 | "where they ✦spark✦ / a little more than necessary." | CSS reveal | Zone 6; sparkle burst on .ch4-spark-w at 400ms; ambient sparkles linger; show end button after ~2s |

Beats b5, b9, b10: second paragraph has `data-d` delay (400ms / 200ms / 250ms) — typing of second line begins after delay.

---

## Typing Engine

Same architecture as Ch5's `typeBeat`, simplified (no M1/M2 mode switching):

```
charMs: 12 for beats 1–13, 35 for beats 14–18
paraGap: 280ms between paragraphs
initial delay: 80ms (small pause lets beat fade-in complete)
```

- Snapshot `text = p.textContent` for each `<p>` in the beat on mount
- On `showBeat`: clear each `<p>`, type character-by-character with cumulative timeouts
- For `data-d` paragraphs: add `.ch4-on` to the `<p>` at the scheduled start time
- Cancel all timers in `hideBeat` (via `typingTimers` Map)
- Beats with CSS reveal (b2, b6, b12, b13, b14, b18): skip typing entirely, CSS handles it

---

## Background Zone Map

```javascript
const ZONES = [
  { beat: 0,  zone: '0', video: 'ch4-vi-night',   glow: true  },
  { beat: 3,  zone: '1', video: null,              glow: true  },
  { beat: 5,  zone: '2', video: 'ch4-vi-tree',    glow: false },
  { beat: 7,  zone: '2', video: null,              glow: false },
  { beat: 10, zone: '3', video: 'ch4-vi-shelter',  glow: false },
  { beat: 11, zone: '4', video: 'ch4-vi-food',    glow: false },
  { beat: 13, zone: '5', video: null,              glow: false },
  { beat: 17, zone: '6', video: null,              glow: false },
]
```

`setZone(zone, videoId, glow)` mirrors Ch5 pattern: sets `body.dataset.zone` or `root.dataset.zone`, pauses/hides all videos, activates the target video.

**CSS gradient zones (on `.ch4-bg-wash`):**
- Zone 0: `#1A1F3A → #2A1F2E → #1A1520` (deep night navy)
- Zone 1: `#1E2440 → #2E2444 → #1A1828` (night, slightly warmer)
- Zone 2: `#1A1C30 → #232040 → #141220` (tree path dark)
- Zone 3: radial amber hint + `#1A1828` (shelter warm glow)
- Zone 4: `#FFF3E0 → #FFE4C8 → #FFCCB0` (warm restaurant day)
- Zone 5: `#FFBFA0 → #FFD3B6 → #FFB880` (peak warmth, laugh)
- Zone 6: `#FFD3B6 → #F4EEFF → #FFD3B6` (soft lavender landing)

---

## CSS Animations

### Standard beat reveal
```css
.ch4-beat {
  opacity: 0; transform: translateY(24px);
  transition: opacity 0.85s cubic-bezier(0.22, 0.61, 0.36, 1),
              transform 0.85s cubic-bezier(0.22, 0.61, 0.36, 1);
}
.ch4-beat.ch4-on { opacity: 1; transform: none; }
```

### Chat bubble slide (beat 2)
```css
@keyframes ch4BblL { from { opacity:0; transform:translateX(-28px); } to { opacity:1; transform:none; } }
@keyframes ch4BblR { from { opacity:0; transform:translateX(28px);  } to { opacity:1; transform:none; } }
.ch4-beat.ch4-on .ch4-bbl-l { animation: ch4BblL 0.7s ease-out forwards; }
.ch4-beat.ch4-on .ch4-bbl-r { animation: ch4BblR 0.7s ease-out 0.2s forwards; }
```

### Food pop-in (beat 12)
```css
@keyframes ch4FoodPop {
  0%   { opacity:0; transform:scale(0.72) translateY(10px); }
  70%  { opacity:1; transform:scale(1.05) translateY(-2px); }
  100% { opacity:1; transform:scale(1)   translateY(0);    }
}
.ch4-beat.ch4-on .ch4-food-em:nth-child(1) { animation: ch4FoodPop 0.6s ease-out 0ms   forwards; }
.ch4-beat.ch4-on .ch4-food-em:nth-child(2) { animation: ch4FoodPop 0.6s ease-out 150ms forwards; }
.ch4-beat.ch4-on .ch4-food-em:nth-child(3) { animation: ch4FoodPop 0.6s ease-out 300ms forwards; }
.ch4-beat.ch4-on .ch4-food-em:nth-child(4) { animation: ch4FoodPop 0.6s ease-out 450ms forwards; }
```

### Arrow ping (beat 13)
```css
@keyframes ch4ArrL { 0%,100%{transform:translateX(0) rotate(-4deg);opacity:.6} 35%{transform:translateX(+8px) rotate(-1deg);opacity:1} }
@keyframes ch4ArrR { 0%,100%{transform:translateX(0) rotate(4deg); opacity:.6} 35%{transform:translateX(-8px) rotate(1deg); opacity:1} }
.ch4-arr-l { animation: ch4ArrL 1.60s ease-in-out infinite; animation-play-state: paused; }
.ch4-arr-r { animation: ch4ArrR 1.85s ease-in-out infinite; animation-play-state: paused; }
.ch4-beat.ch4-on .ch4-arr-l,
.ch4-beat.ch4-on .ch4-arr-r { animation-play-state: running; }
```

### Laugh bloom (beat 14)
```css
@keyframes ch4LaughBloom {
  0%   { opacity:0; transform:scale(0.88) translateY(16px); letter-spacing:-0.02em; }
  55%  { opacity:1; transform:scale(1.04) translateY(-3px); letter-spacing:0.05em; }
  75%  {            transform:scale(1.01) translateY(-1px); letter-spacing:0.025em; }
  100% { opacity:1; transform:scale(1)   translateY(0);    letter-spacing:0.01em; }
}
.ch4-beat.ch4-on .ch4-t-laugh { animation: ch4LaughBloom 1.1s cubic-bezier(0.22, 0.61, 0.36, 1) forwards; }
```

### Spark word glow (beat 18)
```css
.ch4-spark-w { transition: color 0.8s ease, text-shadow 0.8s ease; }
.ch4-beat.ch4-on .ch4-spark-w { color: #FFB347; text-shadow: 0 0 14px rgba(255,179,71,0.5); }
```

### Ambient sparkle (beat 18 — linger)
```css
@keyframes ch4AmbTwinkle { 0%,100%{opacity:.15;transform:scale(.8)} 50%{opacity:.65;transform:scale(1.1)} }
```

### Sparkle burst (JS — fires on b14 and b18)
- Same `sparkleFly` keyframe and `launchSparkles()` function as the demo
- Uses `position:fixed`, `document.body.appendChild`, removes on `animationend`

### Phone glow pulse
```css
@keyframes ch4GlowPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
```

---

## Typography

All `font-family: 'Poppins', sans-serif` (already loaded globally).

| Class | Size | Weight | Style |
|---|---|---|---|
| `.ch4-t-main` | clamp(20px, 2.6vw, 30px) | 600 | normal |
| `.ch4-t-line` | clamp(18px, 2.2vw, 26px) | 400 | normal |
| `.ch4-t-aside` | clamp(14px, 1.7vw, 19px) | 400 | italic |
| `.ch4-t-tiny` | clamp(13px, 1.5vw, 16px) | 400 | italic |
| `.ch4-t-med` | clamp(18px, 2.2vw, 26px) | 500 | normal |
| `.ch4-t-shelt` | clamp(22px, 2.9vw, 36px) | 600 | normal |
| `.ch4-t-emoji` | clamp(36px, 5.5vw, 60px) | — | — |
| `.ch4-t-laugh` | clamp(34px, 4.2vw, 54px) | 700 | normal, `#D4756B` |
| `.ch4-t-smile` | clamp(22px, 2.8vw, 34px) | 500 | normal |
| `.ch4-t-coddl` | clamp(20px, 2.4vw, 30px) | 400 | italic |
| `.ch4-t-eyes` | clamp(18px, 2.2vw, 26px) | 400 | normal, `#9A9098` |
| `.ch4-t-small` | clamp(15px, 1.8vw, 20px) | — | — |

`.ch4-lt` — dark text `#3A2420` for beats 12–13 (light scene B background).

---

## Doodle Layer (5 ambient floaters)

All fade in staggered (400ms apart) when beat 1 fires:

| Element | Position | Visual | Animation |
|---|---|---|---|
| `.ch4-dk-arr` | top:8%, left:12% | `→ ←`, amber 22% | diagonal drift ±6px/±5px, 7s |
| `.ch4-dk-sp` | top:14%, right:9% | `✦`, lavender 25% | scale pulse, 5s |
| `.ch4-dk-leaf` | top:55%, right:7% | `🍃`, green 22% | vertical float + rotate, 9s |
| `.ch4-dk-heart` | top:72%, left:7% | `♡`, pink 20% | float + rotate, 6s — hidden until beat 14 |
| `.ch4-dk-ramen` | top:40%, right:5% | `🍜`, amber 20% | vertical float, 8s |

---

## End State

After beat 18 typing completes + 2s delay:
- `.ch4-end` fades in at bottom center (same structure as `.ch5-end`)
- "Chapter 4" label (uppercase, spaced, low opacity)
- "Continue →" button — transparent with light border; click fires `onComplete()`

---

## Verification Checklist

- [ ] Each beat advances cleanly on scroll — no jump, no flicker
- [ ] Backwards navigation works (no reverse animation glitches)
- [ ] Background gradient: dark navy at top → golden at restaurant → peach → lavender
- [ ] Video crossfades: night → tree → shelter → restaurant, each transition smooth
- [ ] Phone glow: on during beats 1–4, off from beat 5
- [ ] Chat bubbles: left slides in, right slides in 200ms later
- [ ] Stars window: 8 base stars, 11 more appear after 900ms on beat 4
- [ ] Arrow ping: left and right never peak simultaneously (1.6s vs 1.85s)
- [ ] Food emojis: 4 items pop in staggered (0 / 150 / 300 / 450ms)
- [ ] "You laughed." bloom: scale + letter-spacing + terracotta color
- [ ] Sparkle burst: 7 particles on beat 14 (laugh), 7 on beat 18 (spark word)
- [ ] "spark" word glows amber when beat 18 is active
- [ ] Ambient sparkles: 2 near "spark", pulsing at different periods
- [ ] Heart doodle: invisible before beat 14, fades in quietly
- [ ] Typing: fast (12ms) in Scenes A+B, slower (35ms) in Scene C
- [ ] End button appears after beat 18, fires onComplete on click
- [ ] Mobile: clamp() font sizes readable, chat bubbles don't overflow
