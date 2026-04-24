# Chapter 5+6 — "The Part Where We Went Too Fast" Implementation Plan (React)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Chapter 5 React component — two-movement scroll experience: fast chaotic M1 (The Speedrun) ending in a memory flash montage + glitch cut, then slow tender M2 (The Glitch) with foggy forest background and breathing pulse. Register it in SceneManager so it renders at `currentChapter === 5`.

**Architecture:** `'use client'` React component at `components/chapters/Chapter5/index.tsx`. GSAP for animations. IntersectionObserver via useEffect + refs for scroll-driven beat reveals. Fixed bg + rain layer + fog overlay + scroll content — all via CSS with `ch5-` class prefix. Backgrounds served from `public/chapter5/`.

**Tech Stack:** React 18, TypeScript, GSAP, CSS (ch5- prefix, no CSS modules), Next.js dynamic import, Google Fonts via layout.tsx (Poppins via Inter variable).

**Design spec:** `docs/superpowers/specs/2026-04-24-ch5-6-design.md`

**Key conventions from existing chapters:**
- Props: `interface Props { onComplete: () => void }`
- Stale closure prevention: `const onCompleteRef = useRef(onComplete); onCompleteRef.current = onComplete`
- Single `useEffect` for setup + return cleanup function
- GSAP cleanup: `gsap.killTweensOf(el)` + `timeline.kill()`
- CSS class prefix: `ch5-` on all classes
- `'use client'` at top of file

---

## File Structure

```
components/chapters/Chapter5/
  index.tsx          ← main component (all logic)
  chapter5.css       ← all styles with ch5- prefix

public/chapter5/
  bg_rainy_forest.png   ← copy from debug/
  bg_foggy_forest.png   ← copy from debug/
```

Memory flash images (already exist, reference by public path):
- `/chapter3/backgrounds/city_night/city_base.png`
- `/chapter4/backgrounds/bg_night_room.png`
- `/chapter4/backgrounds/bg_restaurant_table.png`
- `/chapter4/backgrounds/bg_tree_path.png`
- `/chapter4/backgrounds/bg_shelter.png`

---

## Task 1: Copy background assets + register Chapter5 in SceneManager

**Files:**
- Copy: `debug/bg_rainy_forest.png` → `public/chapter5/bg_rainy_forest.png`
- Copy: `debug/bg_foggy_forest.png` → `public/chapter5/bg_foggy_forest.png`
- Modify: `components/SceneManager.tsx` — add Chapter5 dynamic import + render condition

- [ ] **Step 1: Create directory and copy assets**

```bash
mkdir -p public/chapter5
cp debug/bg_rainy_forest.png public/chapter5/bg_rainy_forest.png
cp debug/bg_foggy_forest.png public/chapter5/bg_foggy_forest.png
ls -lh public/chapter5/
```

Expected: two PNG files, each ~3MB.

- [ ] **Step 2: Add Chapter5 to SceneManager**

Read `components/SceneManager.tsx`. Add after the Chapter3 dynamic import line:

```typescript
const Chapter5 = dynamic(() => import('./chapters/Chapter5'), { ssr: false })
```

Add after the `currentChapter === 3` block (before the `currentChapter > 3` block):

```tsx
{currentChapter === 5 && (
  <div data-testid="chapter-5" style={{ width: '100%', height: '100%' }}>
    <Chapter5 onComplete={() => advanceChapter(6)} />
  </div>
)}
```

Also update the `currentChapter > 3` condition to exclude chapter 5:

```tsx
{currentChapter > 3 && currentChapter !== 5 && (
```

- [ ] **Step 3: Create placeholder component so the app compiles**

Create `components/chapters/Chapter5/index.tsx`:

```tsx
'use client'
interface Props { onComplete: () => void }
export default function Chapter5({ onComplete }: Props) {
  return (
    <div style={{ width: '100%', height: '100%', background: '#0D1117', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#aaa', fontFamily: 'sans-serif' }}>Chapter 5 — coming soon</p>
    </div>
  )
}
```

