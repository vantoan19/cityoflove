# Chapter 0 — Love Letter Gate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Chapter 0 — a password-gated love letter that plays an idle sprite animation, shows a handwritten-style password modal on click, then plays an opening animation and zooms into white before handing off to Chapter 1.

**Architecture:** Chapter0 is a self-contained React component with a four-state machine (`idle → passwordPrompt → opening → zooming`). It manages its own frame timers via `useEffect` and CSS transitions for the zoom. SceneManager gets a new direct-switch path for ch0→ch1 (no cloud wipe) with a white-overlay fade-out that bridges the unmount gap.

**Tech Stack:** React 18, Next.js (App Router), TypeScript, CSS Modules-style plain CSS, no external animation libraries (pure CSS transitions + `setInterval`/`setTimeout`).

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `public/loveletter/idle/frame{1,2,3}.png` | Copy from `loveletter/idle/` | Static assets served by Next.js |
| `public/loveletter/opening/frame{1–7}.png` | Copy from `loveletter/opening/` | Static assets served by Next.js |
| `components/chapters/Chapter0/chapter0.css` | Create | All Chapter 0 styles + keyframes |
| `components/chapters/Chapter0/index.tsx` | Create | Chapter 0 component (state machine, frame sequencer, modal) |
| `components/SceneManager.tsx` | Modify | Register Chapter 0, default chapter 0, ch0FadeOut overlay |

---

## Task 1: Copy loveletter assets to `public/`

Next.js only serves static files from `/public/`. The source images live in `/loveletter/` (project root).

**Files:**
- Create: `public/loveletter/idle/frame{1,2,3}.png`
- Create: `public/loveletter/opening/frame{1-7}.png`

- [ ] **Step 1: Copy the frames**

Run from the project root (`C:/Projects/city`):

```bash
mkdir -p public/loveletter/idle public/loveletter/opening
cp loveletter/idle/frame1.png public/loveletter/idle/frame1.png
cp loveletter/idle/frame2.png public/loveletter/idle/frame2.png
cp loveletter/idle/frame3.png public/loveletter/idle/frame3.png
cp loveletter/opening/frame1.png public/loveletter/opening/frame1.png
cp loveletter/opening/frame2.png public/loveletter/opening/frame2.png
cp loveletter/opening/frame3.png public/loveletter/opening/frame3.png
cp loveletter/opening/frame4.png public/loveletter/opening/frame4.png
cp loveletter/opening/frame5.png public/loveletter/opening/frame5.png
cp loveletter/opening/frame6.png public/loveletter/opening/frame6.png
cp loveletter/opening/frame7.png public/loveletter/opening/frame7.png
```

- [ ] **Step 2: Verify**

```bash
ls public/loveletter/idle/
ls public/loveletter/opening/
```

Expected: 3 files in `idle/`, 7 files in `opening/`.

- [ ] **Step 3: Commit**

```bash
git add public/loveletter/
git commit -m "feat(ch0): copy loveletter frames to public/"
```

---

## Task 2: Create `chapter0.css`

**Files:**
- Create: `components/chapters/Chapter0/chapter0.css`

- [ ] **Step 1: Create the CSS file**

Create `components/chapters/Chapter0/chapter0.css` with this exact content:

