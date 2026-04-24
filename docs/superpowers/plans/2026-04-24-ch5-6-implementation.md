# Chapter 5+6 — "The Part Where We Went Too Fast" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `chapter5/index.html` — a two-movement standalone scroll page: fast chaotic M1 (The Speedrun) ending in a memory flash montage + glitch cut, then slow tender M2 (The Glitch) with a foggy forest background and breathing pulse.

**Architecture:** Standalone HTML file following `chapter4/index.html` patterns exactly — fixed background layer, CSS rain layer, fog overlay layer, scroll-content layer. Two IntersectionObservers (tight rootMargin for M1, spacious for M2). Hard cut triggered by JS after memory flash completes.

**Tech Stack:** Vanilla HTML/CSS/JS, Google Fonts (Poppins), IntersectionObserver, RAF parallax. No build step — open `chapter5/index.html` directly in a browser.

**Design spec:** `docs/superpowers/specs/2026-04-24-ch5-6-design.md`

---

## File Structure

```
chapter5/
  index.html                  ← main file (everything inline: CSS + JS + HTML)
  backgrounds/
    bg_rainy_forest.png        ← copy from debug/bg_rainy_forest.png
    bg_foggy_forest.png        ← copy from debug/bg_foggy_forest.png
```

Memory flash thumbnails borrowed from existing assets:
- `../chapter3/backgrounds/city_night/city_base.png`
- `../chapter4/backgrounds/bg_night_room.png`
- `../chapter4/backgrounds/bg_restaurant_table.png`
- `../chapter4/backgrounds/bg_tree_path.png`
- `../chapter4/backgrounds/bg_shelter.png`
- White flash: `#ffffff` (CSS only, no image)

---

## Task 1: Create directory + copy background assets

**Files:**
- Create: `chapter5/` directory
- Create: `chapter5/backgrounds/` directory
- Copy: `debug/bg_rainy_forest.png` → `chapter5/backgrounds/bg_rainy_forest.png`
- Copy: `debug/bg_foggy_forest.png` → `chapter5/backgrounds/bg_foggy_forest.png`

- [ ] **Step 1: Create directories and copy files**

```bash
mkdir -p chapter5/backgrounds
cp debug/bg_rainy_forest.png chapter5/backgrounds/bg_rainy_forest.png
cp debug/bg_foggy_forest.png chapter5/backgrounds/bg_foggy_forest.png
```

- [ ] **Step 2: Verify files exist**

```bash
ls -lh chapter5/backgrounds/
```

Expected output: both PNG files listed, each ~3MB.

- [ ] **Step 3: Commit**

```bash
git add chapter5/backgrounds/
git commit -m "feat(ch5): add forest background assets"
```

---

## Task 2: Scaffold HTML — structure, head, reset CSS

**Files:**
- Create: `chapter5/index.html`

- [ ] **Step 1: Create the file with boilerplate, reset, and layer stack HTML**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Chapter 5 — The Part Where We Went Too Fast</title>
<link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
<style>
/* ── Reset ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: auto; }
body {
  font-family: 'Poppins', sans-serif;
  color: #F0F0F0;
  overflow-x: hidden;
  min-height: 100vh;
  background: #0D1117;
}

/* ── Background image ── */
.bg-image {
  position: fixed; inset: 0; z-index: 0;
  background-size: cover; background-position: center;
  background-image: url('backgrounds/bg_rainy_forest.png');
  pointer-events: none;
}
body.m2 .bg-image {
  background-image: url('backgrounds/bg_foggy_forest.png');
  /* No transition — instant swap on hard cut */
}

/* ── Rain layer ── */
.rain-layer {
  position: fixed; inset: 0; z-index: 1;
  pointer-events: none; overflow: hidden;
}
.rain-drop {
  position: absolute; top: -20px;
  width: 1.5px; border-radius: 2px;
  background: rgba(150, 170, 200, 0.6);
  animation: rainFall linear infinite;
}
@keyframes rainFall {
  from { transform: translateY(0) translateX(0); }
  to   { transform: translateY(115vh) translateX(var(--dx, -20px)); }
}