- [ ] **Step 4: Verify app compiles and navigates to Chapter 5**

```bash
npm run dev
```

Open `http://localhost:3000/#ch5`. Expected: dark screen with "Chapter 5 — coming soon" text. No TypeScript errors in console.

- [ ] **Step 5: Commit**

```bash
git add public/chapter5/ components/SceneManager.tsx components/chapters/Chapter5/index.tsx
git commit -m "feat(ch5): scaffold Chapter5 component + register in SceneManager"
```

---

## Task 2: CSS layer stack + background images

**Files:**
- Create: `components/chapters/Chapter5/chapter5.css`
- Modify: `components/chapters/Chapter5/index.tsx` — import CSS, render layer divs

- [ ] **Step 1: Create `chapter5.css` with reset, layers, and fog overlay**

```css
/* ── Chapter 5 — "The Part Where We Went Too Fast" ── */

.ch5-root {
  position: relative;
  width: 100%; height: 100%;
  overflow-y: auto; overflow-x: hidden;
  font-family: 'Poppins', 'Inter', sans-serif;
  color: #F0F0F0;
  background: #0D1117;
}

/* ── Background image ── */
.ch5-bg {
  position: fixed; inset: 0; z-index: 0;
  background-size: cover; background-position: center;
  background-image: url('/chapter5/bg_rainy_forest.png');
  pointer-events: none;
}
.ch5-root.ch5-m2 .ch5-bg {
  background-image: url('/chapter5/bg_foggy_forest.png');
  /* instant swap — no transition */
}

/* ── Rain layer ── */
.ch5-rain {
  position: fixed; inset: 0; z-index: 1;
  pointer-events: none; overflow: hidden;
}
.ch5-drop {
  position: absolute; top: -20px;
  width: 1.5px; border-radius: 2px;
  background: rgba(150, 170, 200, 0.6);
  animation: ch5RainFall linear infinite;
}
@keyframes ch5RainFall {
  from { transform: translateY(0) translateX(0); }
  to   { transform: translateY(115vh) translateX(var(--dx, -20px)); }
}

/* ── Fog overlay (M2 only) ── */
.ch5-fog {
  position: fixed; inset: 0; z-index: 2;
  pointer-events: none;
  background: radial-gradient(ellipse at center, rgba(200,210,230,0.12) 0%, transparent 70%);
  backdrop-filter: blur(2px);
  opacity: 0;
}
.ch5-root.ch5-m2 .ch5-fog {
  animation: ch5Breathe 4s ease-in-out infinite;
}
@keyframes ch5Breathe {
  0%, 100% { opacity: 0.04; }
  50%       { opacity: 0.10; }
}

/* ── Memory flash overlay ── */
.ch5-flash {
  position: fixed; inset: 0; z-index: 100;
  display: none;
  background-size: cover; background-position: center;
  background-color: #fff;
}
.ch5-glitch {
  filter: invert(1);
}

/* ── Scroll content ── */
.ch5-scroll {
  position: relative; z-index: 3;
  max-width: 620px; margin: 0 auto;
  padding: 0 28px 30vh;
}

/* ── Spacers ── */
.ch5-sp    { height: 12vh; }
.ch5-sp-m2 { height: 40vh; }
```

- [ ] **Step 2: Update `index.tsx` to import CSS and render layer divs**

