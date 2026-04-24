# Zootopia Story Website — Design Spec
**Date:** 2026-04-24
**Scope:** MVP — Chapter 1 only (Chapters 2–9 stubbed)

---

## Overview

A single-page interactive story experience called *Zootopia: A City of Many Flavors*. The reader taps through 6 dialogue lines in Chapter 1, accompanied by a layered animated background and two sprite-animated characters (Nick the fox, Judy the bunny). A CTA at the end transitions to a stub for Chapter 2.

**Tone:** 70% playful / 30% emotional. Witty, slightly poetic. Short impactful lines.
**Target emotion:** smiling, softly touched, curious, open — never pressured.

---

## Tech Stack

- **Framework:** Next.js 14+ (App Router) + React + TypeScript
- **Styling:** Tailwind CSS + CSS Modules for animation keyframes
- **Fonts:** Inter / Poppins (headings), loaded via `next/font`
- **Assets:** Static PNGs served from `/public/chapter1/`
- **Deployment:** Vercel (free tier, auto-detects Next.js, one-command deploy)

---

## Architecture

### Navigation model
- **Hybrid:** tap/click advances beats *within* a chapter; a CTA button triggers an animated transition *between* chapters
- Navigation style is per-chapter (Ch1 = tap to advance; future chapters may use scroll or auto-play)

### Single-page Scene Manager
One Next.js route (`/`). A `SceneManager` component owns `currentChapter` state and renders the active chapter. Transitions use a `ChapterTransition` overlay — no routing, no URL changes for MVP.

```
app/page.tsx
└── SceneManager            ← currentChapter: number, transitioning: boolean
    ├── ChapterTransition   ← full-screen fade overlay
    ├── Chapter1/           ← active for MVP
    │   ├── Background      ← 5 CSS-animated layers
    │   ├── Characters      ← Nick + Judy sprite switcher
    │   ├── DialogueBox     ← tap-to-advance, beat dots, CTA
    │   └── NavigationHint  ← "tap to continue" pulse
    └── ChapterStub         ← Chapters 2–9 placeholder
```

---

## File Structure

```
city/
├── app/
│   ├── page.tsx                   ← renders <SceneManager />
│   ├── layout.tsx                 ← fonts, global CSS, viewport meta
│   └── globals.css
├── components/
│   ├── SceneManager.tsx
│   ├── ChapterTransition.tsx
│   └── chapters/
│       ├── Chapter1/
│       │   ├── index.tsx
│       │   ├── Background.tsx
│       │   ├── Characters.tsx
│       │   ├── DialogueBox.tsx
│       │   ├── NavigationHint.tsx
│       │   └── chapter1-beats.ts  ← beat data: text + poses
│       └── ChapterStub.tsx
├── public/
│   └── chapter1/
│       ├── backgrounds/           ← sky, clouds, mountains, city, foreground PNGs
│       └── characters/            ← nick_poseN_frameN.png, judy_poseN_frameN.png
└── next.config.ts
```

---

## State Model

**SceneManager level:**
```ts
currentChapter: number   // 1–9, starts at 1
transitioning: boolean   // true during chapter fade
```

**Chapter1 level (internal):**
```ts
currentBeat: number      // 0–7 (0 = idle intro, 7 = CTA)
// Note: sprite frame cycling is managed inside Characters.tsx per-character
// via individual setInterval hooks — not in shared Chapter1 state
```

---

## Chapter 1 — Scene Design

### Viewport
Full-screen (`100dvh`), no scroll. Fixed aspect ratio layout that scales to fit.

### Background Layers (bottom to top, CSS-only animations)

| # | Layer | Asset | Animation |
|---|-------|-------|-----------|
| 1 | Sky | `backgrounds/sky/frame1.png` (wide, 200% viewport) | `translateX(0 → -25%)` 60s linear loop |
| 2 | Clouds | `backgrounds/clouds/cloud_[a-d]_frame[1-2].png` | CSS drift per cloud (70–150s) + 2-frame crossfade (2–3s) — **deferred**: cloud assets not yet generated; skip this layer for MVP, add when assets exist |
| 3 | Mountains | `backgrounds/mountains/frame1.png` | `translateX(0 → 4px → 0)` 8s ease-in-out |
| 4 | City buildings | `backgrounds/city_buildings/frame[1-5].png` | `translateX(0 → -8px → 0)` 25s loop |
| 5 | Foreground bushes | `backgrounds/foreground_bushes/frame[1-3].png` | 3-frame wind cycle 0.8s ease-in-out |

Wind streaks: 5 pure-CSS `div` elements, 1px tall, `opacity: 0.07`, sweeping `translateX(-200px → 110vw)` with staggered delays.

### Character Layout
- **Nick** (fox): left side, `left: 15%`, bottom-anchored at foreground level
- **Judy** (bunny): right side, `right: 15%`, same baseline
- Both scaled to ~`15vh` height

