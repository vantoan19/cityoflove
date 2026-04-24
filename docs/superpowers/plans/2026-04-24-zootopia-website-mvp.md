# Zootopia Story Website — MVP Chapter 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Next.js + React interactive story page for Chapter 1 — layered animated backgrounds, two tap-to-advance sprite characters, and a full-screen fade transition to a chapter stub.

**Architecture:** Single-page app. `SceneManager` owns `currentChapter` state and renders the active chapter. `Chapter1` owns `currentBeat` (0–7) and drives `Background`, `Characters`, and `DialogueBox`. A `ChapterTransition` overlay handles full-screen fades between chapters. No routing.

**Tech Stack:** Next.js 14 (App Router), React 18, TypeScript 5, Tailwind CSS, CSS Modules, Vitest + React Testing Library, Vercel.

---

## File Map

```
city/                                         ← project root (new Next.js project here)
├── app/
│   ├── layout.tsx                            CREATE — HTML shell, fonts, viewport meta
│   ├── page.tsx                              CREATE — renders <SceneManager />
│   └── globals.css                           CREATE — Tailwind directives + CSS resets
├── components/
│   ├── SceneManager.tsx                      CREATE — currentChapter state, chapter router
│   ├── ChapterTransition.tsx                 CREATE — fixed full-screen fade overlay
│   └── chapters/
│       ├── Chapter1/
│       │   ├── index.tsx                     CREATE — Chapter1 root; currentBeat state; tap handler
│       │   ├── Background.tsx                CREATE — 4 CSS-animated background layers
│       │   ├── Background.module.css         CREATE — @keyframes for all layers
│       │   ├── Characters.tsx                CREATE — Nick + Judy; pose switching + crossfade
│       │   ├── Characters.module.css         CREATE — fadeIn keyframe
│       │   ├── SpriteAnimation.tsx           CREATE — generic frame-cycling img component
│       │   ├── DialogueBox.tsx               CREATE — beat text, progress dots, CTA button
│       │   ├── DialogueBox.module.css        CREATE — frosted glass, text fadeIn
│       │   ├── NavigationHint.tsx            CREATE — pulsing "tap to begin/continue" label
│       │   ├── NavigationHint.module.css     CREATE — pulse keyframe
│       │   ├── types.ts                      CREATE — NickPose, JudyPose, Beat, PoseConfig types
│       │   ├── chapter1-beats.ts             CREATE — beats array (8 entries, beat 0–7)
│       │   └── chapter1-poses.ts             CREATE — nickPoseConfigs, judyPoseConfigs
│       └── ChapterStub.tsx                   CREATE — placeholder for chapters 2–9
├── scripts/
│   └── copy-assets.mjs                       CREATE — copies PNGs from chapter1/animations/ → public/
├── public/
│   └── chapter1/                             POPULATED by copy-assets.mjs
│       ├── backgrounds/{layer}/frame*.png
│       └── characters/{nick,judy}/{pose}/frame*.png
├── __tests__/
│   ├── chapter1-beats.test.ts                CREATE — beat data shape
│   ├── chapter1-poses.test.ts                CREATE — pose configs completeness
│   ├── SceneManager.test.tsx                 CREATE — chapter routing
│   └── DialogueBox.test.tsx                  CREATE — tap-to-advance logic
├── vitest.config.ts                          CREATE
├── vitest.setup.ts                           CREATE
├── tailwind.config.ts                        CREATE
└── next.config.ts                            CREATE
```

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json` (via `create-next-app`)
- Create: `vitest.config.ts`, `vitest.setup.ts`
- Create: `tailwind.config.ts`, `app/globals.css`

- [ ] **Step 1: Initialise Next.js project**

Run from `C:/Projects/city` (accept defaults, choose TypeScript + Tailwind + App Router + no src/):
```bash
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*" --yes
```
Expected: project files created, `npm run dev` works.

- [ ] **Step 2: Install Vitest + React Testing Library**

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
  },
})
```

- [ ] **Step 4: Create `vitest.setup.ts`**

```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 5: Add test script to `package.json`**

In the `"scripts"` block add:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 6: Replace `app/globals.css` content**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
  overflow: hidden;
}
```

- [ ] **Step 7: Confirm dev server starts**

```bash
npm run dev
```
Expected: Next.js dev server at http://localhost:3000, no errors.

- [ ] **Step 8: Initialise git**

```bash
git init
echo "node_modules\n.next\n.vercel\n.superpowers" > .gitignore
git add -A
git commit -m "chore: scaffold Next.js project with Vitest"
```

---

## Task 2: Asset Migration

**Files:**
- Create: `scripts/copy-assets.mjs`
- Populated: `public/chapter1/`

- [ ] **Step 1: Create migration script**