```tsx
'use client'
import { useRef } from 'react'
import './chapter5.css'

interface Props { onComplete: () => void }

export default function Chapter5({ onComplete }: Props) {
  const rootRef   = useRef<HTMLDivElement>(null)
  const rainRef   = useRef<HTMLDivElement>(null)
  const flashRef  = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <div className="ch5-root" ref={rootRef}>
      <div className="ch5-bg" />
      <div className="ch5-rain" ref={rainRef} />
      <div className="ch5-fog" />
      <div className="ch5-flash" ref={flashRef} />
      <div className="ch5-scroll" ref={scrollRef}>
        {/* beats added in Tasks 3 + 5 */}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify in browser**

Navigate to `http://localhost:3000/#ch5`. Expected: rainy forest background fills the screen. No rain yet. No text. No TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add components/chapters/Chapter5/
git commit -m "feat(ch5): layer stack CSS + background image"
```

---

## Task 3: CSS rain + M1 beat CSS

**Files:**
- Modify: `components/chapters/Chapter5/chapter5.css` — add beat + typography CSS
- Modify: `components/chapters/Chapter5/index.tsx` — add rain generator in useEffect

- [ ] **Step 1: Add beat + typography CSS to `chapter5.css`**

```css
/* ── Beat reveal (M1 — fast 0.5s) ── */
.ch5-beat {
  padding: 5vh 0; text-align: center;
  opacity: 0; transform: translateY(20px);
  transition: opacity 0.5s cubic-bezier(.22,.61,.36,1),
              transform 0.5s cubic-bezier(.22,.61,.36,1);
}
.ch5-beat.ch5-skew { transform: translateY(20px) skewX(1deg); }
.ch5-beat.ch5-on   { opacity: 1; transform: translateY(0) skewX(0deg); }

/* Beat 1: deceptive calm — 0.85s override */
#ch5-b1 {
  transition-duration: 0.85s;
}

/* ── Beat reveal (M2 — slow with blur) ── */
.ch5-beat-m2 {
  padding: 6vh 0; text-align: center;
  opacity: 0; transform: translateY(24px);
  filter: blur(4px);
  transition: opacity 1.2s cubic-bezier(.22,.61,.36,1),
              transform 1.2s cubic-bezier(.22,.61,.36,1),
              filter 1.2s ease;
}
.ch5-beat-m2.ch5-on    { opacity: 1; transform: translateY(0); filter: blur(0); }
.ch5-beat-m2.ch5-no-blur        { filter: none; }
.ch5-beat-m2.ch5-no-blur.ch5-on { filter: none; }
/* beat16 — slowest */
#ch5-b16 {
  transition-duration: 1.4s;
}

/* ── Staggered children ── */
.ch5-beat [data-d],
.ch5-beat-m2 [data-d] {
  opacity: 0; transform: translateY(14px);
  transition: opacity 0.5s cubic-bezier(.22,.61,.36,1),
              transform 0.5s cubic-bezier(.22,.61,.36,1);
}
.ch5-beat [data-d].ch5-on,
.ch5-beat-m2 [data-d].ch5-on { opacity: 1; transform: none; }