### Sprite Animation System
Each pose has 2–4 PNG frames that cycle via `setInterval` at the interval specified in `CHAPTER1_ASSET_INVENTORY.md`. On beat change, both the outgoing and incoming pose images are stacked; the outgoing fades `opacity: 1 → 0` while the incoming fades `opacity: 0 → 1` over `0.4s`. After the transition, the outgoing image is unmounted.

### Beat Data (`chapter1-beats.ts`)

```ts
export const beats = [
  { text: null,                     nickPose: 'neutral_idle',  judyPose: 'neutral_idle'     }, // 0: intro
  { text: 'Some cities are planned.', nickPose: 'presenting',   judyPose: 'neutral_idle'     }, // 1
  { text: 'This one… wasn\'t.',       nickPose: 'shrug',        judyPose: 'smug'             }, // 2
  { text: 'It just appeared.',        nickPose: 'pointing_up',  judyPose: 'curious_pointing' }, // 3
  { text: 'Unexpected.',              nickPose: 'sunglasses',   judyPose: 'surprised'        }, // 4
  { text: 'A little chaotic.',        nickPose: 'finger_guns',  judyPose: 'amused'           }, // 5
  { text: 'Kind of fun.',             nickPose: 'thumbs_up',    judyPose: 'warm_happy'       }, // 6
  { text: null, cta: "Let's explore →", nickPose: 'thumbs_up', judyPose: 'warm_happy'       }, // 7: CTA
]
```

### DialogueBox
- Positioned bottom-center, `width: 70%`, frosted glass background (`rgba(250,250,250,0.88)` + `backdrop-filter: blur(4px)`)
- Text: Georgia serif, fades in `opacity: 0 → 1` over `0.6s` on each beat change
- Beat progress dots: one dot per beat 1–7, current beat filled dark, past beats filled sky-blue, future beats light gray
- Beat 7: text hidden, CTA button appears instead
- Tap anywhere on the scene (not just the box) advances the beat; a `NavigationHint` pulses "TAP TO CONTINUE" below the text

### Beat 0 (intro)
No dialogue text shown. Background animations play, characters do their idle loops. After `2s` auto-delay, a pulsing "Tap to begin ↓" label fades in at the bottom-center to prompt the first tap.

---

## Chapter Transition

When the user taps "Let's explore →" on beat 7:
1. `SceneManager` sets `transitioning = true`
2. `ChapterTransition` fades in a fixed full-screen black overlay (`opacity: 0 → 1`, `0.8s ease-in`)
3. `currentChapter` increments to 2
4. Overlay fades out (`opacity: 1 → 0`, `0.6s ease-out`)
5. `transitioning = false`

Total duration: ~1.5s.

---

## ChapterStub (Chapters 2–9)

A minimal full-screen placeholder:
- Pastel gradient background matching the chapter's palette from the story doc
- Chapter number + title in large soft serif text
- "← Back to Chapter 1" button that triggers the same `ChapterTransition` in reverse
- No characters, no animation

---

## Asset Loading Strategy

**Eager (on Chapter 1 mount):**
- All 5 background layer images
- Beat 0 and beat 1 character frames (~10 images total)
- Background animations start immediately — no waiting

**Prefetch (after mount, non-blocking):**
- All remaining character pose frames (beats 2–7, ~60 images)
- Triggered via `new Image()` calls in a `useEffect` after first paint
- Complete before a typical user reaches beat 2

All assets served from `/public/chapter1/` via Next.js static serving. Vercel edge CDN handles delivery.

**Asset migration:** Existing generated assets live in `chapter1/animations/backgrounds/` and `chapter1/animations/characters/` (or under `chapter1/` per `chapter1/README.md`). Copy or symlink them into `public/chapter1/` with the canonical names from `CHAPTER1_ASSET_INVENTORY.md` during project setup.

---

## Design System

### Color Palette
- Soft Sky Blue: `#A8D8EA`
- Warm Peach: `#FFD3B6`
- Light Lavender: `#E6E6FA`
- Mint Green: `#CFFFE5`
- Off White: `#FAFAFA`
- Dark Gray: `#4A4A4A`
- Near Black: `#1A1A1A`

### Typography
- Headings / UI: Inter or Poppins (clean sans-serif)
- Dialogue text: Georgia (serif, slightly literary feel)
- Line spacing: generous (`1.8`)

### Animation Principles
- Duration: `0.6s–1.2s` for entrances; no bouncing
- Easing: `ease-in-out` throughout
- Motion: subtle `opacity` + `translateY(10–20px)` — drifting, breathing, never flashy
- Background loops: CSS-only `@keyframes`, no JS timers

---

## Out of Scope (MVP)

- Audio (Hey Jude, paper-rustle SFX, ambient city sound)
- Chapters 2–9 content (stubs only)
- Cloud sprite assets (listed in `CHAPTER1_ASSET_INVENTORY.md` but not yet generated)
- Deep mobile optimisation beyond basic tap support
- Shareable chapter URLs / hash routing
- Analytics / visit tracking
- PWA / offline support

---

## Deployment

```bash
# From project root (after Next.js init)
npx vercel --prod
```

Vercel free tier. Auto-detects Next.js. HTTPS included. No config file needed.
Custom domain can be added later via Vercel dashboard.
