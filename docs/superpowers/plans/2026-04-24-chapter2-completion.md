# Chapter 2 Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete `chapter2/index.html` — replace IntersectionObserver with GSAP ScrollTrigger snap (one message at a time), add morning/afternoon color classes, and append the 7 missing story messages (m15–m21).

**Architecture:** All changes are in `chapter2/index.html` (standalone HTML, no build step). GSAP ScrollTrigger replaces the IntersectionObserver for reveals and adds a snap behavior so the page settles on one message at a time as the user scrolls. CSS handles color variation; GSAP handles motion. Special one-off animations (eyes pop, typing cursor) are triggered via ScrollTrigger `onEnter` callbacks instead of the old observer.

**Tech Stack:** GSAP 3 (ScrollTrigger plugin) via CDN, vanilla JS, CSS.

---

### Task 1: Add GSAP scripts and strip CSS scroll state

**Files:**
- Modify: `chapter2/index.html`

- [ ] **Step 1: Add GSAP CDN scripts to `<head>` before `</head>`**

```html
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
```

- [ ] **Step 2: Replace the `.message` CSS rule**

Remove the `opacity`, `transform`, and `transition` declarations from `.message` — GSAP will own the initial hidden state. Keep only layout properties. Replace the entire rule:

**Before:**
```css
    .message {
      max-width: 680px;
      margin: 0 auto;
      padding: 5vh 0;
      opacity: 0;
      transform: translateY(24px);
      transition:
        opacity   0.85s cubic-bezier(0.22, 0.61, 0.36, 1),
        transform 0.85s cubic-bezier(0.22, 0.61, 0.36, 1);
    }

    .message.visible {
      opacity: 1;
      transform: translateY(0);
    }
```

**After:**
```css
    .message {
      max-width: 680px;
      margin: 0 auto;
      padding: 5vh 0;
    }
```

Keep the `.message.visible .eyes` rule intact — it's still needed for the eyes pop animation:
```css
    .message.visible .eyes { animation-play-state: running; }
```

- [ ] **Step 3: Open in browser, confirm letter entrance animation still works**

The `.letter` entrance animation (`letterIn`) is CSS-only and must still fade the letter in. Messages will all be visible (no hiding yet — GSAP init happens in the next task). That's expected at this stage.

- [ ] **Step 4: Commit**

```bash
git add chapter2/index.html
git commit -m "chore(ch2): add GSAP CDN, strip CSS scroll-reveal state"
```

---

### Task 2: Replace IntersectionObserver with GSAP ScrollTrigger + snap

**Files:**
- Modify: `chapter2/index.html` (`<script>` block)

- [ ] **Step 1: Replace the scroll-reveal script block**

Find the entire `<script>` block (from `/* ── Scroll-reveal ──` to the closing `</script>`). Replace the scroll-reveal section and parallax section with GSAP equivalents. Keep the audio player and typing animation functions unchanged.

Replace the section from `/* ── Scroll-reveal ──` through `}, { passive: true });` with:

```javascript
  /* ── GSAP ScrollTrigger ─────────────────────────────────── */
  gsap.registerPlugin(ScrollTrigger);

  // Set all messages to hidden initial state
  gsap.set('.message', { opacity: 0, y: 24 });

  // Reveal each message when it enters the viewport
  document.querySelectorAll('.message').forEach((msg) => {
    ScrollTrigger.create({
      trigger: msg,
      start: 'top 78%',
      onEnter: () => {
        gsap.to(msg, { opacity: 1, y: 0, duration: 0.85, ease: 'power2.out' });
        msg.classList.add('visible');          // activates eyes CSS animation
        if (msg.id === 'm14') startTyping();
      }
    });
  });

  // Snap scroll: settle on one message at a time
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    snap: {
      snapTo: (progress) => {
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const positions = Array.from(document.querySelectorAll('.message')).map(el => {
          return Math.max(0, el.offsetTop - window.innerHeight * 0.35) / maxScroll;
        });
        positions.unshift(0);
        return gsap.utils.snap(positions, progress);
      },
      duration: { min: 0.3, max: 0.8 },
      delay: 0.1,
      ease: 'power2.inOut'
    }
  });

  /* ── Gentle letter parallax on scroll ───────────────────── */
  const letter = document.getElementById('letter');
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      letter.style.transform = `translateY(${self.scroll() * 0.04}px)`;
    }
  });
```