```css
/* ── Chapter 0 — Love Letter Gate ───────────────────────── */

.ch0-root {
  position: relative;
  width: 100%;
  height: 100%;
  background: #F4A7B9;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Letter image — natural size, centered, zooms on pivot */
.ch0-letter-img {
  max-width: 100%;
  max-height: 100%;
  display: block;
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
  transform: scale(1);
  transform-origin: 50% 36%;
  transition: transform 900ms ease-in-out;
}

.ch0-letter-img.ch0-zooming {
  transform: scale(6);
}

/* ── Hint ───────────────────────────────────────────────── */
.ch0-hint {
  position: fixed;
  bottom: 48px;
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-caveat), cursive;
  font-size: clamp(18px, 2.2vw, 26px);
  font-weight: 600;
  color: #5a3540;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  animation: ch0-hint-in 0.5s ease forwards;
  animation-delay: 1s;
}

/* ── White fade-in overlay (zoom phase) ─────────────────── */
.ch0-white-overlay {
  position: fixed;
  inset: 0;
  background: #fff;
  pointer-events: none;
  opacity: 0;
  /* transition applied only when .ch0-fade-in is present */
}

.ch0-white-overlay.ch0-fade-in {
  opacity: 1;
  transition: opacity 500ms ease-in-out;
  transition-delay: 400ms;
}

/* ── Password modal ─────────────────────────────────────── */
.ch0-modal-backdrop {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.ch0-modal {
  background: rgba(253, 250, 245, 0.97);
  border: 1.5px solid #5a3540;
  border-radius: 3px;
  box-shadow: 3px 3px 0 rgba(90, 53, 64, 0.2);
  padding: 32px 36px;
  max-width: 440px;
  width: 90%;
  font-family: var(--font-caveat), cursive;
  color: #3a2028;
  text-align: center;
  animation: ch0-modal-in 200ms ease-out forwards;
}

.ch0-modal.ch0-closing {
  animation: ch0-modal-out 200ms ease-in forwards;
}

.ch0-modal p {
  font-size: clamp(18px, 2.4vw, 24px);
  line-height: 1.6;
  margin-bottom: 8px;
}

/* ── Input ──────────────────────────────────────────────── */
.ch0-input {
  width: 100%;
  font-family: var(--font-caveat), cursive;
  font-size: clamp(20px, 2.6vw, 26px);
  font-weight: 600;
  color: #3a2028;
  background: rgba(253, 250, 245, 0.9);
  border: 1.5px solid #5a3540;
  border-radius: 3px;
  padding: 8px 14px;
  text-align: center;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
  margin-top: 8px;
}

.ch0-input.ch0-input-error {
  border-color: #c0392b;
  animation: ch0-shake 0.4s ease;
}

.ch0-error-text {
  color: #c0392b;
  font-family: var(--font-caveat), cursive;
  font-size: clamp(14px, 1.8vw, 18px);
  margin-top: 6px;
  min-height: 24px;
}

/* ── Submit button ──────────────────────────────────────── */
.ch0-btn {
  display: inline-block;
  margin-top: 14px;
  font-family: var(--font-caveat), cursive;
  font-size: clamp(18px, 2.4vw, 26px);
  font-weight: 600;
  color: #5a3540;
  background: rgba(253, 250, 245, 0.85);
  border: 1.5px solid #5a3540;
  border-radius: 3px;
  padding: 8px 28px;
  cursor: pointer;
  box-shadow: 2px 2px 0 rgba(90, 53, 64, 0.18);
  transition: background 0.2s, color 0.2s;
}

.ch0-btn:hover  { background: #5a3540; color: #fdfaf5; }
.ch0-btn:active { transform: scale(0.96); }

/* ── Keyframes ──────────────────────────────────────────── */

@keyframes ch0-hint-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes ch0-modal-in {
  from { transform: rotate(-0.5deg) scale(0.85); opacity: 0; }
  to   { transform: rotate(-0.5deg) scale(1);    opacity: 1; }
}

@keyframes ch0-modal-out {
  from { transform: rotate(-0.5deg) scale(1);    opacity: 1; }
  to   { transform: rotate(-0.5deg) scale(0.85); opacity: 0; }
}

@keyframes ch0-shake {
  0%,  100% { transform: translateX(0);   }
  20%        { transform: translateX(-6px); }
  40%        { transform: translateX(6px);  }
  60%        { transform: translateX(-4px); }
  80%        { transform: translateX(4px);  }
}
```

- [ ] **Step 2: Commit**

```bash
git add components/chapters/Chapter0/chapter0.css
git commit -m "feat(ch0): add chapter0 styles and keyframes"
```

---

## Task 3: Create `Chapter0/index.tsx`

**Files:**
- Create: `components/chapters/Chapter0/index.tsx`

- [ ] **Step 1: Create the component**

Create `components/chapters/Chapter0/index.tsx` with this exact content:

```tsx
'use client'
import { useState, useEffect, useRef } from 'react'
import type { ChangeEvent, KeyboardEvent } from 'react'
import './chapter0.css'

interface Props {
  onComplete: () => void
}

type Phase = 'idle' | 'passwordPrompt' | 'opening' | 'zooming'

const IDLE_FRAMES = [
  '/loveletter/idle/frame1.png',
  '/loveletter/idle/frame2.png',
  '/loveletter/idle/frame3.png',
]

const OPENING_FRAMES = [
  '/loveletter/opening/frame1.png',
  '/loveletter/opening/frame2.png',
  '/loveletter/opening/frame3.png',
  '/loveletter/opening/frame4.png',
  '/loveletter/opening/frame5.png',
  '/loveletter/opening/frame6.png',
  '/loveletter/opening/frame7.png',
]

// Display duration (ms) for each opening frame
const OPENING_DURATIONS = [120, 120, 120, 120, 150, 150, 150]

const CORRECT_PASSWORD = '19/03/2026'

export default function Chapter0({ onComplete }: Props) {
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const [phase, setPhase] = useState<Phase>('idle')
  const [idleFrame, setIdleFrame] = useState(0)
  const [openingFrame, setOpeningFrame] = useState(0)
  const [password, setPassword] = useState('')
  const [inputError, setInputError] = useState(false)
  const [modalClosing, setModalClosing] = useState(false)
  const [whiteVisible, setWhiteVisible] = useState(false)
  const [zooming, setZooming] = useState(false)

  // Prefetch all frames so animations play immediately
  useEffect(() => {
    ;[...IDLE_FRAMES, ...OPENING_FRAMES].forEach(src => {
      const img = new Image()
      img.src = src
    })
  }, [])

  // Idle frame loop — 800ms per frame
  useEffect(() => {
    if (phase !== 'idle') return
    const id = setInterval(() => {
      setIdleFrame(f => (f + 1) % IDLE_FRAMES.length)
    }, 800)
    return () => clearInterval(id)
  }, [phase])

  // Opening animation sequencer
  useEffect(() => {
    if (phase !== 'opening') return
    let frameIdx = 0
    let cancelled = false

    function playFrame() {
      if (cancelled) return
      setOpeningFrame(frameIdx)
      const duration = OPENING_DURATIONS[frameIdx]
      if (frameIdx < OPENING_FRAMES.length - 1) {
        frameIdx++
        setTimeout(playFrame, duration)
      } else {
        // Last frame: wait its duration then trigger zoom
        setTimeout(() => {
          if (!cancelled) {
            setPhase('zooming')
            setZooming(true)
            setWhiteVisible(true)
          }
        }, duration)
      }
    }

    playFrame()
    return () => { cancelled = true }
  }, [phase])

  // Zoom phase: call onComplete after 850ms
  useEffect(() => {
    if (phase !== 'zooming') return
    const id = setTimeout(() => {
      onCompleteRef.current()
    }, 850)
    return () => clearTimeout(id)
  }, [phase])

  function handleLetterClick() {
    if (phase !== 'idle') return
    setPhase('passwordPrompt')
  }

  function handleSubmit() {
    if (password.trim() === CORRECT_PASSWORD) {
      setModalClosing(true)
      setTimeout(() => {
        setPhase('opening')
        setModalClosing(false)
      }, 200)
    } else {
      setInputError(true)
      setTimeout(() => setInputError(false), 600)
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSubmit()
  }

  const currentSrc =
    phase === 'opening' || phase === 'zooming'
      ? OPENING_FRAMES[openingFrame]
      : IDLE_FRAMES[idleFrame]

  return (
    <div className="ch0-root">
      {/* Love letter image — clicking triggers password prompt in idle phase */}
      <img
        src={currentSrc}
        alt=""
        className={`ch0-letter-img${zooming ? ' ch0-zooming' : ''}`}
        onClick={handleLetterClick}
        draggable={false}
      />

      {/* "tap to open" hint — visible only during idle */}
      {phase === 'idle' && (
        <div className="ch0-hint">tap to open ♡</div>
      )}

      {/* Password modal — visible during prompt + closing animation */}
      {(phase === 'passwordPrompt' || modalClosing) && (
        <div className="ch0-modal-backdrop">
          <div className={`ch0-modal${modalClosing ? ' ch0-closing' : ''}`}>
            <p>There is only 1 special person can open this love letter.</p>
            <p>The password is the first day we met and talk to each other</p>
            <input
              className={`ch0-input${inputError ? ' ch0-input-error' : ''}`}
              type="text"
              inputMode="text"
              placeholder="DD/MM/YYYY"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <div className="ch0-error-text">
              {inputError ? "That's not right… try again ♡" : ''}
            </div>
            <button className="ch0-btn" onClick={handleSubmit}>
              open ♡
            </button>
          </div>
        </div>
      )}

      {/* White overlay — fades in during zoom transition */}
      <div className={`ch0-white-overlay${whiteVisible ? ' ch0-fade-in' : ''}`} />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/chapters/Chapter0/index.tsx
git commit -m "feat(ch0): add Chapter0 component with state machine"
```

