# Chapter 7 — Letter Scroll + Sprout Growth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Chapter 7 (coded as Chapter6 in the app) — a split-panel experience where the love letter scrolls on the left and a sprout grows on the right in sync with scroll progress.

**Architecture:** Chapter 6 component lives inside the existing SceneManager overflow:hidden container, so it intercepts wheel/touch/keyboard events to drive a virtual scroll value, exactly like ch2/ch3/ch5. GSAP continuously pans the letter on the left. Scroll progress drives cross-fading between 6 pre-loaded sprout images on the right. Letter asset reuses `/chapter2/letter_long.png` (blank lined paper — text is HTML overlay).

**Tech Stack:** React, TypeScript, GSAP (already installed), CSS custom properties, Next.js dynamic import.

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `components/chapters/Chapter6/index.tsx` | Create | Component logic — virtual scroll, letter pan, sprout stage, text beats |
| `components/chapters/Chapter6/chapter6.css` | Create | Layout, typography, sprout stack, message styles |
| `components/SceneManager.tsx` | Modify | Add Chapter6 dynamic import + render condition |

---

### Task 1: CSS Layout

**Files:**
- Create: `components/chapters/Chapter6/chapter6.css`

- [ ] **Step 1: Create the CSS file**

```css
/* ── Chapter 6 — Growing Together ────────────────────────── */

.ch6-root {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  position: relative;
  background: #fdf8f0;
  font-family: var(--font-caveat), cursive;
}

/* ── Left: letter column ────────────────────────────────── */
.ch6-letter-col {
  width: 55%;
  height: 100%;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}

.ch6-letter {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background: url('/chapter2/letter_long.png') top center / 100% 100% no-repeat;
  will-change: transform;
}

/* ── Message blocks — positioned absolutely by JS ── */
.ch6-message {
  position: absolute;
  left: 10%;
  width: 80%;
  opacity: 0;
  text-align: center;
  pointer-events: none;
}

.ch6-message p {
  font-size: clamp(22px, 3vw, 44px);
  font-weight: 600;
  line-height: 1.9;
  color: #3a2028;
  text-align: center;
  margin: 0;
}

.ch6-message p.ch6-emph {
  font-size: clamp(26px, 3.6vw, 52px);
  font-weight: 700;
}

.ch6-message p.ch6-big {
  font-size: clamp(30px, 4.2vw, 62px);
  font-weight: 700;
}

/* ── Right: sprout column ───────────────────────────────── */
.ch6-sprout-col {
  width: 45%;
  height: 100%;
  position: relative;
  flex-shrink: 0;
}

.ch6-sprout-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center bottom;
  opacity: 0;
  transition: opacity 0.6s ease;
  pointer-events: none;
}

.ch6-sprout-img.ch6-active {
  opacity: 1;
}

/* ── Scroll hint ─────────────────────────────────────────── */
.ch6-hint {
  position: absolute;
  bottom: 40px;
  left: 27.5%;
  transform: translateX(-50%);
  font-size: clamp(14px, 1.8vw, 20px);
  color: #5a3540;
  text-align: center;
  pointer-events: none;
  white-space: nowrap;
  z-index: 10;
  transition: opacity 0.4s ease;
}
.ch6-hint-arrow {
  display: block;
  margin-top: 4px;
  animation: ch6Bounce 1.5s ease-in-out infinite;
}
@keyframes ch6Bounce {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(7px); }
}

/* ── Next chapter button ─────────────────────────────────── */
.ch6-next-btn {
  position: absolute;
  bottom: 40px;
  left: 27.5%;
  transform: translateX(-50%) rotate(-0.4deg);
  font-family: var(--font-caveat), cursive;
  font-size: clamp(16px, 2.2vw, 26px);
  font-weight: 600;
  color: #5a3540;
  background: rgba(253, 250, 245, 0.9);
  border: 1.5px solid #5a3540;
  border-radius: 3px;
  padding: 9px 24px;
  cursor: pointer;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  box-shadow: 2px 2px 0 rgba(90, 53, 64, 0.15);
  transition: background 0.2s, color 0.2s, opacity 0.5s;
  z-index: 10;
}
.ch6-next-btn:hover { background: #5a3540; color: #fdfaf5; }
.ch6-next-btn.ch6-visible { opacity: 1; pointer-events: auto; }
```

- [ ] **Step 2: Verify file was created**

```bash
ls components/chapters/Chapter6/
```
Expected: `chapter6.css`

