# Chapter 4 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Chapter 4 ("The Fun Part") as a React component with Ch5-style step navigation, typing reveal, and video background crossfades.

**Architecture:** 18 beats in a CSS grid (all `grid-area: 1/1`), one beat visible at a time. Wheel/touch/key events advance `goTo(i)`. Typing engine retypes text on each show; CSS-reveal beats (chat bubbles, food pop, laugh bloom) use class-toggled keyframes instead. Four background videos crossfade on zone changes keyed to beat index.

**Tech Stack:** React 18, TypeScript, CSS custom properties, Intersection-free IntersectionObserver-free vanilla DOM in `useEffect`. No extra deps.

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Create | `public/chapter4/*.mp4` + `*.png` | Static assets served by Next.js |
| Create | `components/chapters/Chapter4/chapter4.css` | All Ch4 styles, `ch4-` prefix |
| Create | `components/chapters/Chapter4/index.tsx` | React component + all logic |
| Modify | `components/SceneManager.tsx` | Import + render Chapter4 |

---

## Task 1: Copy assets to `public/chapter4/`

**Files:** Create `public/chapter4/` with 8 files from `chapter4/backgrounds/`

- [ ] **Step 1: Create folder and copy**

```bash
mkdir public/chapter4
cp chapter4/backgrounds/bg_night_room.mp4      public/chapter4/
cp chapter4/backgrounds/bg_night_room.png      public/chapter4/
cp chapter4/backgrounds/bg_tree_path.mp4       public/chapter4/
cp chapter4/backgrounds/bg_tree_path.png       public/chapter4/
cp chapter4/backgrounds/bg_shelter.mp4         public/chapter4/
cp chapter4/backgrounds/bg_shelter.png         public/chapter4/
cp chapter4/backgrounds/bg_restaurant_table.mp4 public/chapter4/
cp chapter4/backgrounds/bg_restaurant_table.png public/chapter4/
```

- [ ] **Step 2: Verify**

```bash
ls public/chapter4/
# Expected: 8 files — 4x .mp4 and 4x .png
```

- [ ] **Step 3: Commit**

```bash
git add public/chapter4/
git commit -m "feat(ch4): copy background assets to public/"
```

---

## Task 2: Create `chapter4.css`

**Files:** Create `components/chapters/Chapter4/chapter4.css`

- [ ] **Step 1: Write the file**