---

## Task 4: Update `SceneManager.tsx`

Add Chapter 0 registration, change default start chapter to 0, and add the ch0→ch1 direct switch with a white-overlay fade-out (no cloud wipe).

**Files:**
- Modify: `components/SceneManager.tsx`

- [ ] **Step 1: Replace SceneManager.tsx**

Replace the entire contents of `components/SceneManager.tsx` with:

```tsx
'use client'
import { useState, useCallback, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import ChapterTransition from './ChapterTransition'
import ChapterStub from './chapters/ChapterStub'

type Dir = 'rtl' | 'ltr' | 'btt' | 'ttb'

const Chapter0 = dynamic(() => import('./chapters/Chapter0'), { ssr: false })
const Chapter1 = dynamic(() => import('./chapters/Chapter1'), { ssr: false })
const Chapter2 = dynamic(() => import('./chapters/Chapter2'), { ssr: false })
const Chapter3 = dynamic(() => import('./chapters/Chapter3'), { ssr: false })
const Chapter5 = dynamic(() => import('./chapters/Chapter5'), { ssr: false })
const Chapter6 = dynamic(() => import('./chapters/Chapter6'), { ssr: false })

function dirFor(to: number): Dir {
  if (to === 2) return 'ttb'
  if (to === 3) return 'btt'
  if (to === 7) return 'ttb'
  return 'rtl'
}

export default function SceneManager() {
  const [currentChapter, setCurrentChapter] = useState(() => {
    if (typeof window !== 'undefined') {
      const n = parseInt(window.location.hash.replace('#ch', ''), 10)
      if (!isNaN(n) && n >= 0) return n
    }
    return 0
  })
  const [transitioning, setTransitioning] = useState(false)
  const [pendingChapter, setPendingChapter] = useState<number | null>(null)
  const [transitionDir, setTransitionDir] = useState<Dir>('rtl')

  // White overlay that bridges the ch0 → ch1 unmount gap
  const [ch0FadeOut, setCh0FadeOut] = useState(false)
  const [ch0FadeOpacity, setCh0FadeOpacity] = useState(1)

  const advanceChapter = useCallback((to: number) => {
    setTransitionDir(dirFor(to))
    setPendingChapter(to)
    setTransitioning(true)
  }, [])

  const handleMidpoint = useCallback(() => {
    if (pendingChapter !== null) setCurrentChapter(pendingChapter)
  }, [pendingChapter])

  const handleTransitionDone = useCallback(() => {
    setTransitioning(false)
    setPendingChapter(null)
  }, [])

  // ch0 complete: direct switch to ch1, no cloud wipe
  const handleCh0Complete = useCallback(() => {
    setCurrentChapter(1)
    setCh0FadeOut(true)
    setCh0FadeOpacity(1)
    // Two rAF ticks to ensure the div is painted at opacity 1 before transitioning
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setCh0FadeOpacity(0)
      })
    })
  }, [])

  return (
    <div style={{ width: '100vw', height: '100dvh', overflow: 'hidden', position: 'relative' }}>
      {currentChapter === 0 && (
        <div data-testid="chapter-0" style={{ width: '100%', height: '100%' }}>
          <Chapter0 onComplete={handleCh0Complete} />
        </div>
      )}
      {currentChapter === 1 && (
        <div data-testid="chapter-1" style={{ width: '100%', height: '100%' }}>
          <Chapter1 onComplete={() => advanceChapter(2)} />
        </div>
      )}
      {currentChapter === 2 && (
        <div data-testid="chapter-2" style={{ width: '100%', height: '100%' }}>
          <Chapter2 onComplete={() => advanceChapter(3)} />
        </div>
      )}
      {currentChapter === 3 && (
        <div data-testid="chapter-3" style={{ width: '100%', height: '100%' }}>
          <Chapter3 onComplete={() => advanceChapter(4)} />
        </div>
      )}
      {currentChapter === 5 && (
        <div data-testid="chapter-5" style={{ width: '100%', height: '100%' }}>
          <Chapter5 onComplete={() => advanceChapter(6)} />
        </div>
      )}
      {currentChapter === 6 && (
        <div data-testid="chapter-6" style={{ width: '100%', height: '100%' }}>
          <Chapter6 onComplete={() => advanceChapter(7)} />
        </div>
      )}
      {currentChapter > 3 && currentChapter !== 5 && currentChapter !== 6 && (
        <div data-testid={`chapter-stub-${currentChapter}`} style={{ width: '100%', height: '100%' }}>
          <ChapterStub
            chapterNumber={currentChapter}
            onBack={() => advanceChapter(1)}
          />
        </div>
      )}

      {/* White overlay that fades out after ch0 → ch1 switch */}
      {ch0FadeOut && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: '#fff',
            opacity: ch0FadeOpacity,
            transition: 'opacity 500ms ease-in-out',
            zIndex: 50,
            pointerEvents: 'none',
          }}
          onTransitionEnd={() => setCh0FadeOut(false)}
        />
      )}

      <ChapterTransition
        active={transitioning}
        dir={transitionDir}
        onMidpoint={handleMidpoint}
        onDone={handleTransitionDone}
      />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/SceneManager.tsx
git commit -m "feat(ch0): wire Chapter0 into SceneManager, default to ch0"
```