```js
// scripts/copy-assets.mjs
import { cpSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

const SRC = 'chapter1/animations'
const DST = 'public/chapter1'

function copy(src, dst) {
  if (!existsSync(src)) { console.warn(`SKIP (missing): ${src}`); return }
  mkdirSync(dst, { recursive: true })
  cpSync(src, dst, { recursive: true, filter: p => !p.endsWith('animation.md') })
  console.log(`✓ ${src} → ${dst}`)
}

// Backgrounds
for (const layer of ['sky', 'mountains', 'city_buildings', 'foreground_bushes']) {
  copy(join(SRC, 'backgrounds', layer), join(DST, 'backgrounds', layer))
}

// Nick (fox)
const nickPoses = [
  'pose1_neutral_idle', 'pose2_presenting', 'pose3_shrug',
  'pose4_pointing_up', 'pose5_adjusting_sunglasses', 'pose6_finger_guns', 'pose7_thumbs_up',
]
for (const pose of nickPoses) {
  copy(join(SRC, 'fox', pose), join(DST, 'characters', 'nick', pose))
}

// Judy (bunny)
const judyPoses = [
  'pose1_neutral_idle', 'pose2_smug', 'pose3_curious_pointing',
  'pose4_surprised', 'pose5_amused', 'pose6_warm_happy',
]
for (const pose of judyPoses) {
  copy(join(SRC, 'bunny', pose), join(DST, 'characters', 'judy', pose))
}

console.log('\nDone. Assets in public/chapter1/')
```

- [ ] **Step 2: Run the script**

```bash
node scripts/copy-assets.mjs
```
Expected: all ✓ lines, no errors. Verify `public/chapter1/backgrounds/sky/frame1.png` exists.

- [ ] **Step 3: Add script to package.json**

```json
"copy-assets": "node scripts/copy-assets.mjs"
```

- [ ] **Step 4: Commit**

```bash
git add scripts/copy-assets.mjs public/chapter1 package.json
git commit -m "feat: asset migration script + populated public/chapter1"
```

---

## Task 3: TypeScript Types + Beat/Pose Data

**Files:**
- Create: `components/chapters/Chapter1/types.ts`
- Create: `components/chapters/Chapter1/chapter1-beats.ts`
- Create: `components/chapters/Chapter1/chapter1-poses.ts`
- Test: `__tests__/chapter1-beats.test.ts`
- Test: `__tests__/chapter1-poses.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// __tests__/chapter1-beats.test.ts
import { beats, INTRO_BEAT, CTA_BEAT, MAX_BEAT } from '../components/chapters/Chapter1/chapter1-beats'

test('has exactly 8 beats (0=intro, 1-6=dialogue, 7=CTA)', () => {
  expect(beats).toHaveLength(8)
})
test('beat 0 has no text', () => {
  expect(beats[INTRO_BEAT].text).toBeNull()
  expect(beats[INTRO_BEAT].cta).toBeUndefined()
})
test('beats 1–6 have non-null text and no CTA', () => {
  for (let i = 1; i <= 6; i++) {
    expect(beats[i].text).not.toBeNull()
    expect(beats[i].cta).toBeUndefined()
  }
})
test('beat 7 has no text and has CTA', () => {
  expect(beats[CTA_BEAT].text).toBeNull()
  expect(beats[CTA_BEAT].cta).toBe("Let's explore →")
})
test('MAX_BEAT is 7', () => {
  expect(MAX_BEAT).toBe(7)
})
```

```ts
// __tests__/chapter1-poses.test.ts
import { nickPoseConfigs, judyPoseConfigs } from '../components/chapters/Chapter1/chapter1-poses'

test('nickPoseConfigs has all 7 Nick poses', () => {
  const expected = ['neutral_idle','presenting','shrug','pointing_up','sunglasses','finger_guns','thumbs_up']
  expect(Object.keys(nickPoseConfigs)).toEqual(expect.arrayContaining(expected))
})
test('judyPoseConfigs has all 6 Judy poses', () => {
  const expected = ['neutral_idle','smug','curious_pointing','surprised','amused','warm_happy']
  expect(Object.keys(judyPoseConfigs)).toEqual(expect.arrayContaining(expected))
})
test('every nick pose has ≥1 frame and a positive frameInterval', () => {
  for (const cfg of Object.values(nickPoseConfigs)) {
    expect(cfg.frames.length).toBeGreaterThanOrEqual(1)
    expect(cfg.frameInterval).toBeGreaterThan(0)
  }
})
test('every judy pose has ≥1 frame and a positive frameInterval', () => {
  for (const cfg of Object.values(judyPoseConfigs)) {
    expect(cfg.frames.length).toBeGreaterThanOrEqual(1)
    expect(cfg.frameInterval).toBeGreaterThan(0)
  }
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test
```
Expected: FAIL — modules not found.

- [ ] **Step 3: Create `components/chapters/Chapter1/types.ts`**

```ts
export type NickPose =
  | 'neutral_idle' | 'presenting' | 'shrug' | 'pointing_up'
  | 'sunglasses' | 'finger_guns' | 'thumbs_up'

export type JudyPose =
  | 'neutral_idle' | 'smug' | 'curious_pointing'
  | 'surprised' | 'amused' | 'warm_happy'

export interface Beat {
  text: string | null
  cta?: string
  nickPose: NickPose
  judyPose: JudyPose
}

export interface PoseConfig {
  frames: string[]       // absolute public paths e.g. /chapter1/characters/nick/...
  frameInterval: number  // ms between frames
}
```

- [ ] **Step 4: Create `components/chapters/Chapter1/chapter1-beats.ts`**

```ts
import type { Beat } from './types'

export const beats: Beat[] = [
  { text: null,                         nickPose: 'neutral_idle', judyPose: 'neutral_idle'     },
  { text: 'Some cities are planned.',   nickPose: 'presenting',   judyPose: 'neutral_idle'     },
  { text: "This one… wasn’t.", nickPose: 'shrug',        judyPose: 'smug'             },
  { text: 'It just appeared.',          nickPose: 'pointing_up',  judyPose: 'curious_pointing' },
  { text: 'Unexpected.',                nickPose: 'sunglasses',   judyPose: 'surprised'        },
  { text: 'A little chaotic.',          nickPose: 'finger_guns',  judyPose: 'amused'           },
  { text: 'Kind of fun.',               nickPose: 'thumbs_up',    judyPose: 'warm_happy'       },
  { text: null, cta: "Let’s explore →", nickPose: 'thumbs_up', judyPose: 'warm_happy' },
]

export const INTRO_BEAT = 0
export const CTA_BEAT = 7
export const MAX_BEAT = beats.length - 1
```