```css
/* ── Chapter 4 — "The Fun Part" ── */

.ch4-root {
  position: relative;
  width: 100%; height: 100%;
  overflow: hidden;
  font-family: 'Poppins', sans-serif;
  color: #FAF7F2;
}

/* ── Background gradient engine ── */
.ch4-bg-wash {
  position: fixed; inset: 0; z-index: 0;
  transition: background 2.2s ease-in-out;
  background: linear-gradient(180deg, #1A1F3A 0%, #2A1F2E 60%, #1A1520 100%);
}
.ch4-root[data-zone="1"] .ch4-bg-wash { background: linear-gradient(180deg, #1E2440 0%, #2E2444 60%, #1A1828 100%); }
.ch4-root[data-zone="2"] .ch4-bg-wash { background: linear-gradient(160deg, #1A1C30 0%, #232040 60%, #141220 100%); }
.ch4-root[data-zone="3"] .ch4-bg-wash {
  background: radial-gradient(ellipse 80% 60% at 50% 40%, rgba(255,160,50,0.14) 0%, transparent 70%),
              linear-gradient(180deg, #1A1828 0%, #1E1520 100%);
}
.ch4-root[data-zone="4"] .ch4-bg-wash { background: linear-gradient(160deg, #FFF3E0 0%, #FFE4C8 50%, #FFCCB0 100%); }
.ch4-root[data-zone="5"] .ch4-bg-wash { background: linear-gradient(160deg, #FFBFA0 0%, #FFD3B6 50%, #FFB880 100%); }
.ch4-root[data-zone="6"] .ch4-bg-wash { background: linear-gradient(160deg, #FFD3B6 0%, #F4EEFF 50%, #FFD3B6 100%); }

/* ── Background videos ── */
.ch4-bg-video {
  position: fixed; inset: 0; z-index: 0;
  width: 100%; height: 100%; object-fit: cover;
  opacity: 0; transition: opacity 1.8s ease-in-out;
  pointer-events: none;
}
.ch4-bg-video.ch4-on { opacity: 1; }

/* ── Phone glow ── */
.ch4-phone-glow {
  position: fixed; inset: 0; z-index: 1; pointer-events: none;
  background: radial-gradient(ellipse 36% 28% at 50% 62%, rgba(255,195,100,0.18) 0%, transparent 70%);
  opacity: 0; transition: opacity 1.2s ease;
  animation: ch4GlowPulse 4s ease-in-out infinite;
}
.ch4-phone-glow.ch4-on { opacity: 1; }
@keyframes ch4GlowPulse {
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.06); }
}

/* ── Warm glow (Scene C) ── */
.ch4-warm-glow {
  position: fixed; inset: 0; z-index: 1; pointer-events: none;
  background: radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255,160,80,0.22) 0%, transparent 70%);
  opacity: 0; transition: opacity 1.5s ease;
}
.ch4-warm-glow.ch4-on { opacity: 0.28; }

/* ── Doodle layer ── */
.ch4-doodle-layer { position: fixed; inset: 0; z-index: 1; pointer-events: none; overflow: hidden; }
.ch4-dk { position: absolute; opacity: 0; transition: opacity 1.5s ease; font-style: normal; }
.ch4-dk.ch4-on { opacity: 1; }
.ch4-dk-arr   { top: 8%;  left: 12%;  font-size: 11px; color: rgba(255,179,71,.22);  animation: ch4DkA 7s ease-in-out infinite alternate; }
.ch4-dk-sp    { top: 14%; right: 9%;  font-size: 17px; color: rgba(180,160,230,.25); animation: ch4DkB 5s ease-in-out infinite; }
.ch4-dk-leaf  { top: 55%; right: 7%;  font-size: 19px; color: rgba(160,200,130,.22); animation: ch4DkC 9s ease-in-out infinite alternate; }
.ch4-dk-heart { top: 72%; left: 7%;   font-size: 15px; color: rgba(240,180,180,.2);  animation: ch4DkD 6s ease-in-out infinite alternate; }
.ch4-dk-ramen { top: 40%; right: 5%;  font-size: 20px; color: rgba(255,180,100,.2);  animation: ch4DkE 8s ease-in-out infinite alternate; }
@keyframes ch4DkA { from { transform: translate(0,0); }          to { transform: translate(-6px,-5px); } }
@keyframes ch4DkB { 0%,100% { transform: scale(.9);  opacity: .2; } 50% { transform: scale(1.05); opacity: .45; } }
@keyframes ch4DkC { from { transform: translateY(0) rotate(0); }    to { transform: translateY(-10px) rotate(8deg); } }
@keyframes ch4DkD { from { transform: translateY(0) rotate(-5deg); } to { transform: translateY(-14px) rotate(3deg); } }
@keyframes ch4DkE { from { transform: translateY(0); }              to { transform: translateY(-8px); } }

/* ── Scroll layer — all beats share grid cell 1/1 ── */
.ch4-scroll {
  position: fixed; inset: 0; z-index: 10;
  display: grid; place-items: center;
  pointer-events: none;
}

/* ── Beat base ── */
.ch4-beat {
  grid-area: 1 / 1;
  width: 100%; max-width: 620px;
  padding: 22px 32px; text-align: center;
  opacity: 0; transform: translateY(24px);
  transition: opacity 0.85s cubic-bezier(.22,.61,.36,1),
              transform 0.85s cubic-bezier(.22,.61,.36,1);
}
.ch4-beat.ch4-on { opacity: 1; transform: none; }
.ch4-beat-rel { position: relative; }

/* Scene C — slower reveal */
#ch4-b14, #ch4-b15, #ch4-b16, #ch4-b17, #ch4-b18 { transition-duration: 1.1s; }

/* ── Staggered children ── */
.ch4-beat [data-d] {
  opacity: 0; transform: translateY(14px);
  transition: opacity 0.75s cubic-bezier(.22,.61,.36,1),
              transform 0.75s cubic-bezier(.22,.61,.36,1);
}
.ch4-beat [data-d].ch4-on { opacity: 1; transform: none; }

/* ── Typography ── */
.ch4-t-main  { font-size: clamp(20px,2.6vw,30px); font-weight: 600; line-height: 1.55; margin: 0; }
.ch4-t-line  { font-size: clamp(18px,2.2vw,26px); font-weight: 400; line-height: 1.65; margin: 0; }
.ch4-t-aside { font-size: clamp(14px,1.7vw,19px); font-weight: 400; font-style: italic; line-height: 1.7; margin: 0; }
.ch4-t-tiny  { font-size: clamp(13px,1.5vw,16px); font-style: italic; margin: 0; }
.ch4-t-med   { font-size: clamp(18px,2.2vw,26px); font-weight: 500; line-height: 1.6; margin: 0; }
.ch4-t-shelt { font-size: clamp(22px,2.9vw,36px); font-weight: 600; line-height: 1.5; letter-spacing: .01em; margin: 0; }
.ch4-t-emoji { font-size: clamp(36px,5.5vw,60px); display: block; margin-bottom: 6px; }
.ch4-t-laugh { font-size: clamp(34px,4.2vw,54px); font-weight: 700; color: #D4756B; margin: 0; }
.ch4-t-smile { font-size: clamp(22px,2.8vw,34px); font-weight: 500; margin: 0; }
.ch4-t-coddl { font-size: clamp(20px,2.4vw,30px); font-weight: 400; font-style: italic; margin: 0; }
.ch4-t-eyes  { font-size: clamp(18px,2.2vw,26px); font-weight: 400; color: #9A9098; line-height: 1.7; margin: 0; }
.ch4-t-small { font-size: clamp(15px,1.8vw,20px); margin: 0; }
.ch4-lt { color: #3A2420 !important; }

/* Text glow for dark backgrounds */
#ch4-b1 p, #ch4-b2 p, #ch4-b3 p, #ch4-b4 p, #ch4-b5 p,
#ch4-b7 p, #ch4-b8 p, #ch4-b9 p, #ch4-b10 p,
#ch4-b15 p, #ch4-b16 p, #ch4-b17 p {
  text-shadow: 0 0 18px rgba(255,255,255,.55), 0 0 8px rgba(255,255,255,.35), 0 1px 3px rgba(255,255,255,.25);
}

/* ── Chat bubbles (beat 2) ── */
.ch4-chat-wrap { display: flex; flex-direction: column; gap: 14px; }
.ch4-bbl {
  display: inline-block; padding: 11px 20px; border-radius: 22px;
  font-size: clamp(18px,2.2vw,26px); font-weight: 500; max-width: 72%;
  border: 1.5px solid rgba(255,255,255,.22); background: rgba(255,255,255,.07);
  backdrop-filter: blur(6px); opacity: 0;
}
.ch4-bbl-l { align-self: flex-start; }
.ch4-bbl-r { align-self: flex-end; }
.ch4-beat.ch4-on .ch4-bbl-l { animation: ch4BblL 0.7s ease-out forwards; }
.ch4-beat.ch4-on .ch4-bbl-r { animation: ch4BblR 0.7s ease-out 0.2s forwards; }
@keyframes ch4BblL { from { opacity:0; transform:translateX(-28px); } to { opacity:1; transform:none; } }
@keyframes ch4BblR { from { opacity:0; transform:translateX( 28px); } to { opacity:1; transform:none; } }

/* ── Stars window (beat 4) ── */
.ch4-stars-win {
  width: 110px; height: 72px; margin: 24px auto 0;
  border: 1.5px solid rgba(255,255,255,.14); border-radius: 4px;
  background: #080B18; position: relative; overflow: hidden;
}
.ch4-star-dot {
  position: absolute; border-radius: 50%; background: #fff;
  animation: ch4Twinkle var(--tw,3s) ease-in-out infinite;
}
@keyframes ch4Twinkle { 0%,100%{opacity:.25} 50%{opacity:1} }

/* ── Leaves box (beat 6) ── */
.ch4-leaves-box {
  border-radius: 14px; overflow: hidden; padding: 44px 24px;
  margin: 0 -4px; position: relative;
  background: linear-gradient(160deg,#0C1A0E 0%,#182814 60%,#0A1008 100%);
}
.ch4-leaves-box::before {
  content: ''; position: absolute; inset: 0;
  background-image: url('/chapter4/bg_tree_path.png');
  background-size: cover; background-position: center; opacity: .65;
}
.ch4-leaves-box > * { position: relative; z-index: 1; }
.ch4-leaf-float { font-size: 38px; display: block; margin: 0 auto 18px; animation: ch4LeafFloat 3.2s ease-in-out infinite; }
@keyframes ch4LeafFloat {
  0%,100% { transform: rotate(-4deg) translateY(0); }
  50%      { transform: rotate(5deg)  translateY(-8px); }
}

/* ── Shelter box (beat 11) ── */
.ch4-shelter-box {
  padding: 64px 24px; margin: 0 -4px; border-radius: 14px;
  position: relative; overflow: hidden;
  background: linear-gradient(160deg,#0E0C18 0%,#1A1428 100%);
}
.ch4-shelter-box::before {
  content: ''; position: absolute; inset: 0;
  background-image: url('/chapter4/bg_shelter.png');
  background-size: cover; background-position: center; opacity: .55;
}
.ch4-shelter-box::after {
  content: ''; position: absolute; inset: 0;
  background: radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,155,40,.14) 0%, transparent 70%);
}
.ch4-shelter-box > * { position: relative; z-index: 1; }

/* ── Food table (beat 12) ── */
.ch4-food-table {
  border-radius: 14px; overflow: hidden; padding: 32px 20px; margin: 0 -4px;
  position: relative; background: linear-gradient(160deg,#FFF8EE 0%,#FFE8C8 100%);
  display: flex; flex-wrap: wrap; gap: 14px; justify-content: center; align-items: flex-end;
}
.ch4-food-em {
  position: relative; z-index: 1; font-size: 52px;
  opacity: 0; transform: scale(.72) translateY(10px);
  transition: opacity .6s ease-out, transform .6s ease-out;
  filter: drop-shadow(0 3px 8px rgba(0,0,0,.15));
}
.ch4-beat.ch4-on .ch4-food-em                    { opacity:1; transform:none; }
.ch4-beat.ch4-on .ch4-food-em:nth-child(2)       { transition-delay: .15s; }
.ch4-beat.ch4-on .ch4-food-em:nth-child(3)       { transition-delay: .30s; }
.ch4-beat.ch4-on .ch4-food-em:nth-child(4)       { transition-delay: .45s; }

/* ── Arrow pair (beat 13) ── */
.ch4-arrow-pair { display: flex; gap: 22px; justify-content: center; font-size: 26px; margin-bottom: 14px; color: rgba(255,179,71,.9); }
.ch4-arr-l { animation: ch4ArrL 1.60s ease-in-out infinite; animation-play-state: paused; }
.ch4-arr-r { animation: ch4ArrR 1.85s ease-in-out infinite; animation-play-state: paused; }
.ch4-beat.ch4-on .ch4-arr-l,
.ch4-beat.ch4-on .ch4-arr-r { animation-play-state: running; }
@keyframes ch4ArrL { 0%,100%{transform:translateX(0) rotate(-4deg);opacity:.6} 35%{transform:translateX(+8px) rotate(-1deg);opacity:1} }
@keyframes ch4ArrR { 0%,100%{transform:translateX(0) rotate( 4deg);opacity:.6} 35%{transform:translateX(-8px) rotate( 1deg);opacity:1} }

/* ── Laugh bloom (beat 14) ── */
@keyframes ch4LaughBloom {
  0%   { opacity:0; transform:scale(.88) translateY(16px); letter-spacing:-.02em; }
  55%  { opacity:1; transform:scale(1.04) translateY(-3px); letter-spacing:.05em; }
  75%  {            transform:scale(1.01) translateY(-1px); letter-spacing:.025em; }
  100% { opacity:1; transform:scale(1)    translateY(0);    letter-spacing:.01em; }
}
.ch4-beat.ch4-on .ch4-t-laugh { animation: ch4LaughBloom 1.1s cubic-bezier(.22,.61,.36,1) forwards; }
.ch4-laugh-bg {
  position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%);
  width: 280px; height: 280px; border-radius: 50%;
  background: radial-gradient(ellipse 70% 70% at 50% 50%, rgba(212,117,107,.2) 0%, rgba(255,190,160,.08) 50%, transparent 80%);
  opacity: 0; transition: opacity .9s .3s ease; pointer-events: none;
}
.ch4-beat.ch4-on .ch4-laugh-bg { opacity: 1; }

/* ── Spark word (beat 18) ── */
.ch4-spark-w { transition: color .8s ease, text-shadow .8s ease; }
.ch4-beat.ch4-on .ch4-spark-w { color: #FFB347; text-shadow: 0 0 14px rgba(255,179,71,.5); }

/* ── Ambient sparkles (beat 18) ── */
.ch4-amb { position: absolute; pointer-events: none; opacity: 0; transition: opacity .8s .6s ease; animation: ch4AmbTwinkle var(--at,2.4s) ease-in-out infinite; }
.ch4-beat.ch4-on .ch4-amb { opacity: 1; }
.ch4-amb-1 { top: -14px; right: 18px; font-size: 11px; color: #E6E6FA; --at: 2.4s; }
.ch4-amb-2 { bottom: -10px; left: 28px; font-size: 9px; color: #FFD3B6; --at: 3.1s; }
@keyframes ch4AmbTwinkle { 0%,100%{opacity:.15;transform:scale(.8)} 50%{opacity:.65;transform:scale(1.1)} }

/* ── JS sparkle particles ── */
@keyframes ch4SparkleFly {
  0%   { opacity:0; transform:translate(0,0) scale(.2) rotate(0deg); }
  25%  { opacity:1; transform:translate(var(--sx),var(--sy)) scale(1.15) rotate(var(--sr)); }
  70%  { opacity:.7; }
  100% { opacity:0; transform:translate(var(--sx2),var(--sy2)) scale(.3) rotate(var(--sr2)); }
}

/* ── Hint ── */
.ch4-hint {
  position: fixed; bottom: 48px; left: 50%; transform: translateX(-50%);
  font-family: 'Poppins', sans-serif; font-size: clamp(14px,1.6vw,18px);
  color: rgba(220,232,248,.90);
  text-shadow: 0 0 12px rgba(180,210,240,.6), 0 1px 3px rgba(0,0,0,.5);
  text-align: center; pointer-events: none; letter-spacing: .1em;
  z-index: 20; opacity: 0; transition: opacity 0.5s ease; white-space: nowrap;
}
.ch4-hint.ch4-on { opacity: 1; }
.ch4-hint-arrow { display: block; margin-top: 6px; animation: ch4HintBounce 1.5s ease-in-out infinite; }
@keyframes ch4HintBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(8px)} }

/* ── Chapter end ── */
.ch4-end {
  position: fixed; bottom: 48px; left: 50%; transform: translateX(-50%);
  text-align: center; opacity: 0; transition: opacity 1.5s ease;
  pointer-events: none; z-index: 20; white-space: nowrap;
}
.ch4-end.ch4-on { opacity: 1; pointer-events: auto; }
.ch4-end-label { font-size: clamp(13px,1.5vw,16px); color: rgba(200,215,230,.5); letter-spacing: .12em; text-transform: uppercase; margin-bottom: 28px; display: block; }
.ch4-next-btn {
  background: transparent; border: 1px solid rgba(200,215,230,.3);
  color: rgba(200,215,230,.7); padding: 12px 32px; border-radius: 30px;
  font-family: 'Poppins', sans-serif; font-size: clamp(14px,1.6vw,17px);
  cursor: pointer; letter-spacing: .05em;
  transition: border-color 0.3s ease, color 0.3s ease; min-height: 48px;
}
.ch4-next-btn:hover { border-color: rgba(200,215,230,.7); color: rgba(200,215,230,1); }
```