/* ── M1 Typography ── */
.ch5-t-calm  { font-size:clamp(18px,2.2vw,26px); font-weight:400; font-style:italic; line-height:1.7; color:#D0D8E8; }
.ch5-t-bold  { font-size:clamp(20px,2.6vw,30px); font-weight:600; line-height:1.5; }
.ch5-t-hero  { font-size:clamp(26px,3.5vw,44px); font-weight:700; line-height:1.3; }
.ch5-t-mono  { font-family:'JetBrains Mono','Courier New',monospace; font-size:clamp(14px,1.7vw,19px); font-weight:400; color:#A8C0D8; letter-spacing:0.03em; }
.ch5-t-quote { font-size:clamp(22px,2.9vw,36px); font-weight:700; line-height:1.4; }
.ch5-t-conf  { font-size:clamp(16px,2vw,22px); font-weight:400; font-style:italic; color:#B0C4D8; line-height:1.7; }

/* ── M2 Typography ── */
.ch5-t-m2-main { font-size:clamp(20px,2.5vw,30px); font-weight:400; line-height:1.8; color:#E8ECF0; }
.ch5-t-m2-soft { font-size:clamp(16px,1.9vw,22px); font-weight:400; font-style:italic; line-height:1.9; color:#C8D4E0; }
.ch5-t-m2-key  { font-size:clamp(20px,2.5vw,30px); font-weight:500; line-height:1.8; color:#E8ECF0; }
.ch5-t-m2-core { font-size:clamp(20px,2.5vw,30px); font-weight:400; line-height:1.9; color:#EEF2F6; }

/* ── Chapter end button ── */
.ch5-end {
  text-align:center; opacity:0;
  transition: opacity 1.5s ease;
  padding: 8vh 0 20vh;
}
.ch5-end.ch5-on { opacity: 1; }
.ch5-end-label {
  font-size:clamp(13px,1.5vw,16px); color:rgba(200,215,230,0.5);
  letter-spacing:0.12em; text-transform:uppercase; margin-bottom:28px;
  display:block;
}
.ch5-next-btn {
  background:transparent; border:1px solid rgba(200,215,230,0.3);
  color:rgba(200,215,230,0.7); padding:12px 32px; border-radius:30px;
  font-family:inherit; font-size:clamp(14px,1.6vw,17px); cursor:pointer;
  letter-spacing:0.05em;
  transition: border-color 0.3s ease, color 0.3s ease;
  min-height:48px;
}
.ch5-next-btn:hover {
  border-color:rgba(200,215,230,0.7);
  color:rgba(200,215,230,1);
}
```

- [ ] **Step 2: Add rain generator + useEffect to `index.tsx`**

Update `index.tsx`:

```tsx
'use client'
import { useRef, useEffect } from 'react'
import './chapter5.css'

interface Props { onComplete: () => void }

function spawnRain(
  container: HTMLDivElement,
  count: number, minDur: number, maxDur: number,
  minOp: number, maxOp: number, dxRange: number
) {
  container.innerHTML = ''
  for (let i = 0; i < count; i++) {
    const drop = document.createElement('div')
    drop.className = 'ch5-drop'
    const dur = minDur + Math.random() * (maxDur - minDur)
    const op  = minOp  + Math.random() * (maxOp  - minOp)
    const dx  = -(Math.random() * dxRange)
    const h   = 12 + Math.random() * 6
    drop.style.cssText = [
      `left:${Math.random() * 110 - 5}vw`,
      `height:${h}px`,
      `opacity:${op}`,
      `--dx:${dx}px`,
      `animation-duration:${dur.toFixed(2)}s`,
      `animation-delay:${(Math.random() * maxDur * -1).toFixed(2)}s`,
    ].join(';')
    container.appendChild(drop)
  }
}

export default function Chapter5({ onComplete }: Props) {
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const rootRef   = useRef<HTMLDivElement>(null)
  const rainRef   = useRef<HTMLDivElement>(null)
  const flashRef  = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const rain = rainRef.current
    if (!rain) return
    spawnRain(rain, 80, 1.0, 1.4, 0.4, 0.7, 20)
    return () => { rain.innerHTML = '' }
  }, [])

  return (
    <div className="ch5-root" ref={rootRef}>
      <div className="ch5-bg" />
      <div className="ch5-rain" ref={rainRef} />
      <div className="ch5-fog" />
      <div className="ch5-flash" ref={flashRef} />
      <div className="ch5-scroll" ref={scrollRef}>
        {/* beats added in Tasks 4 + 5 */}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify rain in browser**

Navigate to `http://localhost:3000/#ch5`. Expected: animated rain falling diagonally over the dark forest. No TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add components/chapters/Chapter5/
git commit -m "feat(ch5): CSS beats + rain generator"
```

---

## Task 4: M1 beats JSX

**Files:**
- Modify: `components/chapters/Chapter5/index.tsx` — add M1 beats to scroll content

- [ ] **Step 1: Replace the `{/* beats added in Tasks 4 + 5 */}` comment with M1 JSX**

```tsx
<div className="ch5-sp" />

{/* b1: deceptive calm */}
<div className="ch5-beat" id="ch5-b1">
  <p className="ch5-t-calm">Then…</p>
</div>
<div className="ch5-sp" />

{/* b2 */}
<div className="ch5-beat" id="ch5-b2">
  <p className="ch5-t-bold">we did something impressive.</p>
</div>
<div className="ch5-sp" />

{/* b3: hero line */}
<div className="ch5-beat" id="ch5-b3">
  <p className="ch5-t-hero">We speedran a relationship.</p>
</div>
<div className="ch5-sp" />

{/* b4: monospace trio */}
<div className="ch5-beat" id="ch5-b4">
  <p className="ch5-t-mono">Any% completion.</p>
  <p className="ch5-t-mono" data-d="150">No tutorials.</p>
  <p className="ch5-t-mono" data-d="300">No save points.</p>
</div>
<div className="ch5-sp" />

{/* b7 */}
<div className="ch5-beat" id="ch5-b7">
  <p className="ch5-t-bold">I might have pressed</p>
</div>
<div className="ch5-sp" />

{/* b8: skew glitch */}
<div className="ch5-beat ch5-skew" id="ch5-b8">
  <p className="ch5-t-quote">&ldquo;fast forward&rdquo;</p>
</div>
<div className="ch5-sp" />

{/* b9: confession */}
<div className="ch5-beat" id="ch5-b9">
  <p className="ch5-t-conf">a bit too hard.</p>
</div>

{/* M2 beats added in Task 5 */}
```

- [ ] **Step 2: Temporarily verify beats render**

In `chapter5.css`, temporarily add `opacity: 1; transform: none;` to `.ch5-beat` (remove after verify). Expected: all M1 beats visible and styled correctly over the rainy forest. Remove the override after checking.

- [ ] **Step 3: Commit**

```bash
git add components/chapters/Chapter5/index.tsx
git commit -m "feat(ch5): M1 beat JSX"
```

---

## Task 5: M2 beats JSX + memory flash + hard cut

**Files:**
- Modify: `components/chapters/Chapter5/index.tsx`

- [ ] **Step 1: Add M2 beats JSX after the `{/* M2 beats added in Task 5 */}` comment**

```tsx
{/* ══ M2 ══ */}
<div className="ch5-sp-m2" />

<div className="ch5-beat-m2" id="ch5-b10">
  <p className="ch5-t-m2-soft">Somewhere in the middle…</p>
</div>
<div className="ch5-sp-m2" />

<div className="ch5-beat-m2" id="ch5-b11">
  <p className="ch5-t-m2-main">things got a little blurry.</p>
</div>
<div className="ch5-sp-m2" />

<div className="ch5-beat-m2" id="ch5-b12">
  <p className="ch5-t-m2-soft">Not wrong.</p>
</div>
<div className="ch5-sp-m2" />

<div className="ch5-beat-m2" id="ch5-b13">
  <p className="ch5-t-m2-soft">Just…</p>
</div>
<div className="ch5-sp-m2" />

<div className="ch5-beat-m2" id="ch5-b14">
  <p className="ch5-t-m2-key">too much, too fast.</p>
</div>
<div className="ch5-sp-m2" />

<div className="ch5-beat-m2 ch5-no-blur" id="ch5-b15">
  <p className="ch5-t-m2-main">You weren&rsquo;t pulling away.</p>
</div>
<div className="ch5-sp-m2" />

<div className="ch5-beat-m2 ch5-no-blur" id="ch5-b16">
  <p className="ch5-t-m2-core">You were just trying to breathe.</p>
</div>
<div className="ch5-sp-m2" />

<div className="ch5-end" id="ch5-end">
  <span className="ch5-end-label">Chapter 5</span>
  <button className="ch5-next-btn" id="ch5-next-btn">Continue →</button>
</div>
```

- [ ] **Step 2: Add memory flash + hard cut logic inside the `useEffect`**

Replace the existing `useEffect` with this expanded version:

```tsx
useEffect(() => {
  const root  = rootRef.current
  const rain  = rainRef.current
  const flash = flashRef.current
  if (!root || !rain || !flash) return

  /* start M1 rain */
  spawnRain(rain, 80, 1.0, 1.4, 0.4, 0.7, 20)

  /* ── Memory flash images ── */
  const FLASH_SRCS = [
    '/chapter3/backgrounds/city_night/city_base.png',
    '/chapter4/backgrounds/bg_night_room.png',
    '/chapter4/backgrounds/bg_restaurant_table.png',
    '/chapter4/backgrounds/bg_tree_path.png',
    '/chapter4/backgrounds/bg_shelter.png',
    null, /* white flash */
  ]

  let memFired = false

  function triggerMemoryFlash(onDone: () => void) {
    if (memFired) return
    memFired = true

    const scrollEl = root   /* lock scroll on root div */
    const origOverflow = scrollEl.style.overflow
    scrollEl.style.overflow = 'hidden'
    flash.style.display = 'block'

    let i = 0
    function next() {
      if (i >= FLASH_SRCS.length) {
        /* glitch flash */
        root.classList.add('ch5-glitch')
        setTimeout(() => {
          root.classList.remove('ch5-glitch')
          flash.style.display = 'none'
          scrollEl.style.overflow = origOverflow
          onDone()
        }, 80)
        return
      }
      const src = FLASH_SRCS[i++]
      if (src) {
        flash.style.backgroundColor = ''
        flash.style.backgroundImage = `url('${src}')`
      } else {
        flash.style.backgroundImage = 'none'
        flash.style.backgroundColor = '#ffffff'
      }
      setTimeout(next, 150)
    }
    next()
  }

  function activateM2() {
    root.classList.add('ch5-m2')
    spawnRain(rain, 30, 2.2, 2.8, 0.2, 0.35, 35)
    /* obs2 starts observing M2 beats — set below */
    document.querySelectorAll<HTMLElement>('.ch5-beat-m2').forEach(b => obs2.observe(b))
  }

  /* ── Observer 1: M1 beats ── */
  const obs1 = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return
      const el = e.target as HTMLElement
      el.classList.add('ch5-on')
      obs1.unobserve(el)
      el.querySelectorAll<HTMLElement>('[data-d]').forEach(c =>
        setTimeout(() => c.classList.add('ch5-on'), +(c.dataset.d ?? 0))
      )
      if (el.id === 'ch5-b9') {
        setTimeout(() => triggerMemoryFlash(activateM2), 600)
      }
    })
  }, { threshold: 0.18, rootMargin: '0px 0px -10px 0px' })

  /* ── Observer 2: M2 beats ── */
  const obs2 = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return
      const el = e.target as HTMLElement
      el.classList.add('ch5-on')
      obs2.unobserve(el)
      if (el.id === 'ch5-b16') {
        setTimeout(() => {
          const endEl = document.getElementById('ch5-end')
          if (endEl) endEl.classList.add('ch5-on')
          const btn = document.getElementById('ch5-next-btn')
          if (btn) btn.onclick = () => onCompleteRef.current()
        }, 1500)
      }
    })
  }, { threshold: 0.18, rootMargin: '0px 0px -60px 0px' })

  document.querySelectorAll<HTMLElement>('.ch5-beat').forEach(b => obs1.observe(b))
  /* obs2 starts after activateM2() is called */

  return () => {
    rain.innerHTML = ''
    obs1.disconnect()
    obs2.disconnect()
  }
}, [])
```

- [ ] **Step 3: End-to-end test in browser**

Navigate to `http://localhost:3000/#ch5`. Scroll slowly from top to bottom.