---

### Task 2: Component Skeleton + Letter Pan

**Files:**
- Create: `components/chapters/Chapter6/index.tsx`

- [ ] **Step 1: Create the component with letter pan logic**

```tsx
'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './chapter6.css'

interface Props { onComplete: () => void }

const STAGES = [1, 2, 3, 4, 5, 6].map(n => `/chapter7/sprout_stage_${n}.png`)

const MESSAGES = [
  { lines: ['After all the noise…', 'there was this quiet.'] },
  { lines: ['Staying near you', 'makes the world feel calm.'] },
  { lines: ['We were learning.', 'Not from a book.', 'Just two people, figuring it out.'] },
  { lines: ['We\'re learning how to love each other.', 'And that, somehow,', 'is its own kind of brave.'] },
  { lines: ['Something unexpected started happening.', 'I started liking myself more.', 'Not because you fixed me.', 'But because loving you', 'made me want to be worth it.'] },
  { lines: ['You make the me inside me', 'want to become a better me.', 'And that\'s the most unexpected gift.'] },
]

export default function Chapter6({ onComplete }: Props) {
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const rootRef   = useRef<HTMLDivElement>(null)
  const letterRef = useRef<HTMLDivElement>(null)
  const hintRef   = useRef<HTMLDivElement>(null)
  const nextBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const root   = rootRef.current!
    const letter = letterRef.current!
    const hint   = hintRef.current!
    const nextBtn = nextBtnRef.current!

    let letterH   = 0
    let imgRatio  = 2.2
    let vScroll   = 0
    let maxScroll = 0
    let animating = false
    let atEnd     = false

    // ── Preload sprout images ─────────────────────────────────
    STAGES.forEach(src => { const img = new Image(); img.src = src })

    // ── Sprout stage management ───────────────────────────────
    const sproutImgs = Array.from(
      root.querySelectorAll<HTMLImageElement>('.ch6-sprout-img')
    )
    let currentStage = 0

    function setStage(idx: number) {
      if (idx === currentStage) return
      currentStage = idx
      sproutImgs.forEach((img, i) => {
        img.classList.toggle('ch6-active', i === idx)
      })
    }

    // ── Layout ────────────────────────────────────────────────
    function layout() {
      const colW = root.offsetWidth * 0.55
      const vh   = root.offsetHeight
      letterH    = colW * imgRatio
      maxScroll  = Math.max(letterH - vh, 0)
      letter.style.height = `${letterH}px`

      const msgEls = Array.from(root.querySelectorAll<HTMLElement>('.ch6-message'))
      const yTop   = letterH * 0.08
      const yBot   = letterH * 0.90
      const step   = (yBot - yTop) / msgEls.length
      msgEls.forEach((el, i) => {
        const slotMid = yTop + i * step + step / 2
        el.style.top  = `${slotMid - el.offsetHeight / 2}px`
      })

      applyScroll(vScroll, false)
    }

    // ── Scroll application ────────────────────────────────────
    function applyScroll(target: number, animate: boolean) {
      target = Math.max(0, Math.min(target, maxScroll))
      vScroll = target

      if (animate) {
        gsap.to(letter, { y: -vScroll, duration: 0.35, ease: 'power2.out', overwrite: true })
      } else {
        gsap.set(letter, { y: -vScroll })
      }

      // Sprout stage
      const progress = maxScroll > 0 ? vScroll / maxScroll : 0
      const stageIdx = Math.min(Math.floor(progress * 6), 5)
      setStage(stageIdx)

      // Message visibility (simple: fade in when letter has scrolled past them)
      const msgEls = Array.from(root.querySelectorAll<HTMLElement>('.ch6-message'))
      msgEls.forEach((el, i) => {
        const elMid   = parseFloat(el.style.top) + el.offsetHeight / 2
        const visible = elMid - vScroll < root.offsetHeight * 0.75
        if (visible && parseFloat(getComputedStyle(el).opacity) < 0.5) {
          gsap.to(el, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
          gsap.fromTo(el, { y: 16 }, { y: 0, duration: 0.6, ease: 'power2.out' })
        }
      })

      // End detection
      const isEnd = vScroll >= maxScroll - 40
      if (isEnd && !atEnd) {
        atEnd = true
        gsap.to(hint, { opacity: 0, duration: 0.3 })
        setTimeout(() => {
          nextBtn.classList.add('ch6-visible')
        }, 400)
      } else if (!isEnd && atEnd) {
        atEnd = false
        nextBtn.classList.remove('ch6-visible')
        gsap.to(hint, { opacity: 1, duration: 0.3 })
      }
    }

    // ── Input handlers ────────────────────────────────────────
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      applyScroll(vScroll + e.deltaY, true)
    }

    let touchY0: number | null = null
    const onTouchStart = (e: TouchEvent) => { touchY0 = e.touches[0].clientY }
    const onTouchMove  = (e: TouchEvent) => {
      if (touchY0 === null) return
      e.preventDefault()
      const dy = touchY0 - e.touches[0].clientY
      touchY0 = e.touches[0].clientY
      applyScroll(vScroll + dy, true)
    }

    const onKeyDown = (e: KeyboardEvent) => {
      const step = root.offsetHeight * 0.18
      if (e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); applyScroll(vScroll + step, true) }
      if (e.key === 'ArrowUp')                    { e.preventDefault(); applyScroll(vScroll - step, true) }
    }

    // ── Boot: probe image ratio ───────────────────────────────
    const probe = new Image()
    probe.onload = function () {
      const img = this as HTMLImageElement
      imgRatio = img.naturalHeight / img.naturalWidth
      layout()
      window.addEventListener('resize', layout)
      // show first sprout
      setStage(0)
    }
    probe.src = '/chapter2/letter_long.png'

    root.addEventListener('wheel',      onWheel,      { passive: false })
    root.addEventListener('touchstart', onTouchStart, { passive: true  })
    root.addEventListener('touchmove',  onTouchMove,  { passive: false })
    window.addEventListener('keydown',  onKeyDown)

    nextBtn.addEventListener('click', () => onCompleteRef.current())

    return () => {
      window.removeEventListener('resize', layout)
      window.removeEventListener('keydown', onKeyDown)
      root.removeEventListener('wheel',      onWheel)
      root.removeEventListener('touchstart', onTouchStart)
      root.removeEventListener('touchmove',  onTouchMove)
      gsap.killTweensOf(letter)
    }
  }, [])

  return (
    <div className="ch6-root" ref={rootRef}>

      {/* Left: Letter */}
      <div className="ch6-letter-col">
        <div className="ch6-letter" ref={letterRef}>
          {MESSAGES.map((msg, i) => (
            <div key={i} className="ch6-message">
              {msg.lines.map((line, j) => (
                <p key={j} className={j === 0 && msg.lines.length > 1 ? '' : 'ch6-emph'}>
                  {line}
                </p>
              ))}
            </div>
          ))}
        </div>

        <div className="ch6-hint" ref={hintRef}>
          scroll to read
          <span className="ch6-hint-arrow">↓</span>
        </div>
        <button className="ch6-next-btn" ref={nextBtnRef}>
          next chapter →
        </button>
      </div>

      {/* Right: Sprout */}
      <div className="ch6-sprout-col">
        {STAGES.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            className={`ch6-sprout-img${i === 0 ? ' ch6-active' : ''}`}
          />
        ))}
      </div>

    </div>
  )
}
```