/* ── Fog overlay (M2 only) ── */
/* opacity is controlled only by animation in M2 — no CSS transition to avoid conflict */
.fog-overlay {
  position: fixed; inset: 0; z-index: 2;
  pointer-events: none;
  background: radial-gradient(ellipse at center, rgba(200,210,230,0.12) 0%, transparent 70%);
  backdrop-filter: blur(2px);
  opacity: 0;
}
body.m2 .fog-overlay {
  animation: breatheM2 4s ease-in-out infinite;
}
@keyframes breatheM2 {
  0%, 100% { opacity: 0.04; }
  50%       { opacity: 0.10; }
}

/* ── Memory flash overlay ── */
.memory-flash-overlay {
  position: fixed; inset: 0; z-index: 100;
  display: none;
  background-size: cover; background-position: center;
  background-color: #fff;
}
.glitch-invert { filter: invert(1); }

/* ── Scroll content ── */
.scroll-content {
  position: relative; z-index: 3;
  max-width: 620px; margin: 0 auto; padding: 0 28px 30vh;
}

/* ── Spacers ── */
.sp    { height: 16vh; }   /* M1 — tight */
.sp-m2 { height: 40vh; }   /* M2 — spacious */

</style>
</head>
<body>
  <div class="bg-image"></div>
  <div class="rain-layer" id="rain-layer"></div>
  <div class="fog-overlay"></div>
  <div class="memory-flash-overlay" id="mem-flash"></div>
  <div class="scroll-content" id="sc">
    <!-- beats inserted in Tasks 3 and 6 -->
  </div>
<script>
  const $ = id => document.getElementById(id);
</script>
</body>
</html>
```

- [ ] **Step 2: Open in browser and verify**

Open `chapter5/index.html` in a browser (double-click or `start chapter5/index.html`).

Expected: dark background with the rainy forest image visible. No rain yet. No text yet. Page scrolls but is mostly empty.

- [ ] **Step 3: Commit**

```bash
git add chapter5/index.html
git commit -m "feat(ch5): scaffold HTML layer stack"
```

---

## Task 3: CSS rain animation — M1 state

**Files:**
- Modify: `chapter5/index.html` — add rain CSS + JS generator inside `<script>`

- [ ] **Step 1: Add rain typography + generator JS to the script block**

Add inside the `<style>` block, after `.sp-m2` rule:

```css
/* ── Beat reveal (M1 — fast) ── */
.beat {
  padding: 5vh 0; text-align: center;
  opacity: 0; transform: translateY(20px) skewX(0deg);
  transition: opacity 0.5s cubic-bezier(.22,.61,.36,1),
              transform 0.5s cubic-bezier(.22,.61,.36,1);
}
.beat.on { opacity: 1; transform: translateY(0) skewX(0deg); }
.beat.skew { transform: translateY(20px) skewX(1deg); }
.beat.skew.on { transform: translateY(0) skewX(0deg); }

/* ── Beat reveal (M2 — slow) ── */
.beat-m2 {
  padding: 6vh 0; text-align: center;
  opacity: 0; transform: translateY(24px);
  filter: blur(4px);
  transition: opacity 1.2s cubic-bezier(.22,.61,.36,1),
              transform 1.2s cubic-bezier(.22,.61,.36,1),
              filter 1.2s ease;
}
.beat-m2.on { opacity: 1; transform: translateY(0); filter: blur(0); }
/* Last beat + beat15: no blur */
.beat-m2.no-blur { filter: none; }
.beat-m2.no-blur.on { filter: none; }
/* beat16 — slowest */
.beat-m2.slow {
  transition: opacity 1.4s cubic-bezier(.22,.61,.36,1),
              transform 1.4s cubic-bezier(.22,.61,.36,1),
              filter 1.4s ease;
}