- [ ] **Step 5: Create `components/chapters/Chapter1/chapter1-poses.ts`**

```ts
import type { NickPose, JudyPose, PoseConfig } from './types'

const n = (pose: string, count: number, dir: string): string[] =>
  Array.from({ length: count }, (_, i) =>
    `/chapter1/characters/nick/${dir}/frame${i + 1}.png`
  )

const j = (pose: string, count: number, dir: string): string[] =>
  Array.from({ length: count }, (_, i) =>
    `/chapter1/characters/judy/${dir}/frame${i + 1}.png`
  )

export const nickPoseConfigs: Record<NickPose, PoseConfig> = {
  neutral_idle: { frames: n('', 3, 'pose1_neutral_idle'),            frameInterval: 600 },
  presenting:   { frames: n('', 2, 'pose2_presenting'),              frameInterval: 700 },
  shrug:        { frames: n('', 3, 'pose3_shrug'),                   frameInterval: 500 },
  pointing_up:  { frames: n('', 2, 'pose4_pointing_up'),             frameInterval: 500 },
  sunglasses:   { frames: n('', 4, 'pose5_adjusting_sunglasses'),    frameInterval: 400 },
  finger_guns:  { frames: n('', 2, 'pose6_finger_guns'),             frameInterval: 400 },
  thumbs_up:    { frames: n('', 3, 'pose7_thumbs_up'),               frameInterval: 500 },
}

export const judyPoseConfigs: Record<JudyPose, PoseConfig> = {
  neutral_idle:     { frames: j('', 3, 'pose1_neutral_idle'),        frameInterval: 600 },
  smug:             { frames: j('', 2, 'pose2_smug'),                frameInterval: 900 },
  curious_pointing: { frames: j('', 2, 'pose3_curious_pointing'),    frameInterval: 900 },
  surprised:        { frames: j('', 3, 'pose4_surprised'),           frameInterval: 600 },
  amused:           { frames: j('', 2, 'pose5_amused'),              frameInterval: 1000 },
  warm_happy:       { frames: j('', 2, 'pose6_warm_happy'),          frameInterval: 1000 },
}
```

- [ ] **Step 6: Run tests — all should pass**

```bash
npm test
```
Expected: 9 tests pass.

- [ ] **Step 7: Commit**

```bash
git add components/chapters/Chapter1/types.ts components/chapters/Chapter1/chapter1-beats.ts components/chapters/Chapter1/chapter1-poses.ts __tests__/
git commit -m "feat: Chapter1 types, beat data, and pose configs"
```

---

## Task 4: SceneManager + ChapterTransition

**Files:**
- Create: `components/SceneManager.tsx`
- Create: `components/ChapterTransition.tsx`
- Test: `__tests__/SceneManager.test.tsx`

- [ ] **Step 1: Write failing test**

```tsx
// __tests__/SceneManager.test.tsx
import { render, screen } from '@testing-library/react'
import SceneManager from '../components/SceneManager'

test('renders chapter-1 scene on initial load', () => {
  render(<SceneManager />)
  expect(screen.getByTestId('chapter-1')).toBeInTheDocument()
})

test('does not render chapter-2 stub initially', () => {
  render(<SceneManager />)
  expect(screen.queryByTestId('chapter-stub-2')).not.toBeInTheDocument()
})
```

- [ ] **Step 2: Run to confirm fail**

```bash
npm test -- SceneManager
```
Expected: FAIL — SceneManager not found.

- [ ] **Step 3: Create `components/ChapterTransition.tsx`**

```tsx
'use client'
import { useEffect, useState } from 'react'

interface Props {
  active: boolean
  onMidpoint: () => void
  onDone: () => void
}

export default function ChapterTransition({ active, onMidpoint, onDone }: Props) {
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    if (!active) return
    // Fade in
    setOpacity(1)
    const midTimer = setTimeout(() => {
      onMidpoint()
      // Fade out
      setTimeout(() => {
        setOpacity(0)
        setTimeout(onDone, 600)
      }, 100)
    }, 800)
    return () => clearTimeout(midTimer)
  }, [active])

  if (!active && opacity === 0) return null

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        backgroundColor: '#1A1A1A',
        opacity,
        transition: `opacity ${active ? '0.8s' : '0.6s'} ease-in-out`,
        pointerEvents: active ? 'all' : 'none',
      }}
    />
  )
}
```

- [ ] **Step 4: Create `components/SceneManager.tsx`**