---

## Task 5: Manual Verification

No automated test harness exists in this project — verify visually.

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

Open `http://localhost:3000` in the browser.

- [ ] **Step 2: Verify idle phase**

- Pink `#F4A7B9` background fills the screen
- Love letter image is centered and fits the viewport
- 3-frame idle animation loops (heart seal gently pulses)
- "tap to open ♡" hint appears at the bottom after ~1 second
- Cursor is a pointer on hover over the letter

- [ ] **Step 3: Verify wrong password**

- Click the letter → modal appears with scale-in animation and slight tilt
- Type something wrong (e.g. `wrong`) → press Enter or click "open ♡"
- Input shakes, border turns red, error text appears: "That's not right… try again ♡"
- Error clears after 600ms

- [ ] **Step 4: Verify correct password**

- Clear input, type `19/03/2026` → press Enter
- Modal scales out (closing animation)
- Opening animation plays: 7 frames over ~930ms (envelope opens, letter rises)
- Zoom starts: letter scales up with pivot on the white letter paper (upper center area)
- White overlay fades in over ~900ms
- Screen goes fully white

- [ ] **Step 5: Verify ch1 reveal**

- After white-out: Chapter 1 appears with the white div fading out over 500ms
- Chapter 1 starts normally (Nick and Judy, city background, intro beat)
- No cloud-wipe animation appears

- [ ] **Step 6: Verify hash routing**

- Navigate to `http://localhost:3000/#ch1` → should start at Chapter 1 directly (skips Chapter 0)
- Navigate to `http://localhost:3000/#ch0` → should show Chapter 0
- Navigate to `http://localhost:3000/` (no hash) → should show Chapter 0

- [ ] **Step 7: Final commit**

```bash
git add -A
git status  # confirm only expected files
git commit -m "feat(ch0): Chapter 0 love letter gate — complete"
```