/* ── Staggered children ── */
[data-d] {
  opacity: 0; transform: translateY(14px);
  transition: opacity 0.5s cubic-bezier(.22,.61,.36,1),
              transform 0.5s cubic-bezier(.22,.61,.36,1);
}
[data-d].on { opacity: 1; transform: none; }
```

Add inside the `<script>` block, before the closing `</script>`:

```javascript
/* ── Rain generator ── */
function spawnRain(layer, count, minDur, maxDur, minOpacity, maxOpacity, dxRange) {
  layer.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const drop = document.createElement('div');
    drop.className = 'rain-drop';
    const dur  = minDur + Math.random() * (maxDur - minDur);
    const op   = minOpacity + Math.random() * (maxOpacity - minOpacity);
    const dx   = -(Math.random() * dxRange);
    const h    = 12 + Math.random() * 6;
    drop.style.cssText = [
      `left:${Math.random() * 110 - 5}vw`,
      `height:${h}px`,
      `opacity:${op}`,
      `--dx:${dx}px`,
      `animation-duration:${dur.toFixed(2)}s`,
      `animation-delay:${(Math.random() * maxDur * -1).toFixed(2)}s`,
    ].join(';');
    layer.appendChild(drop);
  }
}

/* Start M1 rain */
spawnRain($('rain-layer'), 80, 1.0, 1.4, 0.4, 0.7, 20);
```

- [ ] **Step 2: Verify rain in browser**

Reload `chapter5/index.html`. Expected: thin animated rain falling diagonally across the dark forest background.

- [ ] **Step 3: Commit**

```bash
git add chapter5/index.html
git commit -m "feat(ch5): CSS cartoon rain generator — M1 state"
```

---

## Task 4: M1 beats — HTML + typography CSS

**Files:**
- Modify: `chapter5/index.html`

- [ ] **Step 1: Add typography CSS for M1 inside `<style>` block**

Add after the beat CSS rules:

```css
/* ── M1 Typography ── */
.t-calm  { font-size: clamp(18px,2.2vw,26px); font-weight:400; font-style:italic; line-height:1.7; color:#D0D8E8; }
.t-bold  { font-size: clamp(20px,2.6vw,30px); font-weight:600; line-height:1.5; }
.t-hero  { font-size: clamp(26px,3.5vw,44px); font-weight:700; line-height:1.3; }
.t-mono  { font-family:'JetBrains Mono', monospace; font-size:clamp(14px,1.7vw,19px); font-weight:400; color:#A8C0D8; letter-spacing:0.03em; }
.t-quote { font-size: clamp(22px,2.9vw,36px); font-weight:700; line-height:1.4; }
.t-conf  { font-size: clamp(16px,2vw,22px); font-weight:400; font-style:italic; color:#B0C4D8; line-height:1.7; }

/* ── M2 Typography ── */
.t-m2-main { font-size:clamp(20px,2.5vw,30px); font-weight:400; line-height:1.8; color:#E8ECF0; }
.t-m2-soft { font-size:clamp(16px,1.9vw,22px); font-weight:400; font-style:italic; line-height:1.9; color:#C8D4E0; }
.t-m2-key  { font-size:clamp(20px,2.5vw,30px); font-weight:500; line-height:1.8; color:#E8ECF0; }
.t-m2-core { font-size:clamp(20px,2.5vw,30px); font-weight:400; line-height:1.9; color:#EEF2F6; }
```

- [ ] **Step 2: Add M1 beat HTML inside `.scroll-content` (replacing the comment)**

```html
<div class="sp"></div>

<!-- b1: deceptive calm — slightly slower reveal -->
<div class="beat" id="b1" style="transition-duration:0.85s">
  <p class="t-calm">Then…</p>
</div>
<div class="sp"></div>

<!-- b2 -->
<div class="beat" id="b2">
  <p class="t-bold">we did something impressive.</p>
</div>
<div class="sp"></div>

<!-- b3: hero line -->
<div class="beat" id="b3">
  <p class="t-hero">We speedran a relationship.</p>
</div>
<div class="sp"></div>

<!-- b4–b6: monospace trio, staggered -->
<div class="beat" id="b4">
  <p class="t-mono">Any% completion.</p>
  <p class="t-mono" data-d="150">No tutorials.</p>
  <p class="t-mono" data-d="300">No save points.</p>
</div>
<div class="sp"></div>

<!-- b7–b9: the confession, three beats -->
<div class="beat" id="b7">
  <p class="t-bold">I might have pressed</p>
</div>
<div class="sp"></div>

<div class="beat skew" id="b8">
  <p class="t-quote">"fast forward"</p>
</div>
<div class="sp"></div>

<div class="beat" id="b9">
  <p class="t-conf">a bit too hard.</p>
</div>

<!-- M2 beats inserted by Task 6 -->
```

- [ ] **Step 3: Verify beats render correctly**

Open/reload `chapter5/index.html`. Scroll down. Expected: 9 M1 beats visible in sequence (they'll all be opacity:0 until the observer is wired in Task 8). Temporarily add `class="beat on"` to one beat to verify the CSS renders correctly — text should be sharp white on dark forest background.

Remove the temporary `on` class after verifying.

- [ ] **Step 4: Commit**

```bash
git add chapter5/index.html
git commit -m "feat(ch5): M1 beat HTML + typography"
```

---

## Task 5: Memory flash sequence + glitch cut

**Files:**
- Modify: `chapter5/index.html` — add `triggerMemoryFlash()` and `activateM2()` to script block

- [ ] **Step 1: Add the memory flash + hard cut JS**

Add to the `<script>` block:

```javascript
/* ── Memory flash + hard cut ── */
const FLASH_IMAGES = [
  '../chapter3/backgrounds/city_night/city_base.png',
  '../chapter4/backgrounds/bg_night_room.png',
  '../chapter4/backgrounds/bg_restaurant_table.png',
  '../chapter4/backgrounds/bg_tree_path.png',
  '../chapter4/backgrounds/bg_shelter.png',
  null  /* white flash */
];

function triggerMemoryFlash(onComplete) {
  const overlay = $('mem-flash');
  document.body.style.overflow = 'hidden';
  overlay.style.display = 'block';
  let i = 0;

  function next() {
    if (i >= FLASH_IMAGES.length) {
      /* glitch invert frame */
      document.body.classList.add('glitch-invert');
      setTimeout(() => {
        document.body.classList.remove('glitch-invert');
        overlay.style.display = 'none';
        document.body.style.overflow = '';
        onComplete();
      }, 80);
      return;
    }
    const src = FLASH_IMAGES[i++];
    if (src) {
      overlay.style.backgroundColor = '';
      overlay.style.backgroundImage = `url('${src}')`;
    } else {
      overlay.style.backgroundImage = 'none';
      overlay.style.backgroundColor = '#ffffff';
    }
    setTimeout(next, 150);
  }
  next();
}

/* obs2 declared here so activateM2 can reference it; assigned in Task 7 */
let obs2 = null;

function activateM2() {
  /* instant bg swap — no CSS transition */
  document.body.classList.add('m2');
  /* switch to M2 rain */
  spawnRain($('rain-layer'), 30, 2.2, 2.8, 0.2, 0.35, 35);
  /* start observing M2 beats (obs2 assigned in Task 7 before user can scroll to b9) */
  if (obs2) document.querySelectorAll('.beat-m2').forEach(b => obs2.observe(b));
}
```

- [ ] **Step 2: Verify memory flash works (manual test)**

Temporarily add a test button to the HTML body, after the `<script>` tag:

```html
<button onclick="triggerMemoryFlash(() => { activateM2(); console.log('M2 activated'); })"
  style="position:fixed;bottom:20px;right:20px;z-index:200;padding:10px 16px;background:#333;color:#fff;border:none;cursor:pointer;border-radius:6px">
  Test Flash
</button>
```

Open in browser, click "Test Flash". Expected:
- Screen locks scroll
- 5 background images flash in ~750ms (Ch3 city, Ch4 night room, restaurant, tree path, shelter)
- White flash
- 80ms color invert
- Background instantly swaps to foggy forest
- Rain slows noticeably
- Fog overlay fades in
- Console logs "M2 activated"

Remove the test button after verifying.

- [ ] **Step 3: Commit**

```bash
git add chapter5/index.html
git commit -m "feat(ch5): memory flash sequence + M2 hard cut transition"
```

---

## Task 6: M2 beats — HTML

**Files:**
- Modify: `chapter5/index.html` — add M2 beats after the M1 beats in `.scroll-content`

- [ ] **Step 1: Add M2 beat HTML after b9 in `.scroll-content`**

Add after the `<!-- M2 beats inserted by Task 6 -->` comment:

```html
<!-- ══ M2 boundary — hard cut happens before b10 activates ══ -->
<div class="sp-m2"></div>

<!-- b10 -->
<div class="beat-m2" id="b10">
  <p class="t-m2-soft">Somewhere in the middle…</p>
</div>
<div class="sp-m2"></div>

<!-- b11 -->
<div class="beat-m2" id="b11">
  <p class="t-m2-main">things got a little blurry.</p>
</div>
<div class="sp-m2"></div>

<!-- b12 -->
<div class="beat-m2" id="b12">
  <p class="t-m2-soft">Not wrong.</p>
</div>
<div class="sp-m2"></div>

<!-- b13 -->
<div class="beat-m2" id="b13">
  <p class="t-m2-soft">Just…</p>
</div>
<div class="sp-m2"></div>

<!-- b14 -->
<div class="beat-m2" id="b14">
  <p class="t-m2-key">too much, too fast.</p>
</div>
<div class="sp-m2"></div>

<!-- b15: no blur, clean reveal -->
<div class="beat-m2 no-blur" id="b15">
  <p class="t-m2-main">You weren't pulling away.</p>
</div>
<div class="sp-m2"></div>

<!-- b16: emotional centre — slowest, cleanest -->
<div class="beat-m2 no-blur slow" id="b16">
  <p class="t-m2-core">You were just trying to breathe.</p>
</div>
<div class="sp-m2"></div>

<!-- Chapter end -->
<div id="chapter-end" style="text-align:center; opacity:0; transition:opacity 1.5s ease; padding: 8vh 0 20vh;">
  <p style="font-size:clamp(13px,1.5vw,16px); color:rgba(200,215,230,0.5); letter-spacing:0.12em; text-transform:uppercase; margin-bottom:28px;">Chapter 5</p>
  <button id="next-btn"
    style="background:transparent; border:1px solid rgba(200,215,230,0.3); color:rgba(200,215,230,0.7); padding:12px 32px; border-radius:30px; font-family:inherit; font-size:clamp(14px,1.6vw,17px); cursor:pointer; letter-spacing:0.05em; transition:border-color 0.3s ease, color 0.3s ease;"
    onmouseover="this.style.borderColor='rgba(200,215,230,0.7)';this.style.color='rgba(200,215,230,1)'"
    onmouseout="this.style.borderColor='rgba(200,215,230,0.3)';this.style.color='rgba(200,215,230,0.7)'"
  >
    Continue →
  </button>
</div>
```

- [ ] **Step 2: Verify M2 HTML renders (manual CSS check)**

Temporarily add `class="beat-m2 on"` to `b10` and verify it displays correctly on the foggy background. Remove after checking.

- [ ] **Step 3: Commit**

```bash
git add chapter5/index.html
git commit -m "feat(ch5): M2 beat HTML + chapter end button"
```

---

## Task 7: IntersectionObserver wiring

**Files:**
- Modify: `chapter5/index.html` — add two observers + beat trigger logic to script block

- [ ] **Step 1: Add RAF parallax + both observers to the script block**

```javascript
/* ── RAF parallax ── */
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      $('sc').style.transform = `translateY(${window.scrollY * .04}px)`;
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

/* ── Observer 1 — M1 beats (tight rootMargin) ── */
let memFlashFired = false;
const obs1 = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    el.classList.add('on');
    obs1.unobserve(el);

    /* stagger delayed children */
    el.querySelectorAll('[data-d]').forEach(c =>
      setTimeout(() => c.classList.add('on'), +c.dataset.d)
    );

    /* after b9: trigger memory flash → activate M2 */
    if (el.id === 'b9' && !memFlashFired) {
      memFlashFired = true;
      setTimeout(() => {
        triggerMemoryFlash(activateM2);
      }, 600);  /* short pause after b9 reveals */
    }
  });
}, { threshold: 0.18, rootMargin: '0px 0px -10px 0px' });

document.querySelectorAll('.beat').forEach(b => obs1.observe(b));

/* ── Observer 2 — M2 beats (spacious rootMargin) ── */
/* Assigns the obs2 variable declared in Task 5 — must be defined before user can scroll to b9 */
obs2 = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    el.classList.add('on');
    obs2.unobserve(el);

    /* show chapter end after b16 */
    if (el.id === 'b16') {
      setTimeout(() => {
        $('chapter-end').style.opacity = '1';
      }, 1500);
    }
  });
}, { threshold: 0.18, rootMargin: '0px 0px -60px 0px' });