- [ ] **Step 2: Commit**

```bash
git add components/chapters/Chapter4/chapter4.css
git commit -m "feat(ch4): add chapter4.css — all styles and keyframes"
```

---

## Task 3: Create `Chapter4/index.tsx` — JSX scaffold

**Files:** Create `components/chapters/Chapter4/index.tsx`

- [ ] **Step 1: Write the component shell with all JSX**

```tsx
'use client'
import { useRef, useEffect } from 'react'
import './chapter4.css'

interface Props { onComplete: () => void }

export default function Chapter4({ onComplete }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    // logic added in Task 4
    return () => {}
  }, [])

  return (
    <div className="ch4-root" ref={rootRef} data-zone="0">
      {/* Fixed gradient */}
      <div className="ch4-bg-wash" />

      {/* Background videos */}
      <video className="ch4-bg-video" id="ch4-vi-night" autoPlay muted loop playsInline>
        <source src="/chapter4/bg_night_room.mp4" type="video/mp4" />
      </video>
      <video className="ch4-bg-video" id="ch4-vi-tree" autoPlay muted loop playsInline>
        <source src="/chapter4/bg_tree_path.mp4" type="video/mp4" />
      </video>
      <video className="ch4-bg-video" id="ch4-vi-shelter" autoPlay muted loop playsInline>
        <source src="/chapter4/bg_shelter.mp4" type="video/mp4" />
      </video>
      <video className="ch4-bg-video" id="ch4-vi-food" autoPlay muted loop playsInline>
        <source src="/chapter4/bg_restaurant_table.mp4" type="video/mp4" />
      </video>

      {/* Overlays */}
      <div className="ch4-phone-glow ch4-on" id="ch4-phone-glow" />
      <div className="ch4-warm-glow" id="ch4-warm-glow" />

      {/* Ambient doodles */}
      <div className="ch4-doodle-layer">
        <span className="ch4-dk ch4-dk-arr">→ ←</span>
        <span className="ch4-dk ch4-dk-sp">✦</span>
        <span className="ch4-dk ch4-dk-leaf">🍃</span>
        <span className="ch4-dk ch4-dk-heart" id="ch4-dk-heart">♡</span>
        <span className="ch4-dk ch4-dk-ramen">🍜</span>
      </div>

      {/* Hint */}
      <div className="ch4-hint" id="ch4-hint">
        scroll to begin
        <span className="ch4-hint-arrow">↓</span>
      </div>

      {/* ── All 18 beats — CSS grid cell 1/1 ── */}
      <div className="ch4-scroll">

        {/* Beat 1 */}
        <div className="ch4-beat" id="ch4-b1">
          <p className="ch4-t-main">We started simple.</p>
        </div>

        {/* Beat 2 — CSS reveal: chat bubbles */}
        <div className="ch4-beat" id="ch4-b2">
          <div className="ch4-chat-wrap">
            <div className="ch4-bbl ch4-bbl-l">Jokes.</div>
            <div className="ch4-bbl ch4-bbl-r">Teasing.</div>
          </div>
        </div>

        {/* Beat 3 */}
        <div className="ch4-beat" id="ch4-b3">
          <p className="ch4-t-aside">A suspicious amount of jokes.</p>
        </div>

        {/* Beat 4 — stars window */}
        <div className="ch4-beat" id="ch4-b4">
          <p className="ch4-t-main">There were nights that just didn&rsquo;t end.</p>
          <div className="ch4-stars-win" id="ch4-stars-win">
            <div className="ch4-star-dot" style={{width:'2px',  height:'2px',  top:'20%', left:'24%', ['--tw' as string]:'2.8s'}} />
            <div className="ch4-star-dot" style={{width:'1.5px',height:'1.5px',top:'36%', left:'54%', ['--tw' as string]:'3.4s'}} />
            <div className="ch4-star-dot" style={{width:'2px',  height:'2px',  top:'58%', left:'40%', ['--tw' as string]:'2.1s'}} />
            <div className="ch4-star-dot" style={{width:'1px',  height:'1px',  top:'16%', left:'74%', ['--tw' as string]:'4.0s'}} />
            <div className="ch4-star-dot" style={{width:'2px',  height:'2px',  top:'72%', left:'80%', ['--tw' as string]:'3.2s'}} />
            <div className="ch4-star-dot" style={{width:'1.5px',height:'1.5px',top:'44%', left:'16%', ['--tw' as string]:'2.6s'}} />
            <div className="ch4-star-dot" style={{width:'1px',  height:'1px',  top:'82%', left:'62%', ['--tw' as string]:'3.8s'}} />
            <div className="ch4-star-dot" style={{width:'2px',  height:'2px',  top:'26%', left:'88%', ['--tw' as string]:'2.3s'}} />
          </div>
        </div>

        {/* Beat 5 — staggered 2nd line */}
        <div className="ch4-beat" id="ch4-b5">
          <p className="ch4-t-line">Not because of insomnia.</p>
          <p className="ch4-t-line" data-d="1">Because of you.</p>
        </div>

        {/* Beat 6 — CSS reveal: leaves box */}
        <div className="ch4-beat" id="ch4-b6">
          <div className="ch4-leaves-box">
            <span className="ch4-leaf-float">🍃</span>
            <p className="ch4-t-line">We smelled tree leaves</p>
            <p className="ch4-t-aside" data-d="1">like we were doing something illegal.</p>
          </div>
        </div>

        {/* Beat 7 */}
        <div className="ch4-beat" id="ch4-b7">
          <p className="ch4-t-tiny">(We were not.)</p>
        </div>

        {/* Beat 8 */}
        <div className="ch4-beat" id="ch4-b8">
          <p className="ch4-t-med">The small talks.</p>
        </div>

        {/* Beat 9 */}
        <div className="ch4-beat" id="ch4-b9">
          <p className="ch4-t-line">The &ldquo;how was your day&rdquo;</p>
          <p className="ch4-t-line" data-d="1">that somehow unpacked everything.</p>
        </div>

        {/* Beat 10 */}
        <div className="ch4-beat" id="ch4-b10">
          <p className="ch4-t-line">The kind that makes a long day</p>
          <p className="ch4-t-line" data-d="1">feel like it was worth it.</p>
        </div>

        {/* Beat 11 — shelter box */}
        <div className="ch4-beat" id="ch4-b11">
          <div className="ch4-shelter-box">
            <p className="ch4-t-shelt">You&rsquo;re my little ritual shelter.</p>
          </div>
        </div>

        {/* Beat 12 — CSS reveal: food table */}
        <div className="ch4-beat" id="ch4-b12">
          <div className="ch4-food-table">
            <span className="ch4-food-em">🍜</span>
            <span className="ch4-food-em">🍜</span>
            <span className="ch4-food-em">🥟</span>
            <span className="ch4-food-em">🧋</span>
          </div>
        </div>

        {/* Beat 13 — CSS reveal: arrows + emoji */}
        <div className="ch4-beat" id="ch4-b13">
          <div className="ch4-arrow-pair">
            <span className="ch4-arr-l">→</span>
            <span className="ch4-arr-r">←</span>
          </div>
          <p className="ch4-t-emoji ch4-lt">👉👈</p>
          <p className="ch4-t-aside ch4-lt">(you know what I mean)</p>
        </div>

        {/* Beat 14 — CSS reveal: laugh bloom */}
        <div className="ch4-beat ch4-beat-rel" id="ch4-b14">
          <div className="ch4-laugh-bg" />
          <p className="ch4-t-laugh">You laughed.</p>
        </div>

        {/* Beat 15 */}
        <div className="ch4-beat" id="ch4-b15">
          <p className="ch4-t-smile">You smiled.</p>
        </div>

        {/* Beat 16 */}
        <div className="ch4-beat" id="ch4-b16">
          <p className="ch4-t-coddl">You coddled.</p>
        </div>

        {/* Beat 17 */}
        <div className="ch4-beat" id="ch4-b17">
          <p className="ch4-t-eyes">And your eyes did that thing&hellip;</p>
        </div>

        {/* Beat 18 — CSS reveal: spark word + ambient sparkles */}
        <div className="ch4-beat ch4-beat-rel" id="ch4-b18">
          <p className="ch4-t-line">where they <span className="ch4-spark-w">✦spark✦</span></p>
          <p className="ch4-t-small ch4-t-aside" data-d="250">a little more than necessary.</p>
          <span className="ch4-amb ch4-amb-1">✦</span>
          <span className="ch4-amb ch4-amb-2">✧</span>
        </div>

      </div>{/* end .ch4-scroll */}

      {/* Chapter end */}
      <div className="ch4-end" id="ch4-end">
        <span className="ch4-end-label">Chapter 4</span>
        <button className="ch4-next-btn" id="ch4-next-btn">Continue →</button>
      </div>

    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
# Expected: no errors
```

