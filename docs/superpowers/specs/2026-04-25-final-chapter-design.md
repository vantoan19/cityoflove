# Final Chapter — "No Script" Design Spec

**Date:** 2026-04-25
**Status:** Approved

---

## Overview

The final chapter is the emotional landing point of the story. After the growth and self-reflection of Ch6 (sprout/letter), this chapter returns to simplicity — soft pink sketch background, six quiet beats scrolling one at a time, ending with an automatic dialog that makes the real-world ask. No buttons, no next chapter. The story ends here.

---

## Flow

```
hint → beat 1 → beat 2 → beat 3 → beat 4 → beat 5 → beat 6
  → [2.5s pause after last beat finishes typing]
  → dialog fades in (stays on screen indefinitely)
```

---

## Scroll Beats

Same wheel / touch / keyboard navigation as Ch5 and Ch6. One beat visible at a time. Typing effect per beat (same 28ms/char cadence as Ch6). Hint "scroll to read ↓" fades in after 700ms on first load.

| # | Text |
|---|------|
| 1 | *"I don't think this story needs a label."* |
| 2 | *"Or a timeline."* |
| 3 | *"Or a script."* |
| 4 | *"Maybe it just needs…"* |
| 5 | *"a bit of space."* |
| 6 | *"And the same curiosity that started it."* |

Beats can navigate forward and backward (scroll up goes back). After beat 6, backward navigation is still allowed. Forward scroll on beat 6 is blocked (no beat 7 to go to — the dialog appears on its own after the typing timer).

---

## Dialog

Appears automatically 2.5s after beat 6 finishes typing. Uses the exact Ch0 modal visual language.

### Appearance
- Absolutely centered overlay (not full-screen backdrop)
- Card: `background: rgba(253,250,245,0.97)`, `border: 1.5px solid #5a3540`, `border-radius: 3px`, `box-shadow: 3px 3px 0 rgba(90,53,64,0.2)`, `transform: rotate(-0.5deg)`
- Enter animation: `scale(0.85) → scale(1)`, 200ms ease-out (same as Ch0 `ch0-modal-in` keyframe)
- Font: `'Caveat', cursive` throughout
- Text color: `#3a2028`

### Content
```
"There are a lot more things to explore in the city?"

"Would you like to explore it together with me, as a girl friend?"

"— Please tell me your answer in person"
```

- Three lines, each on its own `<p>` — first two are the question, third is the instruction, styled slightly smaller/muted (`#5a3540`)
- No buttons, no input field, no close mechanism
- The dialog stays on screen permanently — this is the story's final state

### No `onComplete`
This is the last chapter. `onComplete` is passed in the standard interface but never called. SceneManager shows no "next chapter" option from here.

---

## Background

### Asset
`public/chapter7/bg_pink_sketch.png`

### Style
Same crayon-sketch illustration style as the Ch6 sprout stage images:
- Soft, hand-drawn crayon texture
- Clean and minimal — no subject/focal object
- Background color: soft pink (`#F4A7B9` range) instead of white
- Faint sketch/pencil texture marks across the surface for warmth
- Full-bleed, covers entire viewport (`object-fit: cover`)

### Generation
Generated via nano-banana MCP with the following intent:
> Soft pink crayon-sketch background, the same illustration style as hand-drawn crayon artwork on a warm pink paper (#F4A7B9). Minimal — no characters, no objects, just a warm pink paper texture with faint pencil hatching and crayon grain. Clean, gentle, romantic.

---

## Component Structure

```
components/chapters/Chapter7/
  index.tsx       — main component (beats + dialog logic)
  chapter7.css    — styles
```

### Interface
```tsx
interface Props {
  onComplete: () => void   // accepted but never called
}
export default function Chapter7({ onComplete }: Props): JSX.Element
```

### Key Refs
- `rootRef` — the chapter root div
- `hintRef` — scroll hint element
- Beat elements via `querySelectorAll('.ch7-beat')`
- `dialogRef` — the dialog card div (initially `display: none`, fades in)

### State machine (imperative, matching Ch5/Ch6 pattern)
- `current: number` — current beat index (-1 = hint visible)
- `animating: boolean` — debounce flag
- `dialogShown: boolean` — prevents dialog from showing twice
- After beat 6 types out: `setTimeout(showDialog, 2500)`

---

## CSS Notes

| Class | Purpose |
|---|---|
| `ch7-root` | Full viewport, `position: relative; overflow: hidden` |
| `ch7-bg` | Background image, `position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0` |
| `ch7-content` | `position: relative; z-index: 1; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center` |
| `ch7-hint` | Centered hint, Caveat font, `opacity: 0` initially |
| `ch7-beat` | Centered beat, `opacity: 0; position: absolute` |
| `ch7-dialog` | The modal card — centered, `display: none` initially, `opacity: 0` |
| `ch7-dialog-line` | Each line of dialog text |
| `ch7-dialog-line.ch7-muted` | Third line (instruction), smaller, `color: #5a3540` |

### Keyframe reuse
Reuse `ch0-modal-in` keyframe from Chapter0's CSS (or redeclare locally as `ch7-modal-in` — identical values).

---

## Palette & Typography

| Token | Value |
|---|---|
| Card background | `rgba(253,250,245,0.97)` |
| Card border | `#5a3540` |
| Text primary | `#3a2028` |
| Text muted | `#5a3540` |
| Font | `'Caveat', cursive` |
| Beat font size | `1.6rem` |
| Dialog font size | `1.4rem` |

---

## Spec Self-Review

- ✅ No TBD sections
- ✅ Dialog content is exact (no ambiguity)
- ✅ Reuses Ch5/Ch6 beat navigation pattern — no reinvention
- ✅ Dialog reuses Ch0 modal visual language exactly
- ✅ Background generation intent is fully specified
- ✅ `onComplete` never called — final chapter stays permanently
- ✅ Scoped to one new component, no other files touched except SceneManager registration
