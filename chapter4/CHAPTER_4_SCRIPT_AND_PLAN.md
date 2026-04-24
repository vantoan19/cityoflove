# CHAPTER 4 — THE FUN PART
## Script + Animation Plan

---

## CREATIVE BRIEF

**Purpose:** Recreate the natural, easy energy of the connection — the part that felt effortless.

**Emotional arc:** Warm → Playful → Loud → Quietly tender

**Tone:** 70% playful / 30% emotional. Witty. Cinematic. Never sentimental.

**What makes this chapter personal:**
- They talked a lot online — late nights, messages flying back and forth
- Food dates — especially ramen/noodles
- She's a foodaholic — food is part of her personality
- The "directing traffic" gesture = the 👉👈 thing she does — both index fingers pointing inward, toward each other. An internet-native shy/cute gesture. She does it so expressively it looks like she's directing traffic.

**No characters.** The story is told through text, atmosphere, food sketches, and small moments.

---

---

# SCRIPT

*Three scenes. One continuous scroll.*

---

## ═══ SCENE A — LATE NIGHT ═══

---

**[ON SCREEN: Total darkness — then a soft amber glow blooms at the center. The light of a phone screen. A sketched window in the background, stars barely visible outside. Everything is quiet and warm.]**

---

*[Single line fades in, centered, unhurried:]*

> **We started simple.**

---

*[Beat.]*

*[A chat bubble slides in from the left — a rough sketch pill shape, off-white. Then one from the right. They appear like a real conversation, staggered 200ms apart.]*

**◀ LEFT:**
> Jokes.

**RIGHT: ▶**
> Teasing.

---