- [ ] **Step 3: Commit**

```bash
git add components/chapters/Chapter4/index.tsx
git commit -m "feat(ch4): scaffold Chapter4 component — JSX structure"
```

---

## Task 4: Implement `useEffect` — all logic

**Files:** Modify `components/chapters/Chapter4/index.tsx` — replace the empty `useEffect` body with complete logic.

- [ ] **Step 1: Replace the useEffect body with the full implementation**

Replace the `useEffect(() => { // logic added in Task 4 \n return () => {} }, [])` block with:

```tsx
useEffect(() => {
  const root = rootRef.current!

  const BEATS = [
    'ch4-b1',  'ch4-b2',  'ch4-b3',  'ch4-b4',  'ch4-b5',
    'ch4-b6',  'ch4-b7',  'ch4-b8',  'ch4-b9',  'ch4-b10',
    'ch4-b11', 'ch4-b12', 'ch4-b13', 'ch4-b14', 'ch4-b15',
    'ch4-b16', 'ch4-b17', 'ch4-b18',
  ] as const

  // These beats reveal via CSS keyframe — skip typing engine
  const CSS_BEATS = new Set(['ch4-b2', 'ch4-b6', 'ch4-b12', 'ch4-b13', 'ch4-b14', 'ch4-b18'])

  // Scene A+B: fast typing; Scene C (b14–b18): contemplative
  const SLOW_FROM = 13 // BEATS index of ch4-b14

  // Zone entries keyed by beat index (0-based)
  const ZONES: Array<{ idx: number; zone: string; videoId: string | null; glow: boolean }> = [
    { idx: 0,  zone: '0', videoId: 'ch4-vi-night',   glow: true  },
    { idx: 3,  zone: '1', videoId: null,              glow: true  },
    { idx: 5,  zone: '2', videoId: 'ch4-vi-tree',    glow: false },
    { idx: 7,  zone: '2', videoId: null,              glow: false },
    { idx: 10, zone: '3', videoId: 'ch4-vi-shelter',  glow: false },
    { idx: 11, zone: '4', videoId: 'ch4-vi-food',    glow: false },
    { idx: 13, zone: '5', videoId: null,              glow: false },
    { idx: 17, zone: '6', videoId: null,              glow: false },
  ]

  const gid = (id: string) => document.getElementById(id) as HTMLElement | null

  // ── setZone ──────────────────────────────────────────────────────
  function setZone(zone: string, videoId: string | null, glow: boolean) {
    root.dataset.zone = zone
    root.querySelectorAll<HTMLVideoElement>('.ch4-bg-video').forEach(v => {
      v.classList.remove('ch4-on')
      v.pause()
    })
    if (videoId) {
      const v = gid(videoId) as HTMLVideoElement | null
      if (v) { v.classList.add('ch4-on'); v.play().catch(() => {}) }
    }
    const pg = gid('ch4-phone-glow')
    glow ? pg?.classList.add('ch4-on') : pg?.classList.remove('ch4-on')
  }

  // ── moreStars ────────────────────────────────────────────────────
  function moreStars(win: HTMLElement) {
    const extra: [number, number, number, number][] = [
      [1.5,10,45,3.1],[2,50,70,2.5],[1,65,28,4.2],[2,30,10,2.9],
      [1.5,85,90,3.7],[1,5,60,2.2],[2,55,50,3.5],[1.5,75,35,2.7],
      [1,92,18,4.4],[2,18,82,2.0],[1.5,42,95,3.3],
    ]
    extra.forEach(([w, t, l, tw], i) => {
      setTimeout(() => {
        const d = document.createElement('div')
        d.className = 'ch4-star-dot'
        d.style.cssText = `width:${w}px;height:${w}px;top:${t}%;left:${l}%;--tw:${tw}s;opacity:0;transition:opacity 1s`
        win.appendChild(d)
        requestAnimationFrame(() => requestAnimationFrame(() => { d.style.opacity = '1' }))
      }, i * 160)
    })
  }

  // ── launchSparkles ───────────────────────────────────────────────
  function launchSparkles(
    anchor: HTMLElement,
    colors: string[], chars: string[],
    distMin: number, distMax: number
  ) {
    const rect = anchor.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top  + rect.height / 2
    chars.forEach((ch, i) => {
      const s    = document.createElement('span')
      const ang  = (i / chars.length) * 360 + Math.random() * 28
      const dist = distMin + Math.random() * (distMax - distMin)
      const rad  = ang * Math.PI / 180
      s.textContent = ch
      s.style.cssText = `
        position:fixed;left:${cx}px;top:${cy}px;pointer-events:none;z-index:999;
        font-size:${[10,14,18,14,10,18,12][i] ?? 12}px;
        color:${colors[i % colors.length]};
        --sx:${+(Math.cos(rad) * dist).toFixed(1)}px;
        --sy:${+(Math.sin(rad) * dist).toFixed(1)}px;
        --sx2:${+(Math.cos(rad) * dist * 1.4).toFixed(1)}px;
        --sy2:${+(Math.sin(rad) * dist * 1.4 + 10).toFixed(1)}px;
        --sr:${~~(Math.random() * 360)}deg;
        --sr2:${~~(Math.random() * 720)}deg;
        animation:ch4SparkleFly ${(.9 + Math.random() * .5).toFixed(2)}s ${i * 75}ms forwards;
      `
      document.body.appendChild(s)
      s.addEventListener('animationend', () => s.remove())
    })
  }

  // ── Typing engine ────────────────────────────────────────────────
  type BeatPara = { p: HTMLElement; text: string }
  const beatParas = new Map<string, BeatPara[]>()

  BEATS.forEach(id => {
    if (CSS_BEATS.has(id)) return
    const el = document.getElementById(id)
    if (!el) return
    const paras: BeatPara[] = []
    el.querySelectorAll<HTMLElement>('p').forEach(p => {
      paras.push({ p, text: p.textContent ?? '' })
    })
    beatParas.set(id, paras)
  })

  const typingTimers = new Map<string, ReturnType<typeof setTimeout>[]>()

  function cancelTyping(id: string) {
    ;(typingTimers.get(id) ?? []).forEach(clearTimeout)
    typingTimers.set(id, [])
  }

  function typeBeat(id: string, slow: boolean) {
    cancelTyping(id)
    const paras = beatParas.get(id)
    if (!paras) return
    paras.forEach(({ p }) => { p.textContent = '' })

    const charMs  = slow ? 35 : 12
    const paraGap = 280
    let   time    = 80
    const timers: ReturnType<typeof setTimeout>[] = []

    paras.forEach(({ p, text }) => {
      if (p.dataset.d !== undefined) {
        const t = time
        timers.push(setTimeout(() => p.classList.add('ch4-on'), t))
      }
      for (let i = 0; i < text.length; i++) {
        const c    = text[i]
        const fire = time
        time += charMs + Math.floor(Math.random() * Math.ceil(charMs * 0.4))
        timers.push(setTimeout(() => { p.textContent += c }, fire))
      }
      time += paraGap
    })

    typingTimers.set(id, timers)
  }

  // ── showBeat ─────────────────────────────────────────────────────
  let endShown = false

  function showBeat(idx: number) {
    const id = BEATS[idx]
    const el = gid(id)
    if (!el) return

    el.classList.add('ch4-on')

    if (CSS_BEATS.has(id)) {
      // CSS-reveal beats: handle data-d children for staggered appearance
      el.querySelectorAll<HTMLElement>('[data-d]').forEach(c => {
        const delay = parseInt(c.dataset.d ?? '0', 10) || 200
        setTimeout(() => c.classList.add('ch4-on'), delay)
      })
    } else {
      typeBeat(id, idx >= SLOW_FROM)
    }

    // Zone switching
    const zoneEntry = ZONES.find(z => z.idx === idx)
    if (zoneEntry) setZone(zoneEntry.zone, zoneEntry.videoId, zoneEntry.glow)

    // ── Side effects ──
    if (id === 'ch4-b1') {
      setTimeout(() => {
        root.querySelectorAll<HTMLElement>('.ch4-dk').forEach((d, j) =>
          setTimeout(() => d.classList.add('ch4-on'), j * 400)
        )
      }, 700)
    }

    if (id === 'ch4-b4') {
      const win = el.querySelector<HTMLElement>('.ch4-stars-win')
      if (win) setTimeout(() => moreStars(win), 900)
    }

    if (id === 'ch4-b14') {
      gid('ch4-dk-heart')?.classList.add('ch4-on')
      gid('ch4-warm-glow')?.classList.add('ch4-on')
      setTimeout(() => {
        const laugh = el.querySelector<HTMLElement>('.ch4-t-laugh')
        if (laugh) launchSparkles(laugh,
          ['#D4756B','#FFD3B6','#FFBFA0','#FFB347'],
          ['✦','✧','·','✦','✧','·','✦'], 40, 75)
      }, 600)
    }

    if (id === 'ch4-b18') {
      const sw = el.querySelector<HTMLElement>('.ch4-spark-w')
      if (sw) setTimeout(() => launchSparkles(sw,
        ['#FFD3B6','#E6E6FA','#A8D8EA'],
        ['✦','✧','✦','✧','✦','✧','✦'], 35, 72), 400)

      if (!endShown) {
        endShown = true
        setTimeout(() => {
          const endEl = gid('ch4-end')
          if (endEl) endEl.classList.add('ch4-on')
          const btn = gid('ch4-next-btn')
          if (btn) btn.onclick = () => onCompleteRef.current()
        }, 2200)
      }
    }
  }

  // ── hideBeat ─────────────────────────────────────────────────────
  function hideBeat(idx: number, cb: () => void) {
    const id = BEATS[idx]
    const el = gid(id)
    if (!el) { cb(); return }
    cancelTyping(id)
    el.classList.remove('ch4-on')
    el.querySelectorAll<HTMLElement>('[data-d]').forEach(c => c.classList.remove('ch4-on'))
    setTimeout(cb, idx >= SLOW_FROM ? 600 : 280)
  }

  // ── goTo ─────────────────────────────────────────────────────────
  let current   = -1
  let animating = false
  const hintEl  = gid('ch4-hint')

  function goTo(next: number) {
    if (animating) return
    if (next === current) return
    if (next < -1 || next >= BEATS.length) return

    animating = true
    const prev = current
    current    = next

    function doShow() {
      if (next === -1) {
        hintEl?.classList.add('ch4-on')
        animating = false
        return
      }
      showBeat(next)
      const lockMs = next >= SLOW_FROM ? 1200 : 600
      setTimeout(() => { animating = false }, lockMs)
    }

    if (prev === -1) {
      hintEl?.classList.remove('ch4-on')
      setTimeout(doShow, 280)
    } else {
      hideBeat(prev, doShow)
    }
  }

  // ── Input handlers ───────────────────────────────────────────────
  const hintTimer = setTimeout(() => hintEl?.classList.add('ch4-on'), 800)

  const onWheel = (e: WheelEvent) => {
    e.preventDefault()
    if (animating) return
    goTo(current + (e.deltaY > 0 ? 1 : -1))
  }
  window.addEventListener('wheel', onWheel, { passive: false })

  let touchY0: number | null = null
  const onTouchStart = (e: TouchEvent) => { touchY0 = e.touches[0].clientY }
  const onTouchEnd   = (e: TouchEvent) => {
    if (touchY0 === null) return
    const dy = touchY0 - e.changedTouches[0].clientY
    touchY0 = null
    if (Math.abs(dy) < 40 || animating) return
    goTo(current + (dy > 0 ? 1 : -1))
  }
  window.addEventListener('touchstart', onTouchStart, { passive: true })
  window.addEventListener('touchend',   onTouchEnd,   { passive: true })

  const onKeyDown = (e: KeyboardEvent) => {
    if (animating) return
    if (e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); goTo(current + 1) }
    else if (e.key === 'ArrowUp')               { e.preventDefault(); goTo(current - 1) }
  }
  window.addEventListener('keydown', onKeyDown)

  return () => {
    clearTimeout(hintTimer)
    BEATS.forEach(id => cancelTyping(id))
    window.removeEventListener('wheel',      onWheel)
    window.removeEventListener('touchstart', onTouchStart)
    window.removeEventListener('touchend',   onTouchEnd)
    window.removeEventListener('keydown',    onKeyDown)
  }
}, [])
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
# Expected: no errors
```