Expected sequence:
1. M1 beats (b1–b9) reveal quickly as you scroll
2. After b9 reveals: ~600ms pause → memory flash fires (~1s total)
3. Background instantly snaps to foggy forest, rain slows
4. M2 beats (b10–b16) reveal slowly with blur fade-in
5. b15 and b16 have no blur effect
6. After b16: "Continue →" button fades in after 1.5s
7. Clicking "Continue →" triggers the fade-out transition to Chapter 6 (stub)

- [ ] **Step 4: Commit**

```bash
git add components/chapters/Chapter5/
git commit -m "feat(ch5): M2 beats + memory flash + hard cut transition + observer wiring"
```

---

## Task 6: Polish — timing, mobile, scroll density

**Files:**
- Modify: `components/chapters/Chapter5/chapter5.css`
- Modify: `components/chapters/Chapter5/index.tsx` (if timing adjustments needed)

- [ ] **Step 1: Verify M1 beat density feels fast**

Scroll through M1 at a steady pace. The beats should feel like they're almost chasing you — barely time to absorb each one before the next appears. If too slow, reduce `.ch5-sp` from `12vh` to `8vh`.

- [ ] **Step 2: Verify M2 spaciousness**

After flash, scroll M2. You should need significant scroll before each new beat appears. If too fast, increase `.ch5-sp-m2` from `40vh` to `48vh`.