/* obs2 begins observing in activateM2() — already defined in Task 5 */
```

- [ ] **Step 2: Full end-to-end test**

Open `chapter5/index.html` in browser. Scroll from top to bottom slowly.

Expected sequence:
1. M1 beats reveal quickly as you scroll (b1–b9)
2. After b9 reveals, ~600ms pause, then memory flash fires
3. 5 background images flash in ~750ms + white flash + 80ms invert
4. Background instantly becomes foggy forest, rain slows
5. M2 beats (b10–b16) reveal slowly with blur fade-in as you continue scrolling
6. b15 and b16 reveal cleanly (no blur)
7. b16 is noticeably slower than other M2 beats
8. After b16, chapter end button fades in after 1.5s

- [ ] **Step 3: Commit**

```bash
git add chapter5/index.html
git commit -m "feat(ch5): wire IntersectionObservers — M1+M2 beat reveals + memory flash trigger"
```

---

## Task 8: Polish — timing, mobile, scroll density tuning

**Files:**
- Modify: `chapter5/index.html`

- [ ] **Step 1: Verify beat reveal timing feels right on M1**

Open in browser. Scroll M1 section at a steady pace. M1 beats should feel like they're almost chasing you — the next beat should appear before you've fully absorbed the previous. If they feel too slow, reduce `.beat` `padding` from `5vh` to `3vh` and spacers `.sp` from `16vh` to `12vh`.

- [ ] **Step 2: Verify M2 feels genuinely slow and spacious**

After the flash, scroll M2 section. You should need to scroll significantly before the next beat appears. If it feels too fast, increase `.sp-m2` from `40vh` to `50vh`.

- [ ] **Step 3: Mobile check**

Open DevTools → toggle device toolbar → iPhone 14 Pro (390×844). Check:
- Rain drops don't overflow horizontally (`.rain-layer { overflow: hidden }` should prevent this)
- Beat text is legible (`clamp()` font sizes should handle this)
- Memory flash images cover the screen on mobile (`background-size: cover` handles this)
- Chapter end button is tappable (min-height should be at least 44px — if not, add `min-height:48px` to the button)

- [ ] **Step 4: Verify fog overlay is barely perceptible**

In M2, the breathing pulse should be almost subliminal. Open DevTools → Elements → find `.fog-overlay`. Confirm its opacity cycles between ~0.04 and ~0.10 (extremely subtle). If it looks too prominent, reduce `@keyframes breatheM2` max opacity from `0.10` to `0.07`.

- [ ] **Step 5: Commit**

```bash
git add chapter5/index.html
git commit -m "feat(ch5): polish — timing, mobile, fog tuning"
```

---

## Task 9: Final verification checklist

- [ ] M1 beats fire quickly — next beat visible before previous one is fully read on steady scroll
- [ ] `skewX` on `b8` ("fast forward"): visible on initial reveal, snaps straight on `.on` — check in slow-mo (DevTools Animations panel)
- [ ] Memory flash: 5 images + white flash + invert = total ~1s lock
- [ ] Hard cut: background swap is instant (verify: no fog-to-rain transition visible, snap only)
- [ ] Rain is visibly slower after hard cut
- [ ] M2 blur fade-in: text starts blurry (blur 4px) and sharpens — NOT the reverse
- [ ] `b15` and `b16` have no blur (check CSS: `no-blur` class)
- [ ] `b16` is the slowest reveal on the page (1.4s transition vs 1.2s for others)
- [ ] Breathing pulse barely perceptible in M2 (opacity 0.04–0.10 only)
- [ ] Chapter end button fades in cleanly ~1.5s after b16 — no abrupt pop
- [ ] Mobile: rain doesn't overflow viewport, text readable, button tappable
- [ ] `memFlashFired` guard prevents double-trigger if user scrolls back to b9

- [ ] **Final commit**

```bash
git add chapter5/index.html
git commit -m "feat(ch5): complete Ch5+6 combined chapter — speedrun + glitch"
```