*[More bubbles follow — quicker now, the rhythm of a conversation that's found its pace. No specific words. Just the back-and-forth shape of it.]*

---

*[Then, smaller, centered, a little quieter — like catching yourself mid-laugh:]*

> *A suspicious amount of jokes.*

---

*[The phone glow pulses once, softly. Stars blink outside.]*
*[Something is beginning.]*

---

*[The chat slows. The jokes settle. What's left is just... time. A lot of it.]*

---

> **There were nights that just didn't end.**

*(Standard reveal, unhurried. Weight 400. Like stating a fact you're still a little surprised by.)*

---

> **Not because of insomnia.**

*[Beat.]*

> **Because of you.**

*(Second line arrives 400ms after the first. Slight warmth.)*

---

*[A small visual moment: the stars outside the window multiply slightly — a few more dots appear, as if time has passed and the sky has deepened.]*

---

*[Then, a shift in tone — lighter, absurd, fond:]*

> **We smelled tree leaves**
> **like we were doing something illegal.**

*(Two lines, 200ms stagger. Second line slightly italic. The memory is funny. Let it be funny.)*

---

> *(We were not.)*

*(Tiny. Centered. Italic. The aside that lands like a wink.)*

---

*[The night softens. The phone glow dims slightly — not off, just quieter.]*

---

> **The small talks.**

*(Single line. Weight 500. Not a question, not a conclusion — just naming the thing.)*

---

> **The "how was your day"**
> **that somehow unpacked everything.**

*(Two lines, gentle stagger. Weight 400. These words did real work.)*

---

> **The kind that makes a long day**
> **feel like it was worth it.**

*(Two lines. Slower reveal — 1.1s transition. The emotional weight of this one earns the extra second.)*

---

*[Long pause. Background shifts very slightly warmer.]*
*[This next line arrives alone. No rush.]*

---

> **You're my little ritual shelter.**

*(Single line. Centered. Weight 600. The most important line in Scene A — maybe in the chapter.)*
*(No burst. No animation flourish. Just the words, fading in clean.)*
*(Let it breathe.)*

---

---

## ═══ SCENE B — THE FOOD DATE ═══

*The dark dissolves into warm golden light.*

---

**[ON SCREEN: A top-down sketch of a restaurant table. Two ramen bowls, steam curling upward in thin wisps. Chopsticks resting across one bowl. Small side dishes crowded in — more than two people need. The table is full. The energy is warm and a little chaotic.]**

*[Background warms from night navy → golden amber as this scene enters view.]*

---

*[Food items sketch themselves in from the edges — one by one, each with a slight pop.]*

---

*[Then, floating above the table, two hand-drawn arrows appear — both pointing INWARD, toward each other:]*

→ ←

*[They sit close together in the center. Almost touching. The shy internet gesture, made visible.]*

---

*[Two lines appear, staggered:]*

> **👉👈**
> *(you know what I mean)*

---

*[The arrows pulse gently — nudging toward each other, then settling back. Never quite meeting.]*
*[👉👈 energy. Exactly that.]*

*[The ramen steam rises and rises.]*

*[The table stays full.]*

---

---

## ═══ SCENE C — THE LAUGH / THE EYES ═══

*The food chaos settles.*
*Something quieter takes over.*

---

**[ON SCREEN: The table fades back. The background shifts from golden to soft peach. The scene narrows — margins widen, text pulls closer. It feels more intimate now.]**

---

*[This line enters differently. It breathes in — then opens.]*
*[Scale, letter-spacing, color — all bloom at once.]*

> **You laughed.**

*(Warm terracotta — the only colored line in the chapter.)*
*(Largest text on the page.)*

---

*[A small burst: 7 sparkle particles scatter outward from the text and fade. Done in a second. Gone.]*

---

*[Smaller now. Softer. The energy settles.]*

> **You smiled.**

*(Standard reveal, 0.9s. Weight 500. Slightly smaller than the laugh — the exhale after the burst.)*

---

> **You coddled.**

*(Drifts in gently, 1.0s. Italic. This word lands quietly — warm and close.)*

---

*[The next line drifts in slower than usual. The ellipsis earns its pause:]*

> **And your eyes did that thing…**

---

*[Two lines, the second arriving 250ms after the first:]*

> **where they ✦spark✦**
> *a little more than necessary.*

*("spark" glows — warm amber, soft halo.)*
*(Second line: italic, slightly smaller. Like a confession.)*

---

*[Seven sparkle particles fly from the word "spark" — different angles, different sizes, fading one by one.]*
*[Two small sparkles linger near the word. Pulsing gently. They stay.]*

---

*[Background completes its shift — peach into soft lavender.]*
*[Everything breathes.]*
*[End of chapter.]*

---

---

# ANIMATION PLAN

---

## File

```
C:\Projects\city\chapter4\index.html  — self-contained HTML, no external dependencies
```
Template base: fork from `chapter2/index.html`

---

## Layer Stack

```
Layer 0 — .bg-wash        position: fixed    z-index: 0    Background gradient engine
Layer 1 — .doodle-layer   position: fixed    z-index: 1    Ambient floating elements
Layer 2 — .scroll-content position: relative z-index: 2    All text beats + food sketches
```

`.scroll-content` gets `scrollY * 0.04` translateY via RAF parallax — identical to Ch2.

---

## Beat Structure

| ID | Text | Reveal style | Notes |
|---|---|---|---|
| `beat1` | "We started simple." | Standard, 0.85s | Single line, weight 600 |
| `beat2` | Chat bubbles: "Jokes." / "Teasing." | Slide from L + R, 200ms stagger | Sketch pill shapes |
| `beat3` | "A suspicious amount of jokes." | Standard, 1.0s | Italic, smaller — comedic aside |
| `beat4` | "There were nights that just didn't end." | Standard, 0.85s | Weight 400, factual, slightly surprised |
| `beat5` | "Not because of insomnia. / Because of you." | Standard, 400ms line stagger | Second line delayed — the reveal |
| `beat6` | "We smelled tree leaves / like we were doing something illegal." | Standard, 200ms stagger | Second line italic, let it be funny |
| `beat7` | "*(We were not.)*" | Standard, 0.8s | Tiny, italic, centered aside — the wink |
| `beat8` | "The small talks." | Standard, 0.85s | Weight 500, naming the thing |
| `beat9` | "The 'how was your day' / that somehow unpacked everything." | Standard, gentle stagger | Weight 400, these words did real work |
| `beat10` | "The kind that makes a long day / feel like it was worth it." | Standard, 1.1s | Slower — earns the extra second |
| `beat11` | "You're my little ritual shelter." | Standard, 1.0s | Weight 600, centered, no flourish — just lands |
| `beat12` | Food table + arrows (Scene B) | Scene transition trigger | Background warms, food pops in |
| `beat13` | "👉👈 / *(you know what I mean)*" | Standard, 200ms stagger | Arrows activate on beat12 |
| `beat14` | "You laughed." | `laughReveal` keyframe | Terracotta, largest font, bloom + sparkle burst |
| `beat15` | "You smiled." | Standard, 0.9s | Weight 500, the exhale after the burst |
| `beat16` | "You coddled." | Standard, 1.0s | Italic, quiet, warm |
| `beat17` | "And your eyes did that thing…" | Standard, 1.1s | Desaturated #5A5A5A, earns the ellipsis |
| `beat18` | "where they ✦spark✦ / a little more than necessary." | Standard + JS sparkle burst | "spark" glows, particles fire once |

IntersectionObserver (identical to Ch2):
```javascript
{ threshold: 0.18, rootMargin: '0px 0px -40px 0px' }
// unobserve() immediately after .visible added
```

---

## CSS Keyframes

### Standard reveal (reused from Ch2)
```css
.beat {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.85s cubic-bezier(0.22, 0.61, 0.36, 1),
              transform 0.85s cubic-bezier(0.22, 0.61, 0.36, 1);
}
.beat.visible { opacity: 1; transform: translateY(0); }
```

### Chat bubble slide-in
```css
@keyframes bubbleFromLeft {
  from { opacity: 0; transform: translateX(-28px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes bubbleFromRight {
  from { opacity: 0; transform: translateX(+28px); }
  to   { opacity: 1; transform: translateX(0); }
}
/* duration: 0.7s, ease-out, fill: forwards */
/* .bubble-left / .bubble-right — sketch pill shape, no character attribution */
```

### Phone glow pulse (Scene A bg)
```css
@keyframes glowPulse {
  0%, 100% { opacity: 0.12; }
  50%       { opacity: 0.24; }
}
/* Radial gradient overlay at center of screen */
/* duration: 4s, ease-in-out, infinite */
```

### Food item pop-in (Scene B)
```css
@keyframes foodPop {
  0%   { opacity: 0; transform: scale(0.7) translateY(10px); }
  70%  { opacity: 1; transform: scale(1.05) translateY(-2px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}
/* Each food sketch staggered: 0ms / 150ms / 300ms / 450ms */
/* duration: 0.6s, ease-out, fill: forwards */
```

### Ramen steam
```css
@keyframes steamRise {
  0%   { opacity: 0.6; transform: translateY(0)    scaleX(1);   }
  50%  { opacity: 0.3; transform: translateY(-6px)  scaleX(1.3); }
  100% { opacity: 0;   transform: translateY(-14px) scaleX(0.8); }
}
/* 3 SVG path wisps per bowl — no image asset needed */
/* Durations: 2.0s / 2.3s / 2.6s, infinite, staggered start */
```

### Arrow ping (👉👈 — both converge INWARD)
```css
/* → arrow: sits left of center, nudges RIGHT toward center */
@keyframes arrowPingLeft {
  0%   { transform: translateX(0)    rotate(-4deg); opacity: 0.55; }
  35%  { transform: translateX(+8px) rotate(-2deg); opacity: 0.9;  }
  100% { transform: translateX(0)    rotate(-4deg); opacity: 0.55; }
}
/* ← arrow: sits right of center, nudges LEFT toward center */
@keyframes arrowPingRight {
  0%   { transform: translateX(0)    rotate(4deg); opacity: 0.55; }
  35%  { transform: translateX(-8px) rotate(2deg); opacity: 0.9;  }
  100% { transform: translateX(0)    rotate(4deg); opacity: 0.55; }
}
/* Periods: 1.6s vs 1.85s — never peak in sync, never quite touch */
/* Layout: .arrow-left renders → and .arrow-right renders ← */
/* Both centered, ~24px apart — the 👉👈 pair */
/* Activated via: .beat4.visible .arrow { animation-play-state: running; } */
```

### "You laughed." bloom
```css
@keyframes laughReveal {
  0%   { opacity: 0; transform: scale(0.88) translateY(16px); letter-spacing: -0.02em; }
  55%  { opacity: 1; transform: scale(1.04) translateY(-3px); letter-spacing: 0.05em;  }
  75%  {             transform: scale(1.01) translateY(-1px); letter-spacing: 0.025em; }
  100% { opacity: 1; transform: scale(1)   translateY(0);    letter-spacing: 0.01em; }
}
/* duration: 1.1s, cubic-bezier(0.22, 0.61, 0.36, 1) */
/* color: #D4756B, font-size: clamp(32px, 4vw, 52px), weight: 700 */
```

### Sparkle burst (JS — fires once on beat8)
```css
@keyframes sparkleFly {
  0%   { opacity: 0; transform: translate(0,0) scale(0.2) rotate(0deg); }
  25%  { opacity: 1; transform: translate(var(--sx), var(--sy)) scale(1.15) rotate(var(--sr)); }
  70%  { opacity: 0.7; }
  100% { opacity: 0; transform: translate(var(--sx2), var(--sy2)) scale(0.3) rotate(var(--sr2)); }
}
```
```javascript
function launchSparkles(triggerEl) {
  const rect = triggerEl.querySelector('.spark-word').getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const colors = ['#FFD3B6', '#E6E6FA', '#A8D8EA'];
  const chars  = ['✦','✧','✦','✧','✦','✧','✦'];

  chars.forEach((char, i) => {
    const el = document.createElement('span');
    const angle = (i / chars.length) * 360 + Math.random() * 30;
    const dist  = 35 + Math.random() * 40;
    const rad   = angle * Math.PI / 180;
    el.textContent = char;
    el.className = 'sparkle-particle';
    el.style.cssText = `
      position:fixed; left:${cx}px; top:${cy}px;
      font-size:${[10,14,18,14,10,18,12][i]}px;
      color:${colors[i % 3]};
      --sx:${Math.cos(rad)*dist}px; --sy:${Math.sin(rad)*dist}px;
      --sx2:${Math.cos(rad)*dist*1.4}px; --sy2:${Math.sin(rad)*dist*1.4+10}px;
      --sr:${Math.random()*360}deg; --sr2:${Math.random()*720}deg;
      animation: sparkleFly ${1.0+Math.random()*0.4}s ${i*80}ms forwards;
      pointer-events:none; z-index:99;
    `;
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  });
}
```

### Ambient sparkle (lingers after burst)
```css
@keyframes ambientTwinkle {
  0%, 100% { opacity: 0.15; transform: scale(0.8); }
  50%       { opacity: 0.55; transform: scale(1.1); }
}
/* Two instances near .spark-word: 2.4s and 3.1s — never blink in sync */
```

---

## Background Warmth Progression

```javascript
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      document.body.dataset.scrollZone =
        pct < 0.20 ? '0' : pct < 0.40 ? '1' : pct < 0.65 ? '2' : pct < 0.78 ? '3' : '4';
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });
```

```css
.bg-wash { transition: background 2.2s ease-in-out; }

/* Scene A — Night */
body[data-scroll-zone="0"] .bg-wash {
  background: linear-gradient(180deg, #1A1F3A 0%, #2A1F2E 60%, #1A1520 100%);
}
body[data-scroll-zone="1"] .bg-wash {
  background: linear-gradient(180deg, #1A1F3A 0%, #2E2040 60%, #1A1520 100%);
}
/* Scene B — Restaurant */
body[data-scroll-zone="2"] .bg-wash {
  background: linear-gradient(160deg, #FFF3E0 0%, #FFE0B2 50%, #FFCCBC 100%);
}
/* Scene C — Peak warmth */
body[data-scroll-zone="3"] .bg-wash {
  background: linear-gradient(160deg, #FFBFA0 0%, #FFD3B6 50%, #FFB880 100%);
}
/* Scene C — Soft landing */
body[data-scroll-zone="4"] .bg-wash {
  background: linear-gradient(160deg, #FFD3B6 0%, #F0E8FF 50%, #FFD3B6 100%);
}
```

---

## Floating Doodle Layer

Fixed overlay. Elements fade in on `DOMContentLoaded` with staggered delays (800 / 1200 / 1600 / 2000 / 2400ms). Each fades in over 1.5s.

| Element | Position | Visual | Keyframe | Period |
|---|---|---|---|---|
| Arrow pair | 12% / 8% | `→ ←` pair, amber 18% opacity, tiny | diagonal drift ±6px / ±5px | 7s alternate |
| Sparkle pair | 85% / 15% | 2× `✦`, lavender 22% opacity | opacity 0.18→0.45 | 5s |
| Ramen bowl | 90% / 55% | Inline SVG sketch, 15% opacity | float ±10px vertical | 9s alternate |
| Heart (unlocks beat6) | 7% / 75% | `♡`, 14px, pink 20% opacity | float ±14px + ±8° rotate | 6s alternate |
| Dot scatter | 45%/28%, 58%/62% | 2× 6px circle, sky blue | orbit 15px radius | 12s linear |

Heart: `opacity: 0` until beat6 fires → JS adds `.unlocked` class → fades in over 1s.

---

## Assets Plan — Nano-Banana Generation Queue

**Style lock (apply to ALL assets):**
> Pencil sketch with soft watercolor wash. Visible pencil texture, slightly imperfect hand-drawn lines. No smooth digital gradients. No characters, no faces, no people. No text, labels, or numbers anywhere in the image. Warm, intimate, cinematic. Consistent with a hand-illustrated storybook aesthetic.

**Negative prompt (apply to ALL assets):**
> text, labels, numbers, letters, characters, people, faces, anime style, 3D render, photography, smooth gradients, flat design

---

### SCENE A — BACKGROUNDS

---

**A1 — `bg_night_room.png`**
Used for: beats 1–11 (entire Scene A backdrop)
Layer: fixed background, z-index 0
Animation role: static backdrop; CSS gradient overlaid on top for warmth progression

> A cozy, intimate bedroom or small study at night. A smartphone lies face-up on a wooden surface — its screen casting a soft amber glow upward onto the ceiling and nearby wall. The room is dim; only the phone and a small lamp far in the background provide light. A single window is visible to one side, dark outside with a faint suggestion of stars. A rumpled blanket or pillow sits at the edge of frame. Wide landscape composition. Deep navy and warm amber tones. Pencil sketch with soft watercolor wash. No characters, no faces, no text.

---

**A2 — `phone_screen_glow.png`**
Used for: beats 1–3 (phone glow overlay, Scene A intro)
Layer: scroll-content overlay, semi-transparent, above A1
Animation role: fades in at chapter start; `glowPulse` keyframe pulses opacity

> Close-up pencil sketch of a smartphone screen viewed from slightly above. The screen is lit with a warm amber-white glow, showing the faint outline of a chat interface — soft empty pill-shaped bubble outlines visible, no readable text inside. The glow spills outward softly onto the surface below. Transparent background outside the glow halo. Soft, warm, intimate. Pencil sketch + light watercolor. No text, no faces.

---

**A3 — `window_stars_sparse.png`**
Used for: beats 4–5 ("nights that didn't end" — early in the night)
Layer: positioned overlay inside scroll-content at the relevant beat
Animation role: cross-fades to A4 as stars multiply

> A simple rectangular window frame, pencil sketched, set in a dark wall. Through the glass: a deep blue-black night sky with only 8–10 small faint white dot-stars scattered sparsely. The window frame has a faint warm inner edge (interior light reflected slightly). Quiet and early-night. Simple composition. Pencil sketch line work with minimal watercolor. Transparent or very dark background outside the window frame. No characters, no faces, no text.

---

**A4 — `window_stars_deep.png`**
Used for: beat 5 onward ("Because of you" — deep into the night)
Layer: same as A3, cross-fades over it
Animation role: swaps in via CSS opacity transition when beat5 fires

> Identical window frame and composition as A3 — same dimensions, same frame style, same wall. Through the glass: a much richer, deeper night sky with 35–40 stars, some in small clusters, some larger and brighter. The sky feels like 3am. A very faint suggestion of moonlight glow off to one side. This is the same window, much later in the night. Pencil sketch. Transparent background outside the frame. No characters, no faces, no text.

---

**A5 — `bg_tree_path_night.png`**
Used for: beats 6–7 ("We smelled tree leaves…")
Layer: replaces night room background for this beat section, fades in/out
Animation role: slides up from below or cross-fades as beat6 enters viewport

> A quiet outdoor path or sidewalk at night, viewed from pedestrian eye-level. Overhanging tree branches above — leaves catching the warm glow of distant streetlights, backlit and glowing amber-gold at their edges. The path stretches ahead with dappled pools of light and shadow. A streetlamp in the mid-distance casts warm amber light. On a low wall or railing at one side, two takeaway paper cups (drinks) sit together — suggesting two people stopped here. No people visible, no faces. Wide landscape composition. Pencil sketch with warm amber and cool blue-green contrast, light watercolor wash. No text.

---

**A6 — `leaves_closeup.png`**
Used for: beats 6–7 (foreground detail during tree leaves beat)
Layer: floating overlay element, positioned decoratively near the beat text
Animation role: fades in with beat6; gentle float animation

> A close-up cluster of 5–7 tree leaves (maple or ginkgo-like), pencil sketched in fine detail. The leaves are backlit by a soft amber streetlight glow — translucent, with leaf veins clearly visible, edges glowing warm gold. One or two leaves are slightly curled. Dark/transparent background. The leaves feel fragrant. Pencil sketch + delicate watercolor. Transparent background (PNG). No text, no characters.

---

**A7 — `comfort_objects.png`**
Used for: beats 8–10 ("The small talks…" section)
Layer: wide decorative overlay behind the text, low opacity (~35%), fades in
Animation role: soft float animation, ±6px vertical drift, 8s

> A loose, casual arrangement of small everyday comfort objects scattered on a soft surface — the kind of things that live on a bedside table during a late-night conversation. Items: a warm ceramic mug with a wisp of steam, a pair of wireless earphones or earphones case, a small snack wrapper (crackers or chocolate), a half-folded notebook, a pen resting on it, a tiny plant in a pot. The arrangement is slightly messy and very human. Warm lamplight. Pencil sketch, transparent background. No text visible on any objects. No faces.

---

**A8 — `ritual_shelter_visual.png`**
Used for: beat 11 ("You're my little ritual shelter.")
Layer: full-bleed background that fades in just for this beat, replaces/overlays night room
Animation role: fades in slowly (1.5s) when beat11 enters viewport; breathes with a very slow scale 1→1.008 loop

> A small glowing window seen from OUTSIDE at night. Just a wall and one lit window — a corner room. Through the glass, warm amber-golden light inside, the faint silhouette of curtains. The surrounding darkness is deep blue-black, making the warm glow feel even more precious. The mood is: safe, quiet, always there, a place you can return to. No people visible inside. Portrait/vertical composition, window centered. Pencil sketch + watercolor. Strong contrast between warm interior glow and cool dark exterior. No text, no faces.

---

### SCENE B — BACKGROUNDS & PROPS

---

**B1 — `bg_restaurant_table.png`**
Used for: beats 12–13 (entire Scene B backdrop)
Layer: fixed background, replaces night bg as scroll zone changes
Animation role: static backdrop; individual food props animate on top

> Overhead (top-down, bird's-eye) view of a restaurant table. Wooden table surface with visible grain texture. The table is completely bare — no food yet. Warm golden restaurant lighting casts soft shadows. The composition fills the frame edge-to-edge. Wood grain is detailed and slightly imperfect. Pencil sketch + warm watercolor wash. No text, no faces, no characters. Landscape orientation.

---

**B2 — `ramen_bowl.png`**
Used for: beat 12 (pops in first, the anchor food item)
Layer: positioned on top of B1, left-center of table composition
Animation role: `foodPop` keyframe on beat12, then `steamRise` SVG wisps above it

> A single large ramen bowl viewed from slightly above, pencil sketched in beautiful food-illustration style. Rich golden-amber broth, a soft-boiled egg halved showing jammy yolk, noodles curling up at the surface, two slices of pork belly chashu, green onions, a square of nori. The bowl is generous and full. Warm watercolor wash — ivory, amber, soft brown tones. Transparent background. Very detailed, lovingly drawn. No text on the bowl. No characters.

---

**B3 — `ramen_bowl_2.png`**
Used for: beat 12 (second bowl, pops in 150ms after first)
Layer: positioned right-center on table
Animation role: same `foodPop` with 150ms delay

> A second ramen bowl — same style as B2 but slightly different arrangement: the egg is whole (not halved), extra green onions, a different arrangement of noodles visible at the surface. Same warm illustration style, same transparent background. Shows the table is for two people.

---

**B4 — `side_dishes.png`**
Used for: beat 12 (pops in 300ms after first)
Layer: lower portion of table composition
Animation role: `foodPop` with 300ms delay

> Three small side dish plates (banchan/appetizers style), pencil sketched, arranged slightly overlapping as if just set on a restaurant table. One plate with gyoza/pan-fried dumplings with dipping sauce pool. One small bowl with pickled vegetables (kimchi or daikon). One tiny empty sauce dish with a spoon resting in it — already used. The empty dish is a small human detail. Warm sketch style, transparent background. No text, no faces.

---

**B5 — `boba_drink.png`**
Used for: beat 12 (pops in last, 450ms delay)
Layer: upper corner of table composition
Animation role: `foodPop` with 450ms delay; subtle slow condensation drip animation via CSS

> A takeaway bubble tea cup, pencil sketched. Large round pearls visible through the lower transparent part of the cup. A wide straw. The cup is slightly condensating — a few water droplets on the exterior. Warm colors, transparent background. No text or branding on the cup. Simple and charming.

---

**B6 — `chopsticks_pair.png`**
Used for: beat 12 ambient, resting across one of the bowls
Layer: overlay on top of B2
Animation role: static, appears with the bowl

> A pair of wooden chopsticks, slightly used — one resting atop the other at a slight off-parallel angle, as if just set down mid-meal. A tiny noodle strand clings to one tip. Pencil sketch, light watercolor. Transparent background. Simple, real, warm.

---

### SCENE C — ATMOSPHERE ELEMENTS

---

**C1 — `laugh_burst.png`**
Used for: beat 14 ("You laughed." — the bloom beat)
Layer: appears behind the text as it blooms, centered on screen
Animation role: fades in with laughReveal (0.8s delay), then slowly fades out over 3s

> An abstract illustration: concentric rings of loose, imperfect curved lines radiating outward from a central point — like the visual of a sound wave or a laugh as energy. The lines are sketch-style, slightly wobbly, human. Color palette: warm terracotta (#D4756B) and soft peach (#FFD3B6). Small doodle accents scattered in the outer rings — tiny dots, short curves, small circles. Center is brightest and most dense, edges dissolve into transparency. Transparent background. Full composition filling the frame. No characters, no faces, no text.

---

**C2 — `warm_glow_soft.png`**
Used for: beats 15–16 ("You smiled." / "You coddled." section)
Layer: full-bleed semi-transparent overlay (opacity ~25%), behind text
Animation role: fades in gently with beat15; very slow scale 1→1.015 breathing, 4s loop

> A soft, abstract pool of warm golden-amber light — like the glow of a candle or a warm lamp seen through closed eyes. The light forms an irregular, gently radiating circle that fills most of the frame. Edges dissolve very softly into transparency. Pure watercolor wash — no sketch lines, no objects. Warm amber and honey gold tones. Transparent background outside the glow. No characters, no objects, no text. Just warmth.

---

**C3 — `eyes_spark_motif.png`**
Used for: beats 17–18 ("And your eyes did that thing… / where they spark")
Layer: appears behind the text, centered, fades in with beat17
Animation role: very subtle scale pulse 1→1.02, 3s loop; sparkle burst fires on top of this

> Two almond-shaped eye outlines (just the eye shape — no face, no nose, no eyebrows, no lashes), pencil sketched, side by side like a pair of eyes looking forward. The eyes are simple, slightly stylized, gentle. Around each eye: 3–4 tiny hand-drawn star/sparkle shapes in varied sizes — some near the outer corner, some floating just above. Color palette: soft lavender (#E6E6FA) and warm gold (#FFB347). The overall mood: someone whose eyes smile more than they mean to. Pencil sketch. Transparent background.

---

### SPRITE SEQUENCES

---

**S1 — `sprites/stars_multiplying/` (4 frames)**
Used for: beat 4–5 ("nights that didn't end" — stars grow as time passes)
Animation role: 4-frame cross-fade sequence, each frame held 1.2s, triggered when beat4 fires

Generate 4 images — all with **identical window frame, identical wall, identical composition**. Only the sky inside changes:

> **frame1.png** — 8 stars, sparse, early evening. Same window as A3.
> **frame2.png** — 16 stars, slightly denser. Same window. One small cluster forming.
> **frame3.png** — 26 stars, clearly late night. Small clusters. A faint Milky Way suggestion.
> **frame4.png** — 38+ stars, deep night, 3am feeling. Slight moonlight glow at upper left corner. One very bright star near center.

Style: identical to A3/A4 — pencil sketch window frame, transparent outside. Each frame MUST have the same window dimensions and position so they cross-fade seamlessly.

---

**S2 — `sprites/leaves_swaying/` (6 frames)**
Used for: beats 6–7 (background animation over A5 tree path)
Animation role: 6-frame loop at 12fps, plays continuously while A5 is visible

Generate 6 images — all **identical to A6 (leaves closeup) in composition**. Each frame shifts individual leaves by ≤2px position and ≤2° rotation only. No new leaves, no color changes.

> **frame1.png** — base position (identical to A6)
> **frame2.png** — leaves shift +1° rotation, +1px right drift
> **frame3.png** — leaves shift +2°, +1px up
> **frame4.png** — leaves shift +1° back, return to near-base
> **frame5.png** — leaves shift −1°, −1px left
> **frame6.png** — return to near frame1 for seamless loop

All frames: identical background, identical leaf count and type. Only micro-motion per frame.

---

### AMBIENT DOODLES (floating layer)

Small assets for the fixed doodle overlay layer. All transparent background, all pencil sketch style.

---

**D1 — `doodles/leaf_tiny.png`**
> A single small leaf, pencil sketched, clean and simple. Maple or ginkgo-like shape. Warm amber-green tone with slight watercolor. Approximately 80×80px visual weight. Transparent background.

**D2 — `doodles/ramen_tiny.png`**
> A tiny, simplified ramen bowl sketch — simplified version of B2. Round bowl shape, few noodles peeking out, one tiny steam wisp. Warm tones. Approximately 80×80px. Transparent background.

**D3 — `doodles/phone_tiny.png`**
> A tiny smartphone, pencil sketched, screen gently glowing amber. Simple rounded rectangle with a glowing screen face. Approximately 60×100px visual weight. Transparent background.

**D4 — `doodles/chat_bubbles_tiny.png`**
> Two small overlapping chat bubble outlines — one pointing left, one pointing right — like a conversation in miniature. Pill shapes, slightly sketchy lines. Off-white/cream tone. Approximately 100×60px. Transparent background.

**D5 — `doodles/sparkle_cluster.png`**
> A loose cluster of 5 small sparkle/star shapes (✦ style) in varied sizes, pencil sketched. Lavender and warm gold tones. Approximately 90×90px. Transparent background.

---

### ASSET SUMMARY

| ID | Filename | Scene | Role |
|---|---|---|---|
| A1 | `backgrounds/bg_night_room.png` | Scene A | Main backdrop |
| A2 | `backgrounds/phone_screen_glow.png` | Scene A | Overlay, glow pulse |
| A3 | `backgrounds/window_stars_sparse.png` | Scene A | Beat 4 window |
| A4 | `backgrounds/window_stars_deep.png` | Scene A | Beat 5 window cross-fade |
| A5 | `backgrounds/bg_tree_path_night.png` | Scene A | Beat 6–7 backdrop |
| A6 | `backgrounds/leaves_closeup.png` | Scene A | Beat 6–7 float element |
| A7 | `backgrounds/comfort_objects.png` | Scene A | Beat 8–10 ambient overlay |
| A8 | `backgrounds/ritual_shelter_visual.png` | Scene A | Beat 11 backdrop |
| B1 | `backgrounds/bg_restaurant_table.png` | Scene B | Main backdrop |
| B2 | `props/ramen_bowl.png` | Scene B | Pop-in food item |
| B3 | `props/ramen_bowl_2.png` | Scene B | Pop-in food item |
| B4 | `props/side_dishes.png` | Scene B | Pop-in food item |
| B5 | `props/boba_drink.png` | Scene B | Pop-in food item |
| B6 | `props/chopsticks_pair.png` | Scene B | Static overlay |
| C1 | `effects/laugh_burst.png` | Scene C | Beat 14 burst effect |
| C2 | `effects/warm_glow_soft.png` | Scene C | Beat 15–16 atmosphere |
| C3 | `effects/eyes_spark_motif.png` | Scene C | Beat 17–18 backdrop |
| S1 | `sprites/stars_multiplying/frame1–4.png` | Scene A | Beat 4–5 sprite |
| S2 | `sprites/leaves_swaying/frame1–6.png` | Scene A | Beat 6–7 sprite |
| D1 | `doodles/leaf_tiny.png` | All | Ambient float |
| D2 | `doodles/ramen_tiny.png` | All | Ambient float |
| D3 | `doodles/phone_tiny.png` | All | Ambient float |
| D4 | `doodles/chat_bubbles_tiny.png` | All | Ambient float |
| D5 | `doodles/sparkle_cluster.png` | All | Ambient float |

**Total: 24 images** (19 single images + 4 sprite frames + 6 sprite frames — actually 29 files total including sprite sequences)

---

## Build Order

```
1. Scaffold HTML         — 3 scene sections, beat divs, fixed bg + doodle layers
2. Background system     — CSS gradient stops + scroll zone JS
3. Scene A               — Night styling, chat bubbles, phone glow, stars (SVG dots)
4. Scene B               — Food sketches (SVG), steam animation, arrows
5. Scene C               — laughReveal, sparkle JS, ambient twinkle, "spark" glow
6. Doodle layer          — 5 ambient elements, staggered fade-in
7. Polish                — Timing, scroll boundary check, mobile test
8. Optional bg images    — Drop in if CSS scenes feel too bare
```

---

## Verification Checklist

- [ ] Each beat reveals cleanly on scroll — no jump, no flicker
- [ ] Background: dark navy at top → golden at ~40% scroll → peach at ~65% → lavender at ~78%
- [ ] Night → Day transition (Scene A→B): smooth, reads as a scene cut
- [ ] Chat bubbles: left and right alternate correctly, 200ms stagger feels conversational
- [ ] Arrow ping: left and right never peak simultaneously (1.6s vs 1.85s check)
- [ ] Steam: 3 staggered wisps per bowl, continuous, subtle (not distracting)
- [ ] "You laughed." bloom: text breathes in then opens — scale, letter-spacing, terracotta color
- [ ] Sparkle burst: 7 particles fire once on beat8, disappear cleanly on animationend
- [ ] "spark" word glows warm amber on .visible
- [ ] Ambient sparkles: 2 near "spark", pulsing at different periods, linger forever
- [ ] Heart doodle: invisible before beat6, fades in quietly after
- [ ] Mobile: clamp() font sizes legible, chat bubbles don't overflow