- [ ] **Step 3: Verify glitch skewX on b8**

Scroll to b8 ("fast forward"). The text should briefly enter with a `skewX(1deg)` lean and snap straight. Open DevTools → Animations tab to verify if needed. If the snap isn't visible, increase skew to `1.5deg` in `.ch5-beat.ch5-skew`.

- [ ] **Step 4: Mobile check — iPhone 14 Pro (390×844)**

DevTools → device toolbar. Check:
- Rain drops don't overflow horizontally (`.ch5-rain { overflow: hidden }` handles this)
- Beat text is legible at mobile size (`clamp()` handles this)
- "Continue →" button is tappable (`.ch5-next-btn { min-height: 48px }` handles this)
- Memory flash images cover full screen on mobile (`background-size: cover` handles this)

- [ ] **Step 5: Verify breathing pulse is subliminal in M2**

In M2, open DevTools → Elements → find `.ch5-fog`. Confirm it has `ch5-Breathe` animation with opacity cycling between 0.04 and 0.10. If visually distracting, reduce max opacity to `0.07`.

- [ ] **Step 6: Commit**

```bash
git add components/chapters/Chapter5/
git commit -m "feat(ch5): polish — density, mobile, timing"
```

---

## Task 7: Final verification checklist

Run through every item before marking done.