- [ ] **Step 3: Commit**

```bash
git add components/chapters/Chapter4/index.tsx
git commit -m "feat(ch4): implement navigation, typing engine, zones, special effects"
```

---

## Task 5: Wire Chapter4 into SceneManager

**Files:** Modify `components/SceneManager.tsx`

- [ ] **Step 1: Add dynamic import** — after the `Chapter3` import line, add:

```tsx
const Chapter4 = dynamic(() => import('./chapters/Chapter4'), { ssr: false })
```

- [ ] **Step 2: Add render block** — after the `currentChapter === 3` block (closes with `</div>`), add:

```tsx
{currentChapter === 4 && (
  <div data-testid="chapter-4" style={{ width: '100%', height: '100%' }}>
    <Chapter4 onComplete={() => advanceChapter(5)} />
  </div>
)}
```

- [ ] **Step 3: Fix the stub condition** — change:

```tsx
{currentChapter > 3 && currentChapter !== 5 && currentChapter !== 6 && (
```

to:

```tsx
{currentChapter > 4 && currentChapter !== 5 && currentChapter !== 6 && (
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
# Expected: no errors
```

- [ ] **Step 5: Commit**

```bash
git add components/SceneManager.tsx
git commit -m "feat(ch4): wire Chapter4 into SceneManager"
```