- [ ] **Step 2: Run TypeScript check**

```bash
npx tsc --noEmit
```
Expected: no errors related to `Chapter6`.

- [ ] **Step 3: Commit skeleton**

```bash
git add components/chapters/Chapter6/
git commit -m "feat(ch6): add letter-scroll + sprout-growth chapter skeleton"
```

---

### Task 3: Wire Chapter 6 into SceneManager

**Files:**
- Modify: `components/SceneManager.tsx`

- [ ] **Step 1: Add dynamic import for Chapter6**

In `SceneManager.tsx`, after the existing imports add:

```tsx
const Chapter6 = dynamic(() => import('./chapters/Chapter6'), { ssr: false })
```

- [ ] **Step 2: Add dirFor case for chapter 7**

Update the `dirFor` function:

```tsx
function dirFor(to: number): Dir {
  if (to === 2) return 'ttb'
  if (to === 3) return 'btt'
  if (to === 7) return 'ttb'
  return 'rtl'
}
```

- [ ] **Step 3: Add Chapter6 render condition**

Add before the stub catch-all block (keep it after the `ch5` block):

```tsx
{currentChapter === 6 && (
  <div data-testid="chapter-6" style={{ width: '100%', height: '100%' }}>
    <Chapter6 onComplete={() => advanceChapter(7)} />
  </div>
)}
```

Also update the stub catch-all so ch6 no longer falls into it:

```tsx
{currentChapter > 3 && currentChapter !== 5 && currentChapter !== 6 && (
```

- [ ] **Step 4: Run TypeScript check**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 5: Start dev server and navigate to chapter 6**

```bash
npm run dev
```

Open browser, navigate to `http://localhost:3000/#ch6` — you should see the split layout: pink letter on left, first sprout image on right.

- [ ] **Step 6: Verify scroll behaviour**

Scroll down (wheel or arrow keys):
- Letter pans upward, text beats fade in
- Sprout image cross-fades through stages as you approach the bottom
- "next chapter →" button appears at bottom of letter

- [ ] **Step 7: Commit**

```bash
git add components/SceneManager.tsx
git commit -m "feat(ch6): wire Chapter6 into SceneManager"
```

---

### Task 4: Polish — message fade-in fix

The `layout()` function calls `applyScroll` before `offsetHeight` of messages is settled. Fix the message fade-in to use an IntersectionObserver on the letter element instead of a pixel comparison.

**Files:**
- Modify: `components/chapters/Chapter6/index.tsx`

- [ ] **Step 1: Replace message visibility logic in applyScroll**

Remove the forEach message-visibility block from `applyScroll` and add an IntersectionObserver after `layout()`:

```tsx
// After layout() call in probe.onload, add:
const msgEls = Array.from(root.querySelectorAll<HTMLElement>('.ch6-message'))
gsap.set(msgEls, { opacity: 0, y: 16 })

const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return
    const el = e.target as HTMLElement
    gsap.to(el, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
    obs.unobserve(el)
  })
}, { root: root.querySelector('.ch6-letter-col'), threshold: 0.15, rootMargin: '0px 0px -40px 0px' })

msgEls.forEach(el => obs.observe(el))
```

Also add `obs.disconnect()` to the cleanup return function.

- [ ] **Step 2: Remove the forEach message-visibility block from applyScroll**

Delete lines in `applyScroll` that read:
```tsx
// Message visibility (simple: fade in when letter has scrolled past them)
const msgEls = Array.from(...)
msgEls.forEach(...)
```

- [ ] **Step 3: Verify in browser**

Scroll through — each text beat should fade in smoothly as it enters the viewport.

- [ ] **Step 4: Commit**

```bash
git add components/chapters/Chapter6/index.tsx
git commit -m "feat(ch6): IntersectionObserver message fade-in"
```

---

### Task 5: Mobile touch polish + "scroll to read" hint

- [ ] **Step 1: Hide hint on first scroll**

In `applyScroll`, after the end-detection block, add:

```tsx
// Hide hint on first scroll
if (vScroll > 10 && hint.style.opacity !== '0') {
  gsap.to(hint, { opacity: 0, duration: 0.4 })
}
```

- [ ] **Step 2: Verify on mobile viewport (browser DevTools)**

Set DevTools to mobile (375×812), scroll via touch simulation — hint disappears after first scroll, sprout grows, "next chapter →" appears at end.

- [ ] **Step 3: Commit**

```bash
git add components/chapters/Chapter6/index.tsx
git commit -m "feat(ch6): hide scroll hint after first interaction"
```

---

## Self-Review

### Spec Coverage

| Spec requirement | Task |
|-----------------|------|
| Split layout 55/45 | Task 1 CSS |
| Letter pan (ch2 mechanic) | Task 2 |
| Sprout cross-fade on scroll progress | Task 2 |
| 6 sprout images preloaded | Task 2 |
| 6 text beats on letter | Task 2 |
| Wire to SceneManager | Task 3 |
| Mobile touch support | Task 2 + Task 5 |
| "next chapter →" button | Task 2 + Task 3 |
| Letter asset | Reuses `/chapter2/letter_long.png` — no new asset needed |

### Placeholder scan
- ✅ No TBD/TODO in any step
- ✅ Every code step shows the actual code
- ✅ Every verify step shows expected output

### Type consistency
- `STAGES` is `string[]` — used as `src` in `<img>` — ✅
- `MESSAGES` shape `{ lines: string[] }[]` — used in JSX `.lines.map` — ✅
- `applyScroll(target: number, animate: boolean)` — called consistently — ✅
- `setStage(idx: number)` — called from `applyScroll` with `Math.min(Math.floor(...), 5)` — ✅
- `obs` from Task 4 cleanup calls `obs.disconnect()` — must be hoisted to useEffect scope — note in Task 4 step 1 to declare at useEffect level