- [ ] Navigate to `http://localhost:3000/#ch5` — loads without errors, rainy forest visible
- [ ] M1 beats reveal quickly on scroll (b1–b9), faster than Ch4's reveal speed
- [ ] b8 ("fast forward") has visible skewX snap on entry
- [ ] b9 triggers memory flash ~600ms after appearing
- [ ] Memory flash: 5 images + white flash + 80ms invert ≈ 1s total lock
- [ ] Hard cut: background snaps instantly to foggy forest (no fade)
- [ ] Rain visibly slower after hard cut
- [ ] M2 beats (b10–b14) have blur fade-in effect
- [ ] b15 ("You weren't pulling away") — NO blur, clean reveal
- [ ] b16 ("You were just trying to breathe") — NO blur, slowest reveal (1.4s)
- [ ] Breathing pulse barely perceptible in M2
- [ ] "Continue →" button fades in 1.5s after b16
- [ ] Clicking "Continue →" triggers ChapterTransition to Chapter 6 stub
- [ ] Mobile: all checks from Task 6 pass
- [ ] No TypeScript errors in console
- [ ] No React hydration warnings

- [ ] **Final commit**

```bash
git add components/chapters/Chapter5/
git commit -m "feat(ch5): complete — The Part Where We Went Too Fast"
```
