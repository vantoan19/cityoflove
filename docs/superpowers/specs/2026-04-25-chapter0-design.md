# Chapter 0 — Love Letter Gate Design Spec

**Date:** 2026-04-25  
**Status:** Approved

---

## Overview

Chapter 0 is the entry point of the story. It shows a crayon-sketch love letter with a pulsing idle animation. Clicking the letter triggers a password gate. The correct answer ("19/03/2026") unlocks an opening animation followed by a zoom-into-white transition that hands off to Chapter 1.

---

## State Machine

```
idle → passwordPrompt → opening → zooming → (onComplete)
```

| State | Description |
|---|---|
| `idle` | 3-frame sprite loops at 800ms/frame |
| `passwordPrompt` | idle pauses; password modal shown |
| `opening` | 7-frame sprite plays once (~0.93s) |
| `zooming` | CSS zoom + white overlay (900ms); calls `onComplete()` at ~850ms |

---

## Phase Details

### Idle

- Background: full-viewport solid `#F4A7B9`
- Images: `loveletter/idle/frame1.png`, `frame2.png`, `frame3.png` (public-served)
- Timing: 800ms per frame, infinite loop
- Layout: `<img>` centered, `object-fit: contain`, fills viewport
- Hint: "tap to open ♡" — Caveat font, `color: #5a3540`, fades in after 1s delay, fixed at bottom-center
- Cursor: `pointer` on hover over the letter

### Password Prompt

Triggered by clicking anywhere on the letter image.

**Modal appearance:**
- Absolutely centered overlay (not full-screen backdrop)
- White/cream card: `background: rgba(253,250,245,0.97)`, `border: 1.5px solid #5a3540`, `border-radius: 3px`, `box-shadow: 3px 3px 0 rgba(90,53,64,0.2)`, `transform: rotate(-0.5deg)`
- Enter animation: `scale(0.85) → scale(1)`, 200ms ease-out
- Caveat font throughout

**Content:**
```
"There is only 1 special person can open this love letter."
"The password is the first day we met and talk to each other"

[text input — placeholder: DD/MM/YYYY]
[open ♡ button]
```

**Input behaviour:**
- Text input, `type="text"`, `inputMode="text"`, `placeholder="DD/MM/YYYY"`
- Enter key submits
- Correct password: `"19/03/2026"` (exact string match)
- Wrong password: input shakes (keyframe), border turns `#c0392b` for 600ms, error text "That's not right… try again ♡" appears below

**On correct password:**
- Modal scales out + fades (200ms)
- `phase` → `opening`

### Opening Animation

- Images: `loveletter/opening/frame{1-7}.png`
- Timings:
  - Frames 1–4: 120ms each
  - Frames 5–7: 150ms each
  - Total: ~930ms
- No user interaction during playback
- No visible hint or controls

### Zoom Transition

Triggered immediately after frame 7 finishes displaying.

- The love letter `<img>` CSS: `transform-origin: 50% 36%`, animate `transform: scale(1) → scale(6)`, `transition: transform 900ms ease-in-out`
- White overlay div: `opacity: 0 → 1`, starts after 400ms delay, duration 500ms (peaks at ~900ms)
- At **850ms**: `onComplete()` is called
- Chapter 0 unmounts; SceneManager shows white-fade-out overlay while Chapter 1 mounts

---

## SceneManager Changes

### Default Chapter

Change initial chapter from `1` to `0`. Hash `#ch0` or no hash → Chapter 0. Hash `#ch1` → Chapter 1 (unchanged).

### Chapter 0 Registration

```tsx
const Chapter0 = dynamic(() => import('./chapters/Chapter0'), { ssr: false })
```

Rendered when `currentChapter === 0`.

### No Cloud Wipe for ch0 → ch1

Chapter 0's `onComplete` does NOT trigger `advanceChapter()`. Instead it calls a direct switch:

```tsx
<Chapter0 onComplete={() => {
  setCurrentChapter(1)
  setCh0FadeOut(true)
}} />
```

`ch0FadeOut` state: when true, a full-viewport white `<div>` with `opacity: 1 → 0` over 500ms is shown in SceneManager above the now-mounted Chapter 1. After the fade completes, `ch0FadeOut` is reset to false.

This means:
- Chapter 0's own zoom brings everything to white
- Chapter 0 unmounts; Chapter 1 mounts (invisible under the white div)
- White div fades out → Chapter 1 is revealed naturally

### Existing Chapter Routing

All existing chapters (1–6) and their cloud-wipe transitions are unchanged.

---

## Asset Setup

The loveletter frame images live at `C:\Projects\city\loveletter\` but Next.js only serves files under `/public/`. The implementation must copy (or verify) these files exist at:

```
public/loveletter/idle/frame1.png
public/loveletter/idle/frame2.png
public/loveletter/idle/frame3.png
public/loveletter/opening/frame1.png
…
public/loveletter/opening/frame7.png
```

Strategy: copy `loveletter/idle/` and `loveletter/opening/` into `public/loveletter/` as part of the implementation step.

---

## File Structure

```
components/chapters/Chapter0/
  index.tsx        — main component (state machine + render)
  chapter0.css     — styles (background, modal, hint, animation keyframes)

public/loveletter/
  idle/
    frame1.png
    frame2.png
    frame3.png
  opening/
    frame1.png  … frame7.png
```

---

## Component Interface

```tsx
interface Props {
  onComplete: () => void
}

export default function Chapter0({ onComplete }: Props): JSX.Element
```

---

## CSS Keyframes Needed

```css
@keyframes ch0-shake {
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-6px); }
  40%       { transform: translateX(6px); }
  60%       { transform: translateX(-4px); }
  80%       { transform: translateX(4px); }
}

@keyframes ch0-modal-in {
  from { transform: rotate(-0.5deg) scale(0.85); opacity: 0; }
  to   { transform: rotate(-0.5deg) scale(1);    opacity: 1; }
}

@keyframes ch0-modal-out {
  from { transform: rotate(-0.5deg) scale(1);    opacity: 1; }
  to   { transform: rotate(-0.5deg) scale(0.85); opacity: 0; }
}

@keyframes ch0-hint-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
/* Usage: animation: ch0-hint-in 0.5s ease forwards; animation-delay: 1s */
```

---

## Palette & Typography

| Token | Value |
|---|---|
| Background | `#F4A7B9` |
| Card background | `rgba(253,250,245,0.97)` |
| Card border | `#5a3540` |
| Text (primary) | `#3a2028` |
| Text (muted) | `#5a3540` |
| Button hover bg | `#5a3540` |
| Button hover text | `#fdfaf5` |
| Error border | `#c0392b` |
| Error text | `#c0392b` |
| Font | `'Caveat', cursive` |

---

## Out of Scope

- Audio on Chapter 0 (no background music)
- Accessibility / keyboard navigation beyond Enter-to-submit
- Chapter 0 hash in URL bar (the hash stays empty; `#ch0` is only an entry route, not written)
- Any changes to Chapter 1's internal behaviour