```tsx
'use client'
import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import ChapterTransition from './ChapterTransition'
import ChapterStub from './chapters/ChapterStub'

const Chapter1 = dynamic(() => import('./chapters/Chapter1'), { ssr: false })

export default function SceneManager() {
  const [currentChapter, setCurrentChapter] = useState(1)
  const [transitioning, setTransitioning] = useState(false)
  const [pendingChapter, setPendingChapter] = useState<number | null>(null)

  const advanceChapter = useCallback((to: number) => {
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

  return (
    <div style={{ width: '100vw', height: '100dvh', overflow: 'hidden', position: 'relative' }}>
      {currentChapter === 1 && (
        <div data-testid="chapter-1" style={{ width: '100%', height: '100%' }}>
          <Chapter1 onComplete={() => advanceChapter(2)} />
        </div>
      )}
      {currentChapter !== 1 && (
        <div data-testid={`chapter-stub-${currentChapter}`} style={{ width: '100%', height: '100%' }}>
          <ChapterStub
            chapterNumber={currentChapter}
            onBack={() => advanceChapter(1)}
          />
        </div>
      )}
      <ChapterTransition
        active={transitioning}
        onMidpoint={handleMidpoint}
        onDone={handleTransitionDone}
      />
    </div>
  )
}
```

- [ ] **Step 5: Create `components/chapters/ChapterStub.tsx`** (needed for import)

```tsx
interface Props {
  chapterNumber: number
  onBack: () => void
}

const chapterTitles: Record<number, string> = {
  2: 'How This Even Started',
  3: 'The Night That Almost Didn\'t Happen',
  4: 'The Fun Part',
  5: 'The Speedrun',
  6: 'The Glitch',
  7: 'What I Learned',
  8: 'Explore the City',
  9: 'No Script',
}

const stubGradients: Record<number, string> = {
  2: 'linear-gradient(135deg, #FFD3B6 0%, #CFFFE5 100%)',
  3: 'linear-gradient(135deg, #1A1A2E 0%, #2D1B4E 100%)',
  4: 'linear-gradient(135deg, #FFD3B6 0%, #FFE4B6 100%)',
  5: 'linear-gradient(135deg, #4A4A4A 0%, #1A1A1A 100%)',
  6: 'linear-gradient(135deg, #A8A8C8 0%, #E6E6FA 100%)',
  7: 'linear-gradient(135deg, #FAFAFA 0%, #E0E0E0 100%)',
  8: 'linear-gradient(135deg, #A8D8EA 0%, #E6E6FA 100%)',
  9: 'linear-gradient(135deg, #1A1A2E 0%, #4A4A6A 100%)',
}

export default function ChapterStub({ chapterNumber, onBack }: Props) {
  const title = chapterTitles[chapterNumber] ?? `Chapter ${chapterNumber}`
  const bg = stubGradients[chapterNumber] ?? 'linear-gradient(135deg, #FAFAFA 0%, #E0E0E0 100%)'
  const dark = chapterNumber === 3 || chapterNumber === 5 || chapterNumber === 9

  return (
    <div
      data-testid={`chapter-stub-${chapterNumber}`}
      style={{
        width: '100%', height: '100%', background: bg,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '24px',
      }}
    >
      <p style={{ fontFamily: 'sans-serif', fontSize: '12px', letterSpacing: '0.15em',
        textTransform: 'uppercase', color: dark ? 'rgba(255,255,255,0.5)' : '#888' }}>
        Chapter {chapterNumber}
      </p>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
        color: dark ? '#FAFAFA' : '#1A1A1A', textAlign: 'center', maxWidth: '600px',
        lineHeight: 1.3, padding: '0 24px' }}>
        {title}
      </h2>
      <p style={{ fontFamily: 'sans-serif', fontSize: '13px',
        color: dark ? 'rgba(255,255,255,0.4)' : '#aaa' }}>
        coming soon
      </p>
      <button
        onClick={onBack}
        style={{
          marginTop: '16px', background: 'transparent', border: 'none', cursor: 'pointer',
          fontFamily: 'sans-serif', fontSize: '13px',
          color: dark ? 'rgba(255,255,255,0.6)' : '#666',
          textDecoration: 'underline', textUnderlineOffset: '3px',
        }}
      >
        ← Back to Chapter 1
      </button>
    </div>
  )
}
```

- [ ] **Step 6: Create stub `components/chapters/Chapter1/index.tsx`** (enough to satisfy import)

```tsx
'use client'
interface Props { onComplete: () => void }
export default function Chapter1({ onComplete }: Props) {
  return (
    <div data-testid="chapter-1" style={{ width: '100%', height: '100%', background: '#A8D8EA' }}>
      <button onClick={onComplete}>Chapter 1 stub</button>
    </div>
  )
}
```

- [ ] **Step 7: Run tests — should pass**

```bash
npm test -- SceneManager
```
Expected: 2 tests pass.

- [ ] **Step 8: Commit**

```bash
git add components/SceneManager.tsx components/ChapterTransition.tsx components/chapters/ChapterStub.tsx components/chapters/Chapter1/index.tsx __tests__/SceneManager.test.tsx
git commit -m "feat: SceneManager, ChapterTransition, ChapterStub"
```

---

## Task 5: Background Component

**Files:**
- Create: `components/chapters/Chapter1/Background.tsx`
- Create: `components/chapters/Chapter1/Background.module.css`

The background has 4 active layers (clouds deferred — assets not yet generated):
1. Sky — wide PNG panning left
2. Mountains — slow lateral sway
3. City buildings — 5-frame swap + lateral drift
4. Foreground bushes — 5-frame wind cycle

Plus 5 pure-CSS wind streaks.

- [ ] **Step 1: Create `Background.module.css`**

