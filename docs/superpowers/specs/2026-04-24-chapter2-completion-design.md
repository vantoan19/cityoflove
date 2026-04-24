# Chapter 2 Completion — Design Spec

**Date:** 2026-04-24
**Scope:** Complete `chapter2/index.html` by appending the missing script content (first real lunch + "you become what you do" arc)

---

## Context

`chapter2/index.html` currently ends at message `m14` ("I texted you" / "You replied."). The full script in `zootopia_portfolio_story.md` has 7 additional messages that close the chapter. This spec covers adding those messages and the two supporting CSS classes.

The chapter stays as a standalone HTML file. No changes to the Next.js app, the music player, or any existing scroll-reveal logic.

---

## New Content Blocks

All blocks use the existing `.message` div + IntersectionObserver scroll-reveal pattern. Appended after `#m14` inside `<div class="letter" id="letter">`.

| ID  | Content | Class notes |
|-----|---------|-------------|
| m15 | "And then— / we had our first real lunch." | standard `.message` |
| m16 | "That's when I saw more of you." | standard `.message` |
| m17 | "Not just fun. / Not just cute." | `.emph` on lines |
| m18 | "But… / someone who becomes what she does." | `.emph` on second line |
| m19 | "Morning: / a mom, raising kids in her mind." | `.message` + `.morning` on `<p>` tags |
| m20 | "Afternoon: / someone else entirely. / Just to understand. / Just to make things real." | `.message` + `.afternoon` on `<p>` tags |
| m21 | "That's when I knew— / you don't just do things. / You become them." | `.big` class, default dark color |

---

## CSS Additions

Two new classes added to the `<style>` block, scoped to `.message p`:

```css
.message p.morning   { color: #C87941; }  /* warm peach — morning persona */
.message p.afternoon { color: #7B6BA8; }  /* soft lavender — afternoon persona */
```

No other CSS changes. Font, spacing, animation timings, scroll-reveal thresholds — all unchanged.

---

## What is NOT changing

- Music player: stays as the existing text-sketch player
- `letter_long.png` background, pink body, Caveat font — unchanged
- IntersectionObserver scroll logic — no modifications
- Any other chapter files

---

## Success criteria

1. Scrolling past `m14` reveals the 7 new messages in sequence
2. Morning lines appear in warm peach `#C87941`
3. Afternoon lines appear in soft lavender `#7B6BA8`
4. Final line ("you become them") renders with `.big` size and dark text
5. No visual regression on existing messages m1–m14
