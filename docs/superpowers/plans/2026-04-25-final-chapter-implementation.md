# Final Chapter — "No Script" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the final chapter — a scroll-based beat sequence on a pink sketch background, ending with an automatic Ch0-style dialog that makes the in-person ask.

**Architecture:** Imperative GSAP beat-navigation (identical pattern to Ch5/Ch6), full-viewport pink sketch background image, dialog card fades in automatically 2.5s after the last beat finishes typing. Chapter7 registered in SceneManager at ch7 (already wired by Ch6's `advanceChapter(7)` call).

**Tech Stack:** React (Next.js), GSAP, CSS, nano-banana MCP (image generation)

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `public/chapter7/bg_pink_sketch.png` | Create | Background image — generated via nano-banana |
| `components/chapters/Chapter7/chapter7.css` | Create | All Chapter 7 styles |
| `components/chapters/Chapter7/index.tsx` | Create | Chapter component — beats + dialog logic |
| `components/SceneManager.tsx` | Modify | Register Chapter7, remove from stub condition |

---

### Task 1: Generate the pink sketch background

**Files:**
- Create: `public/chapter7/bg_pink_sketch.png`

- [ ] **Step 1: Generate image via nano-banana MCP**

Call `mcp__nano-banana__generate_image` with:
```json
{
  "prompt": "Soft pink crayon-sketch background illustration, the same hand-drawn crayon artwork style as a children's illustrated book — warm soft pink background color similar to #F4A7B9, no characters, no focal objects, just a warm pink paper surface with faint pencil hatching lines and light crayon grain texture scattered gently across the surface. Gentle, romantic, clean. Full landscape 16:9 composition.",
  "negative_prompt": "text, labels, numbers, characters, people, animals, plants, objects, busy patterns, dark colors",
  "aspect_ratio": "16:9",
  "mode": "generate"
}
```

- [ ] **Step 2: Save output to public/chapter7/**

Upload the returned image file to `public/chapter7/bg_pink_sketch.png` using `mcp__nano-banana__upload_file` or by saving the image content directly. Verify the file exists at that path.

- [ ] **Step 3: Commit**

```bash
git add public/chapter7/bg_pink_sketch.png
git commit -m "feat: add pink sketch background for final chapter"
```

---

### Task 2: Create chapter7.css

**Files:**
- Create: `components/chapters/Chapter7/chapter7.css`

- [ ] **Step 1: Create the CSS file**

```css
/* ── Chapter 7 — No Script ────────────────────────── */

.ch7-root {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  font-family: var(--font-caveat), cursive;
}

.ch7-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  pointer-events: none;
}

.ch7-content {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Scroll hint ─────────────────────────────────────── */
.ch7-hint {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  font-size: clamp(14px, 1.8vw, 20px);
  color: #5a3540;
  text-align: center;
  pointer-events: none;
  white-space: nowrap;
  z-index: 10;
  opacity: 0;
}

.ch7-hint-arrow {
  display: block;
  margin-top: 4px;
  animation: ch7Bounce 1.5s ease-in-out infinite;
}

@keyframes ch7Bounce {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(7px); }
}

/* ── Beat blocks — stacked, one visible at a time ──── */
.ch7-beat {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 15%;
  opacity: 0;
  pointer-events: none;
}

.ch7-beat p {
  font-size: clamp(24px, 3.5vw, 52px);
  font-weight: 600;
  line-height: 1.9;
  color: #3a2028;
  text-align: center;
  margin: 0;
}

/* ── Typing cursor ───────────────────────────────────── */
.ch7-beat p.ch7-typing::after {
  content: '|';
  margin-left: 1px;
  animation: ch7CursorBlink 0.6s step-end infinite;
}

@keyframes ch7CursorBlink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}

/* ── Dialog card — Ch0 modal style ──────────────────── */
/* NOTE: no transform here — GSAP owns the transform entirely
   (xPercent/yPercent for centering + rotation + scale on entry) */
.ch7-dialog {
  display: none;
  position: absolute;
  top: 50%;
  left: 50%;
  background: rgba(253, 250, 245, 0.97);
  border: 1.5px solid #5a3540;
  border-radius: 3px;
  box-shadow: 3px 3px 0 rgba(90, 53, 64, 0.2);
  padding: 32px 40px;
  max-width: min(520px, 85vw);
  z-index: 20;
  font-family: var(--font-caveat), cursive;
  text-align: center;
}

.ch7-dialog-line {
  font-size: clamp(18px, 2.4vw, 30px);
  font-weight: 600;
  color: #3a2028;
  line-height: 1.7;
  margin: 0 0 8px;
}