```css
/* Sky pans right-to-left over 60s */
@keyframes skyPan {
  from { transform: translateX(0); }
  to   { transform: translateX(-25%); }
}

/* Mountains gentle sway */
@keyframes mountainsSway {
  0%, 100% { transform: translateX(0); }
  50%       { transform: translateX(4px); }
}

/* City buildings slow drift */
@keyframes cityDrift {
  0%, 100% { transform: translateX(0); }
  50%       { transform: translateX(-8px); }
}

/* Wind streak sweep */
@keyframes windSweep {
  from { transform: translateX(-200px); }
  to   { transform: translateX(110vw); }
}

.scene {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.sky {
  position: absolute;
  top: 0; left: 0;
  width: 200%;
  height: 65%;
  object-fit: cover;
  object-position: top left;
  animation: skyPan 60s linear infinite;
}

.mountains {
  position: absolute;
  bottom: 28%;
  left: 0; right: 0;
  width: 100%;
  animation: mountainsSway 8s ease-in-out infinite;
}

.city {
  position: absolute;
  bottom: 26%;
  left: 0; right: 0;
  width: 100%;
  animation: cityDrift 25s ease-in-out infinite;
}

.foreground {
  position: absolute;
  bottom: 0;
  left: 0; right: 0;
  width: 100%;
}

.windStreak {
  position: absolute;
  height: 1px;
  width: 110px;
  background: white;
  opacity: 0.07;
  animation: windSweep 2.2s linear;
  animation-iteration-count: infinite;
}
```

- [ ] **Step 2: Create `Background.tsx`**

```tsx
'use client'
import { useState, useEffect } from 'react'
import styles from './Background.module.css'

const CITY_FRAMES = 5
const FOREGROUND_FRAMES = 5
const CITY_FRAME_MS = 400
const FOREGROUND_FRAME_MS = 800

const windDelays = ['0s', '2.1s', '4.4s', '6.8s', '9.3s']
const windTops = ['18%', '32%', '24%', '40%', '28%']

export default function Background() {
  const [cityFrame, setCityFrame] = useState(1)
  const [fgFrame, setFgFrame] = useState(1)

  useEffect(() => {
    const id = setInterval(() => setCityFrame(f => (f % CITY_FRAMES) + 1), CITY_FRAME_MS)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setInterval(() => setFgFrame(f => (f % FOREGROUND_FRAMES) + 1), FOREGROUND_FRAME_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <div className={styles.scene}>
      {/* Layer 1: Sky */}
      <img
        className={styles.sky}
        src="/chapter1/backgrounds/sky/frame1.png"
        alt=""
        draggable={false}
      />

      {/* Layer 3: Mountains */}
      <img
        className={styles.mountains}
        src="/chapter1/backgrounds/mountains/frame1.png"
        alt=""
        draggable={false}
      />

      {/* Layer 4: City buildings (frame cycling + CSS drift) */}
      <img
        key={cityFrame}
        className={styles.city}
        src={`/chapter1/backgrounds/city_buildings/frame${cityFrame}.png`}
        alt=""
        draggable={false}
      />

      {/* Layer 5: Foreground bushes (frame cycling) */}
      <img
        key={`fg-${fgFrame}`}
        className={styles.foreground}
        src={`/chapter1/backgrounds/foreground_bushes/frame${fgFrame}.png`}
        alt=""
        draggable={false}
      />

      {/* Wind streaks (CSS only) */}
      {windDelays.map((delay, i) => (
        <div
          key={i}
          className={styles.windStreak}
          style={{ top: windTops[i], animationDelay: delay }}
        />
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Verify visually**

In `components/chapters/Chapter1/index.tsx`, temporarily render just `<Background />`:
```tsx
'use client'
import Background from './Background'
interface Props { onComplete: () => void }
export default function Chapter1({ onComplete }: Props) {
  return (
    <div data-testid="chapter-1" style={{ width: '100%', height: '100%', position: 'relative', background: '#A8D8EA' }}>
      <Background />
      <button onClick={onComplete} style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 10 }}>next</button>
    </div>
  )
}
```

Open http://localhost:3000 — sky should pan, mountains sway, city drift, foreground cycle, wind streaks sweep.

- [ ] **Step 4: Commit**

```bash
git add components/chapters/Chapter1/Background.tsx components/chapters/Chapter1/Background.module.css components/chapters/Chapter1/index.tsx
git commit -m "feat: Chapter1 Background — 4 CSS-animated layers + wind streaks"
```

---

## Task 6: SpriteAnimation + Characters

**Files:**
- Create: `components/chapters/Chapter1/SpriteAnimation.tsx`
- Create: `components/chapters/Chapter1/Characters.tsx`
- Create: `components/chapters/Chapter1/Characters.module.css`

- [ ] **Step 1: Create `SpriteAnimation.tsx`**

```tsx
'use client'
import { useState, useEffect, useRef } from 'react'

interface Props {
  frames: string[]
  frameInterval: number
  alt?: string
  style?: React.CSSProperties
}