- [ ] **Step 2: Verify snap behavior in browser**

Open `chapter2/index.html`. Scroll slowly — the page should settle on each message one at a time. Snap should feel smooth (not a hard jump). All 14 messages should reveal cleanly. The eyes animation on m2 must trigger. The typing animation on m14 must trigger.

- [ ] **Step 3: Commit**

```bash
git add chapter2/index.html
git commit -m "feat(ch2): replace IntersectionObserver with GSAP ScrollTrigger snap"
```

---

### Task 3: Add morning/afternoon CSS classes

**Files:**
- Modify: `chapter2/index.html` (`<style>` block, after `.reply.shown` rule)

- [ ] **Step 1: Append the two color classes before `</style>`**

```css
    .message p.morning   { color: #C87941; }
    .message p.afternoon { color: #7B6BA8; }
```

- [ ] **Step 2: Commit**

```bash
git add chapter2/index.html
git commit -m "style(ch2): add morning/afternoon color classes"
```

---

### Task 4: Append messages m15–m18 (first real lunch + reveal setup)

**Files:**
- Modify: `chapter2/index.html` (inside `.letter`, after closing `</div>` of `#m14`)

- [ ] **Step 1: Append m15–m18 before `</div><!-- /letter -->`**

```html
  <div class="message" id="m15">
    <p>And then—</p>
    <p>we had our first real lunch.</p>
  </div>

  <div class="message" id="m16">
    <p>That's when I saw more of you.</p>
  </div>

  <div class="message" id="m17">
    <p class="emph">Not just fun.</p>
    <p class="emph">Not just cute.</p>
  </div>

  <div class="message" id="m18">
    <p>But…</p>
    <p class="emph">someone who becomes what she does.</p>
  </div>
```

- [ ] **Step 2: Verify in browser**

Scroll to the bottom. m15–m18 must snap into view in sequence, same reveal style as earlier messages.

- [ ] **Step 3: Commit**

```bash
git add chapter2/index.html
git commit -m "feat(ch2): add first-real-lunch and reveal-setup messages (m15-m18)"
```

---

### Task 5: Append messages m19–m20 (morning/afternoon persona)

**Files:**
- Modify: `chapter2/index.html` (after `#m18`)

- [ ] **Step 1: Append m19 and m20 after `#m18`**

```html
  <div class="message" id="m19">
    <p class="morning">Morning:</p>
    <p class="morning">a mom, raising kids in her mind.</p>
  </div>

  <div class="message" id="m20">
    <p class="afternoon">Afternoon:</p>
    <p class="afternoon">someone else entirely.</p>
    <p class="afternoon">Just to understand.</p>
    <p class="afternoon">Just to make things real.</p>
  </div>
```

- [ ] **Step 2: Verify color shift in browser**

Snap through to m19 and m20:
- m19 lines must appear in warm peach `#C87941`
- m20 lines must appear in soft lavender `#7B6BA8`
- Adjacent messages must remain default dark `#3a2028`

- [ ] **Step 3: Commit**

```bash
git add chapter2/index.html
git commit -m "feat(ch2): add morning/afternoon persona messages (m19-m20)"
```

---

### Task 6: Append message m21 (finale) and full verification

**Files:**
- Modify: `chapter2/index.html` (after `#m20`)

- [ ] **Step 1: Append m21 after `#m20`**

```html
  <div class="message" id="m21">
    <p>That's when I knew—</p>
    <p class="big">you don't just do things.</p>
    <p class="big">You become them.</p>
  </div>
```

- [ ] **Step 2: Full end-to-end verification**

Snap through the entire page from top to bottom. Confirm:
1. Letter entrance animation plays on load
2. All 21 messages snap in sequence, one at a time
3. m2 eyes pop animation triggers
4. m11 audio player is present and functional
5. m14 typing animation triggers ("I texted you." types out, then "You replied." fades in)
6. m19 is warm peach, m20 is soft lavender
7. m21 "you become them" renders at `.big` size in dark `#3a2028`
8. Snap easing feels smooth — no hard jumps

- [ ] **Step 3: Commit**

```bash
git add chapter2/index.html
git commit -m "feat(ch2): add finale message (m21) — complete chapter 2 with GSAP snap"
```
