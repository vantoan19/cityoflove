# Chapter 2 Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Append the 7 missing scroll-reveal message blocks to `chapter2/index.html`, completing the chapter through the "morning/afternoon" persona reveal and the "you become them" finale.

**Architecture:** Pure HTML/CSS additions to a standalone file — no build step, no framework. Two new CSS classes (`.message p.morning`, `.message p.afternoon`) are appended to the existing `<style>` block, then 7 new `.message` divs are appended inside `<div class="letter">` after `#m14`. The existing IntersectionObserver, scroll-reveal, and audio player logic are untouched.

**Tech Stack:** Vanilla HTML, CSS, JS (no bundler). Open in any browser to verify.

---

### Task 1: Add morning/afternoon CSS classes

**Files:**
- Modify: `chapter2/index.html` (inside `<style>` block, after the `.reply.shown` rule near line 178)

- [ ] **Step 1: Add the two new color classes**

Locate the closing `</style>` tag (line ~179 in the current file). Insert immediately before it:

```css
    .message p.morning   { color: #C87941; }
    .message p.afternoon { color: #7B6BA8; }
```

- [ ] **Step 2: Open in browser and confirm no visual change to existing messages**

Open `chapter2/index.html` directly in a browser. Scroll through all 14 existing messages — nothing should look different. The new classes are unused so far.

- [ ] **Step 3: Commit**

```bash
git add chapter2/index.html
git commit -m "style(ch2): add morning/afternoon color classes"
```

---

### Task 2: Append messages m15–m18 (first real lunch + reveal setup)

**Files:**
- Modify: `chapter2/index.html` (inside `<div class="letter" id="letter">`, after the closing `</div>` of `#m14`)

- [ ] **Step 1: Append m15–m18 after the `#m14` closing tag**

Locate `</div><!-- /letter -->` (the very last line of the letter div, after `#m14`). Insert the following blocks immediately before that closing comment:

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

- [ ] **Step 2: Verify scroll-reveal picks up the new messages**

Open `chapter2/index.html` in a browser. Scroll to the bottom — you should see m15 through m18 fade in on scroll, in the same style as m1–m14.

- [ ] **Step 3: Commit**

```bash
git add chapter2/index.html
git commit -m "feat(ch2): add first-real-lunch and reveal-setup messages (m15-m18)"
```

---

### Task 3: Append messages m19–m20 (morning/afternoon persona)

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

Open `chapter2/index.html` and scroll to m19/m20:
- m19 lines must appear in warm peach `#C87941`
- m20 lines must appear in soft lavender `#7B6BA8`
- No color bleed into adjacent messages

- [ ] **Step 3: Commit**

```bash
git add chapter2/index.html
git commit -m "feat(ch2): add morning/afternoon persona messages (m19-m20)"
```

---

### Task 4: Append message m21 (finale)

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

- [ ] **Step 2: Verify finale in browser**

Scroll to the bottom. The last two lines of m21 must render at the `.big` size (`clamp(24px, 2.8vw, 34px)`) in the default dark color `#3a2028`. Confirm there is no color class applied — the text should not be peach or lavender.

- [ ] **Step 3: Full end-to-end scroll check**

Scroll the entire page from top to bottom in one pass. Confirm:
1. All 21 messages reveal in sequence
2. m19 is warm peach, m20 is soft lavender
3. m21 finale is large and dark
4. No layout breaks or clipped text on the `letter_long.png` background

- [ ] **Step 4: Commit**

```bash
git add chapter2/index.html
git commit -m "feat(ch2): add finale message (m21) — complete chapter 2"
```