export default function SpriteAnimation({ frames, frameInterval, alt = '', style }: Props) {
  const [frameIndex, setFrameIndex] = useState(0)
  const framesRef = useRef(frames)
  framesRef.current = frames

  useEffect(() => {
    setFrameIndex(0)
    if (frames.length <= 1) return
    const id = setInterval(
      () => setFrameIndex(i => (i + 1) % framesRef.current.length),
      frameInterval
    )
    return () => clearInterval(id)
  }, [frames, frameInterval])

  return <img src={frames[frameIndex]} alt={alt} draggable={false} style={style} />
}
```

- [ ] **Step 2: Create `Characters.module.css`**

```css
@keyframes poseEnter {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

.character {
  position: absolute;
  bottom: 18%;
  height: 38vh;
  width: auto;
  animation: poseEnter 0.4s ease-out forwards;
}

.nick {
  left: 10%;
}

.judy {
  right: 10%;
}
```

- [ ] **Step 3: Create `Characters.tsx`**

```tsx
'use client'
import styles from './Characters.module.css'
import SpriteAnimation from './SpriteAnimation'
import { nickPoseConfigs, judyPoseConfigs } from './chapter1-poses'
import type { NickPose, JudyPose } from './types'

interface Props {
  nickPose: NickPose
  judyPose: JudyPose
}

export default function Characters({ nickPose, judyPose }: Props) {
  const nickCfg = nickPoseConfigs[nickPose]
  const judyCfg = judyPoseConfigs[judyPose]

  return (
    <>
      <SpriteAnimation
        key={`nick-${nickPose}`}
        frames={nickCfg.frames}
        frameInterval={nickCfg.frameInterval}
        alt="Nick"
        style={{ position: 'absolute', bottom: '18%', left: '10%', height: '38vh', width: 'auto' }}
      />
      <SpriteAnimation
        key={`judy-${judyPose}`}
        frames={judyCfg.frames}
        frameInterval={judyCfg.frameInterval}
        alt="Judy"
        style={{ position: 'absolute', bottom: '18%', right: '10%', height: '38vh', width: 'auto' }}
      />
    </>
  )
}
```

Note: using `key={nick-${nickPose}}` causes React to unmount and remount SpriteAnimation whenever the pose changes. The `poseEnter` CSS animation on the `<img>` via the parent style triggers the 0.4s fade-in automatically.

- [ ] **Step 4: Wire Characters into Chapter1 stub for visual check**

Update `components/chapters/Chapter1/index.tsx`:
```tsx
'use client'
import Background from './Background'
import Characters from './Characters'
interface Props { onComplete: () => void }
export default function Chapter1({ onComplete }: Props) {
  return (
    <div data-testid="chapter-1" style={{ width: '100%', height: '100%', position: 'relative', background: '#A8D8EA' }}>
      <Background />
      <Characters nickPose="neutral_idle" judyPose="neutral_idle" />
      <button onClick={onComplete} style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 10 }}>next</button>
    </div>
  )
}
```

Open http://localhost:3000 — Nick and Judy should be visible, frame-cycling idle animations.

- [ ] **Step 5: Commit**

```bash
git add components/chapters/Chapter1/SpriteAnimation.tsx components/chapters/Chapter1/Characters.tsx components/chapters/Chapter1/Characters.module.css components/chapters/Chapter1/index.tsx
git commit -m "feat: SpriteAnimation + Characters with pose-change fadeIn"
```

---

## Task 7: DialogueBox

**Files:**
- Create: `components/chapters/Chapter1/DialogueBox.tsx`
- Create: `components/chapters/Chapter1/DialogueBox.module.css`
- Test: `__tests__/DialogueBox.test.tsx`

- [ ] **Step 1: Write failing tests**

```tsx
// __tests__/DialogueBox.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DialogueBox from '../components/chapters/Chapter1/DialogueBox'
import { beats } from '../components/chapters/Chapter1/chapter1-beats'

test('renders dialogue text for a normal beat', () => {
  render(<DialogueBox beat={beats[1]} beatIndex={1} onAdvance={vi.fn()} onComplete={vi.fn()} />)
  expect(screen.getByText('Some cities are planned.')).toBeInTheDocument()
})

test('calls onAdvance when tapping scene wrapper', async () => {
  const onAdvance = vi.fn()
  render(<DialogueBox beat={beats[1]} beatIndex={1} onAdvance={onAdvance} onComplete={vi.fn()} />)
  await userEvent.click(screen.getByTestId('scene-tap-target'))
  expect(onAdvance).toHaveBeenCalledOnce()
})

test('does NOT call onAdvance when CTA beat — calls onComplete on button click', async () => {
  const onAdvance = vi.fn()
  const onComplete = vi.fn()
  render(<DialogueBox beat={beats[7]} beatIndex={7} onAdvance={onAdvance} onComplete={onComplete} />)
  await userEvent.click(screen.getByRole('button', { name: /explore/i }))
  expect(onAdvance).not.toHaveBeenCalled()
  expect(onComplete).toHaveBeenCalledOnce()
})

test('shows 7 progress dots for beats 1–7', () => {
  render(<DialogueBox beat={beats[3]} beatIndex={3} onAdvance={vi.fn()} onComplete={vi.fn()} />)
  expect(screen.getAllByTestId('beat-dot')).toHaveLength(7)
})
```

- [ ] **Step 2: Run to confirm fail**

```bash
npm test -- DialogueBox
```
Expected: FAIL — DialogueBox not found.

- [ ] **Step 3: Create `DialogueBox.module.css`**

```css
@keyframes textFadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.tapTarget {
  position: absolute;
  inset: 0;
  z-index: 10;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.box {
  position: absolute;
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%);
  width: min(70%, 560px);
  background: rgba(250, 250, 250, 0.88);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-radius: 16px;
  padding: 20px 24px 16px;
  text-align: center;
  pointer-events: none;
  z-index: 20;
}

.text {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(1rem, 2.5vw, 1.4rem);
  color: #1A1A1A;
  line-height: 1.6;
  letter-spacing: 0.01em;
  animation: textFadeIn 0.6s ease-out forwards;
}