---

## Task 6: Smoke test

**Files:** Read-only verification

- [ ] **Step 1: Start dev server**

```bash
npm run dev
# Navigate to http://localhost:3000/#ch4  to jump directly to Chapter 4
```

- [ ] **Step 2: Verify each checkpoint from the spec**

Check in order — navigate with scroll/arrow keys:

| # | What to verify |
|---|---|
| Start | "scroll to begin" hint appears after ~800ms |
| Beat 1 | "We started simple." types fast; night room video visible; phone glow on; doodles fade in |
| Beat 2 | "Jokes." slides from left, "Teasing." from right with 200ms delay |
| Beat 3 | "A suspicious amount of jokes." types italic |
| Beat 4 | Stars window appears; 11 extra stars pop in over ~1.8s |
| Beat 5 | "Not because of insomnia." types, then "Because of you." fades in and types |
| Beat 6 | Leaves box with tree path bg appears; leaf emoji floats; zone 2 |
| Beat 7 | "(We were not.)" types tiny italic |
| Beat 11 | Shelter box with shelter bg; zone 3; shelter video |
| Beat 12 | Food table on warm bg; 4 emojis pop in staggered; zone 4; restaurant video |
| Beat 13 | Arrow pair pings inward (different periods); 👉👈 appears |
| Beat 14 | "You laughed." blooms (scale + letter-spacing); terracotta color; sparkle burst; warm glow on; heart appears; zone 5 |
| Beat 15-16 | Typing is noticeably slower (35ms/char) |
| Beat 18 | "✦spark✦" glows amber; sparkle burst on it; ambient sparkles linger; zone 6 |
| After beat 18 | "Chapter 4" label + "Continue →" button appear ~2s after; click fires onComplete → transitions to Ch5 |
| Backwards nav | Arrow up / swipe up goes back; beat re-reveals with fresh typing |

- [ ] **Step 3: Fix any visual issues found, commit fixes**

```bash
git add -p
git commit -m "fix(ch4): [describe fix]"
```

---

## Self-Review

**Spec coverage check:**
- ✅ 18 beats, all content from script
- ✅ Step navigation (wheel/touch/key)
- ✅ Typing: 12ms/char A+B, 35ms/char C
- ✅ CSS reveal: b2 (bubbles), b6 (leaves), b12 (food), b13 (arrows), b14 (laugh), b18 (spark)
- ✅ Background videos: 4 videos, crossfade on zone change
- ✅ CSS gradient zones 0–6
- ✅ Phone glow: on zones 0–1, off elsewhere
- ✅ Warm glow: activates at beat 14
- ✅ `moreStars()` at beat 4
- ✅ Sparkle burst: beat 14 (laugh) + beat 18 (spark word)
- ✅ Heart doodle: appears at beat 14
- ✅ 5 doodle elements stagger in at beat 1
- ✅ End button after beat 18 fires `onComplete`
- ✅ SceneManager wired: ch3 → ch4 → ch5
- ✅ Backwards navigation supported
- ✅ Cleanup on unmount