.ch7-dialog-line.ch7-muted {
  font-size: clamp(14px, 1.8vw, 22px);
  font-weight: 400;
  color: #5a3540;
  margin-top: 16px;
  margin-bottom: 0;
}
```

- [ ] **Step 2: Commit**

```bash
git add components/chapters/Chapter7/chapter7.css
git commit -m "feat: add Chapter 7 CSS"
```

---

### Task 3: Create Chapter7/index.tsx

**Files:**
- Create: `components/chapters/Chapter7/index.tsx`

- [ ] **Step 1: Create the component**

```tsx
'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './chapter7.css'

interface Props { onComplete: () => void }

const MESSAGES = [
  { lines: ["I don't think this story needs a label."] },
  { lines: ["Or a timeline."] },
  { lines: ["Or a script."] },
  { lines: ["Maybe it just needs…"] },
  { lines: ["a bit of space."] },
  { lines: ["And the same curiosity that started it."] },
]

export default function Chapter7({ onComplete }: Props) {
  const rootRef   = useRef<HTMLDivElement>(null)
  const hintRef   = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root   = rootRef.current!
    const hint   = hintRef.current!
    const dialog = dialogRef.current!

    const beatEls = Array.from(root.querySelectorAll<HTMLElement>('.ch7-beat'))

    beatEls.forEach(el => {
      el.querySelectorAll<HTMLElement>('p').forEach(p => {
        p.dataset.full = p.textContent ?? ''
        p.textContent = ''
      })
    })

    const typingTimers: (ReturnType<typeof setTimeout> | undefined)[] =
      new Array(MESSAGES.length).fill(undefined)
    let dialogTimer: ReturnType<typeof setTimeout> | undefined
    let dialogShown = false
    let current     = -1
    let animating   = false

    function cancelTyping(i: number) {
      clearTimeout(typingTimers[i])
      typingTimers[i] = undefined
      beatEls[i]?.querySelectorAll<HTMLElement>('p.ch7-typing')
        .forEach(p => p.classList.remove('ch7-typing'))
    }

    function showDialog() {
      if (dialogShown) return
      dialogShown = true
      dialog.style.display = 'block'
      // xPercent/yPercent centre the card; rotation adds the slight tilt;
      // GSAP owns the full transform so there is no CSS conflict
      gsap.fromTo(
        dialog,
        { opacity: 0, scale: 0.85, xPercent: -50, yPercent: -50, rotation: -0.5 },
        { opacity: 1, scale: 1,    xPercent: -50, yPercent: -50, rotation: -0.5, duration: 0.2, ease: 'power2.out' }
      )
    }

    function typeBeat(i: number, onDone?: () => void) {
      cancelTyping(i)
      const el = beatEls[i]
      if (!el) return
      const paragraphs = Array.from(el.querySelectorAll<HTMLElement>('p'))
      paragraphs.forEach(p => { p.textContent = '' })

      let lineIdx = 0
      let charIdx = 0

      function tick() {
        if (lineIdx >= paragraphs.length) {
          paragraphs.forEach(p => p.classList.remove('ch7-typing'))
          onDone?.()
          return
        }
        const p    = paragraphs[lineIdx]
        const full = p.dataset.full ?? ''
        if (charIdx === 0) {
          if (lineIdx > 0) paragraphs[lineIdx - 1].classList.remove('ch7-typing')
          p.classList.add('ch7-typing')
        }
        if (charIdx < full.length) {
          p.textContent = full.slice(0, charIdx + 1)
          charIdx++
          typingTimers[i] = setTimeout(tick, 28)
        } else {
          lineIdx++
          charIdx = 0
          typingTimers[i] = setTimeout(tick, 180)
        }
      }
      tick()
    }

    function showBeat(i: number) {
      const el = beatEls[i]
      if (!el) return
      gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' })
      const isLast = i === beatEls.length - 1
      typeBeat(i, isLast ? () => {
        dialogTimer = setTimeout(showDialog, 2500)
      } : undefined)
    }

    function hideBeat(i: number, cb: () => void) {
      cancelTyping(i)
      const el = beatEls[i]
      if (!el) { cb(); return }
      gsap.to(el, {
        opacity: 0, y: -10, duration: 0.3, ease: 'power2.in',
        onComplete: () => { gsap.set(el, { y: 0 }); cb() },
      })
    }

    function goTo(next: number) {
      if (animating) return
      if (next === current) return
      if (next < -1 || next >= beatEls.length) return

      animating    = true
      const prev   = current
      current      = next

      function doShow() {
        if (next === -1) {
          gsap.to(hint, { opacity: 1, duration: 0.4 })
          animating = false
          return
        }
        showBeat(next)
        setTimeout(() => { animating = false }, 750)
      }

      if (prev === -1) {
        gsap.to(hint, { opacity: 0, duration: 0.3, onComplete: doShow })
      } else {
        hideBeat(prev, doShow)
      }
    }

    const hintTimer = setTimeout(() => gsap.to(hint, { opacity: 1, duration: 0.5 }), 700)

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (animating) return
      goTo(current + (e.deltaY > 0 ? 1 : -1))
    }

    let touchY0: number | null = null
    const onTouchStart = (e: TouchEvent) => { touchY0 = e.touches[0].clientY }
    const onTouchEnd   = (e: TouchEvent) => {
      if (touchY0 === null) return
      const dy = touchY0 - e.changedTouches[0].clientY
      touchY0 = null
      if (Math.abs(dy) < 40 || animating) return
      goTo(current + (dy > 0 ? 1 : -1))
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (animating) return
      if (e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); goTo(current + 1) }
      else if (e.key === 'ArrowUp')               { e.preventDefault(); goTo(current - 1) }
    }

    window.addEventListener('wheel',      onWheel,      { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true  })
    window.addEventListener('touchend',   onTouchEnd,   { passive: true  })
    window.addEventListener('keydown',    onKeyDown)

    return () => {
      clearTimeout(hintTimer)
      clearTimeout(dialogTimer)
      window.removeEventListener('wheel',      onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend',   onTouchEnd)
      window.removeEventListener('keydown',    onKeyDown)
      typingTimers.forEach((_, i) => cancelTyping(i))
      gsap.killTweensOf(hint)
      gsap.killTweensOf(dialog)
      beatEls.forEach(el => gsap.killTweensOf(el))
    }
  }, [])

  return (
    <div className="ch7-root" ref={rootRef}>
      <img src="/chapter7/bg_pink_sketch.png" alt="" className="ch7-bg" />

      <div className="ch7-content">
        <div className="ch7-hint" ref={hintRef}>
          scroll to read
          <span className="ch7-hint-arrow">↓</span>
        </div>

        {MESSAGES.map((msg, i) => (
          <div key={i} className="ch7-beat">
            {msg.lines.map((line, j) => (
              <p key={j}>{line}</p>
            ))}
          </div>
        ))}
      </div>

      <div className="ch7-dialog" ref={dialogRef}>
        <p className="ch7-dialog-line">There are a lot more things to explore in the city?</p>
        <p className="ch7-dialog-line">Would you like to explore it together with me, as a girl friend?</p>
        <p className="ch7-dialog-line ch7-muted">— Please tell me your answer in person</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/chapters/Chapter7/index.tsx
git commit -m "feat: add Chapter 7 component"
```

---

### Task 4: Register Chapter7 in SceneManager

**Files:**
- Modify: `components/SceneManager.tsx`

- [ ] **Step 1: Add Chapter7 dynamic import**

After line 14 (`const Chapter6 = dynamic(…)`), add:

```tsx
const Chapter7 = dynamic(() => import('./chapters/Chapter7'), { ssr: false })
```

- [ ] **Step 2: Add Chapter7 render block**

After the `currentChapter === 6` block (ending at line ~103), add:

```tsx
      {currentChapter === 7 && (
        <div data-testid="chapter-7" style={{ width: '100%', height: '100%' }}>
          <Chapter7 onComplete={() => {}} />
        </div>
      )}
```

- [ ] **Step 3: Exclude ch7 from the stub condition**

Change:
```tsx
      {currentChapter > 3 && currentChapter !== 5 && currentChapter !== 6 && (
```

To:
```tsx
      {currentChapter > 3 && currentChapter !== 5 && currentChapter !== 6 && currentChapter !== 7 && (
```

- [ ] **Step 4: Commit**

```bash
git add components/SceneManager.tsx
git commit -m "feat: register Chapter 7 in SceneManager"
```

---

### Task 5: Verify in browser

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Navigate directly to Chapter 7**

Open `http://localhost:3000/#ch7` in the browser.

- [ ] **Step 3: Verify beats**

- Pink sketch background fills the viewport
- "scroll to read ↓" hint fades in after ~700ms
- Scroll down → hint fades out, beat 1 types in: *"I don't think this story needs a label."*
- Continue scrolling through all 6 beats, each types in correctly
- Scroll up goes back to previous beat
- Typing cursor `|` blinks while text is typing

- [ ] **Step 4: Verify dialog**

- After beat 6 finishes typing, wait ~2.5s
- Dialog card scales in from center with slight tilt
- Card shows all 3 lines, third line is smaller/muted
- No buttons, no close mechanism — dialog stays permanently

- [ ] **Step 5: Verify full flow from Ch6**

Navigate to `http://localhost:3000/#ch6`, scroll through all beats, click "next chapter →" — cloud wipe transition plays, Chapter 7 appears correctly.