.dots {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 14px;
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  transition: background 0.3s;
}

.dotPast    { background: #A8D8EA; }
.dotCurrent { background: #1A1A1A; width: 9px; height: 9px; }
.dotFuture  { background: #E0E0E0; }

.ctaButton {
  margin-top: 4px;
  background: #1A1A1A;
  color: #FAFAFA;
  border: none;
  border-radius: 24px;
  padding: 10px 28px;
  font-family: sans-serif;
  font-size: 0.95rem;
  cursor: pointer;
  pointer-events: all;
  transition: opacity 0.2s;
}

.ctaButton:hover { opacity: 0.8; }
```

- [ ] **Step 4: Create `DialogueBox.tsx`**

```tsx
'use client'
import styles from './DialogueBox.module.css'
import type { Beat } from './types'
import { CTA_BEAT } from './chapter1-beats'

interface Props {
  beat: Beat
  beatIndex: number
  onAdvance: () => void
  onComplete: () => void
}

export default function DialogueBox({ beat, beatIndex, onAdvance, onComplete }: Props) {
  const isCTA = beatIndex === CTA_BEAT

  const handleTap = () => {
    if (!isCTA) onAdvance()
  }

  return (
    <>
      {/* Full-scene tap target — invisible, covers everything except the CTA button */}
      <div
        data-testid="scene-tap-target"
        className={styles.tapTarget}
        onClick={handleTap}
        aria-label="Tap to continue"
      />

      {/* Dialogue / CTA box */}
      <div className={styles.box}>
        {!isCTA && beat.text && (
          <p key={beat.text} className={styles.text}>{beat.text}</p>
        )}

        {isCTA && (
          <button className={styles.ctaButton} onClick={onComplete}>
            {beat.cta}
          </button>
        )}

        {/* Progress dots for beats 1–7 */}
        <div className={styles.dots}>
          {Array.from({ length: 7 }, (_, i) => {
            const dotBeat = i + 1
            const state =
              dotBeat < beatIndex ? 'dotPast' :
              dotBeat === beatIndex ? 'dotCurrent' : 'dotFuture'
            return (
              <div
                key={dotBeat}
                data-testid="beat-dot"
                className={`${styles.dot} ${styles[state]}`}
              />
            )
          })}
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 5: Run tests — all should pass**

```bash
npm test -- DialogueBox
```
Expected: 4 tests pass.

- [ ] **Step 6: Commit**

```bash
git add components/chapters/Chapter1/DialogueBox.tsx components/chapters/Chapter1/DialogueBox.module.css __tests__/DialogueBox.test.tsx
git commit -m "feat: DialogueBox — tap-to-advance, progress dots, CTA"
```

---

## Task 8: NavigationHint

**Files:**
- Create: `components/chapters/Chapter1/NavigationHint.tsx`
- Create: `components/chapters/Chapter1/NavigationHint.module.css`

- [ ] **Step 1: Create `NavigationHint.module.css`**

```css
@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50%       { opacity: 1; }
}

@keyframes hintFadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.hint {
  position: absolute;
  bottom: calc(5% + 120px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  pointer-events: none;
  font-family: sans-serif;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #4A4A4A;
  animation: pulse 2s ease-in-out infinite, hintFadeIn 0.8s ease-out forwards;
}
```

- [ ] **Step 2: Create `NavigationHint.tsx`**

```tsx
import styles from './NavigationHint.module.css'

interface Props {
  label: string  // e.g. "Tap to begin ↓" or "Tap to continue"
}

export default function NavigationHint({ label }: Props) {
  return (
    <p key={label} className={styles.hint}>
      {label}
    </p>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/chapters/Chapter1/NavigationHint.tsx components/chapters/Chapter1/NavigationHint.module.css
git commit -m "feat: NavigationHint pulsing label"
```

---

## Task 9: Chapter1 Assembly + Asset Prefetch

**Files:**
- Modify: `components/chapters/Chapter1/index.tsx` (replace stub with full implementation)

- [ ] **Step 1: Write the full `components/chapters/Chapter1/index.tsx`**

```tsx
'use client'
import { useState, useEffect, useCallback } from 'react'
import Background from './Background'
import Characters from './Characters'
import DialogueBox from './DialogueBox'
import NavigationHint from './NavigationHint'
import { beats, INTRO_BEAT, CTA_BEAT, MAX_BEAT } from './chapter1-beats'
import { nickPoseConfigs, judyPoseConfigs } from './chapter1-poses'

interface Props {
  onComplete: () => void
}

function prefetchAssets() {
  const allFrames = [
    ...Object.values(nickPoseConfigs).flatMap(c => c.frames),
    ...Object.values(judyPoseConfigs).flatMap(c => c.frames),
  ]
  allFrames.forEach(src => { const img = new Image(); img.src = src })
}

export default function Chapter1({ onComplete }: Props) {
  const [currentBeat, setCurrentBeat] = useState(INTRO_BEAT)
  const [showHint, setShowHint] = useState(false)

  // Show "tap to begin" after 2s on beat 0
  useEffect(() => {
    if (currentBeat !== INTRO_BEAT) return
    const id = setTimeout(() => setShowHint(true), 2000)
    return () => clearTimeout(id)
  }, [currentBeat])

  // Prefetch remaining frames after first paint
  useEffect(() => {
    const id = setTimeout(prefetchAssets, 500)
    return () => clearTimeout(id)
  }, [])

  const handleAdvance = useCallback(() => {
    setCurrentBeat(b => {
      if (b >= MAX_BEAT) return b
      const next = b + 1
      if (next > INTRO_BEAT) setShowHint(false)
      return next
    })
  }, [])

  const beat = beats[currentBeat]
  const hintLabel = currentBeat === INTRO_BEAT ? 'Tap to begin ↓' : 'Tap to continue'

  return (
    <div
      data-testid="chapter-1"
      style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}
    >
      <Background />
      <Characters nickPose={beat.nickPose} judyPose={beat.judyPose} />

      {currentBeat > INTRO_BEAT && currentBeat < CTA_BEAT && (
        <DialogueBox
          beat={beat}
          beatIndex={currentBeat}
          onAdvance={handleAdvance}
          onComplete={onComplete}
        />
      )}

      {currentBeat === INTRO_BEAT && (
        /* Tap target for intro beat */
        <div
          onClick={handleAdvance}
          style={{ position: 'absolute', inset: 0, zIndex: 10, cursor: 'pointer' }}
          data-testid="scene-tap-target"
        />
      )}

      {currentBeat === CTA_BEAT && (
        <DialogueBox
          beat={beat}
          beatIndex={currentBeat}
          onAdvance={handleAdvance}
          onComplete={onComplete}
        />
      )}

      {showHint && <NavigationHint label={hintLabel} />}
    </div>
  )
}
```

- [ ] **Step 2: Verify full Chapter 1 flow in browser**

Open http://localhost:3000. Confirm:
- [ ] Background layers animate on load
- [ ] Nick and Judy appear in neutral_idle poses
- [ ] "Tap to begin ↓" appears after 2 seconds
- [ ] Tapping shows beat 1 text + Nick presenting + Judy neutral
- [ ] Each subsequent tap advances the beat and swaps poses
- [ ] Beat progress dots update correctly
- [ ] Beat 7 shows "Let's explore →" button
- [ ] Clicking "Let's explore →" fades to black then shows Chapter 2 stub
- [ ] "← Back to Chapter 1" on stub returns to Chapter 1

- [ ] **Step 3: Run all tests**

```bash
npm test
```
Expected: all 15 tests pass.

- [ ] **Step 4: Commit**

```bash
git add components/chapters/Chapter1/index.tsx
git commit -m "feat: Chapter1 full assembly — beat flow, prefetch, NavigationHint"
```

---

## Task 10: App Layout + Page Wiring

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`
- Modify: `next.config.ts`

- [ ] **Step 1: Update `app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Zootopia: A City of Many Flavors',
  description: 'An interactive story.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body style={{ margin: 0, padding: 0, overflow: 'hidden', width: '100vw', height: '100dvh' }}>
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Update `app/page.tsx`**

```tsx
import SceneManager from '@/components/SceneManager'

export default function Home() {
  return <SceneManager />
}
```

- [ ] **Step 3: Verify `next.config.ts`** — default config is fine; confirm it looks like:

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {}

export default nextConfig
```

- [ ] **Step 4: Final test run**

```bash
npm test
```
Expected: all tests pass, zero errors.

- [ ] **Step 5: Build check**

```bash
npm run build
```
Expected: build succeeds, no TypeScript errors. If any TS errors appear, fix them before proceeding.

- [ ] **Step 6: Commit**

```bash
git add app/layout.tsx app/page.tsx next.config.ts
git commit -m "feat: app layout + page wiring — site is complete"
```

---

## Task 11: Vercel Deploy

- [ ] **Step 1: Install Vercel CLI**

```bash
npm install -D vercel
```

- [ ] **Step 2: Deploy to preview**

```bash
npx vercel
```
Follow prompts: link to your Vercel account, create new project, accept defaults. When asked "Which directory is your code located?", choose `./`. Expected: preview URL printed.

- [ ] **Step 3: Open preview URL in browser**

Verify:
- [ ] Background animates
- [ ] Characters appear and animate
- [ ] Tap/click advances beats
- [ ] CTA transitions to Chapter 2 stub
- [ ] Back button returns to Chapter 1

- [ ] **Step 4: Deploy to production**

```bash
npx vercel --prod
```
Expected: production URL (e.g. `your-project.vercel.app`) printed. Share this URL.

- [ ] **Step 5: Final commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add Vercel CLI"
```

---

## Self-Review Notes

**Spec coverage:**
- ✅ Single-page Scene Manager (Task 4)
- ✅ Hybrid navigation — tap within chapter, CTA between (Tasks 7–9)
- ✅ 5 CSS-animated background layers — clouds deferred (Task 5)
- ✅ Sprite animation with frame cycling + pose crossfade (Task 6)
- ✅ 8-beat data (beat 0 intro, beats 1–6 dialogue, beat 7 CTA) (Task 3)
- ✅ "Tap to begin ↓" after 2s on beat 0 (Task 9)
- ✅ Beat progress dots, beat 1–7 (Task 7)
- ✅ Asset prefetch after mount (Task 9)
- ✅ ChapterTransition full-screen black fade 0.8s in + 0.6s out (Task 4)
- ✅ ChapterStub chapters 2–9 with back button (Task 4)
- ✅ Asset migration from chapter1/animations/ to public/ (Task 2)
- ✅ Vercel deploy (Task 11)
- ✅ Design system colors used in stubs and dialogue box
- ✅ Georgia serif for dialogue text (DialogueBox.module.css)

**Out of scope confirmed:** audio, cloud layer, deep mobile optimisation, hash routing, analytics.
