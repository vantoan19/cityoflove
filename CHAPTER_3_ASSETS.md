# CHAPTER 3 — ASSET INVENTORY
## "The Night That Almost Didn't Happen"

> **Supersedes** the Ch3 section in `WEBSITE_PLAN.md`:
> - Parallax: was "None" → now **2-layer night parallax** (back: `chapter3/backgrounds/sky.png` starry night; front: `chapter3/backgrounds/city.png` with mountains, river, bank, and flowers all baked in) + dynamic overlays for star twinkle, sweeping searchlight beams, window "bling," river shimmer, and fireflies
> - Prop: was heart-shaped box + 4 chocolates → now **rectangular box with 8 chocolate bars**
> - Interaction: was 4 dialogue beats → now per-bar hover + unwrap sequence with 8 beats
>
> **Visual reference:** `chapter3/backgrounds/sky.png` + `chapter3/backgrounds/city.png` — the two layers that build the night scene. Detailed layer specs:
> - [`chapter3/backgrounds/SKY_LAYER.md`](chapter3/backgrounds/SKY_LAYER.md) — starry night
> - [`chapter3/backgrounds/CITY_LAYER.md`](chapter3/backgrounds/CITY_LAYER.md) — city bling, river shimmer, big searchlight beams

All assets follow the existing design system: crayon-sketch lines, warm paper base (`#F5EFE0`), ink outlines (`#2A2118`), handwritten wobble, slight rotation, ~3px crayon stroke.

---

## TABLE OF CONTENTS

1. [Parallax Background — 6 layers](#1-parallax-background)
2. [Ambient Scene Animations](#2-ambient-scene-animations)
3. [Character Poses & Animations — Nick](#3-nick--poses--animations)
4. [Character Poses & Animations — Judy](#4-judy--poses--animations)
5. [Chocolate Box (container)](#5-chocolate-box-container)
6. [8 Chocolate Bar Designs](#6-chocolate-bar-designs-8)
7. [Hover Animation (per bar)](#7-hover-animation)
8. [Unwrap Animation (per bar)](#8-unwrap-animation)
9. [Message Reveal Animation](#9-message-reveal-animation)
10. [Final Lock-Break Animation](#10-final-bar-lock-break)
11. [Full asset checklist](#asset-checklist)

---

## 1. PARALLAX BACKGROUND

Chapter 3 takes place **at night, across the river from the Zootopia skyline**. The parallax is **two static painted layers** with animated overlays on top:

- **Back:** `chapter3/backgrounds/sky.png` — starry night (cloud wisps, Milky Way band, star field)
- **Front:** `chapter3/backgrounds/city.png` — mountains + city + river + bank + flowers, all baked in, with a transparent upper region so the sky shows through

Full per-layer specs and animation details:
- [`chapter3/backgrounds/SKY_LAYER.md`](chapter3/backgrounds/SKY_LAYER.md)
- [`chapter3/backgrounds/CITY_LAYER.md`](chapter3/backgrounds/CITY_LAYER.md)

### Layer 1 — Starry Sky (`chapter3/backgrounds/sky.png`)
**Already drawn and approved.** Deep cobalt indigo canvas with a painted star field, a faint Milky Way band running diagonally upper-left to lower-right, and pale lavender cloud wisps in the upper corners. Full-bleed. Paper grain, hand-painted feel.

Animation on top: star twinkle (SVG overlay), very subtle Milky Way brightness pulse (CSS), slow horizontal drift (CSS). See §2.1.

### Layer 2 — City + Foreground (`chapter3/backgrounds/city.png`)
**Already drawn and approved.** A single painting containing everything below the sky:
- Mountain silhouettes (left third)
- Zootopia skyline (center-right) with hero spire, lit windows, neon light-rail ribbon
- River with vertical reflection streaks in amber/magenta/teal/cyan + tiny rowboat
- Stone bank and pier railing (lower-left)
- Wildflower and tall-grass fringe along the foreground

Upper portion is transparent PNG so `sky.png` shows through behind the skyline.

Animation on top: **big sweeping searchlight beams** from the hero spire, "bling-bling" window sparkles, **floating/shimmering river**, and drifting fireflies. See §2.2–§2.5.

### Character & prop placement (above `city.png`, below the foreground flowers)
- **Nick** — left-center, feet on the painted bank
- **Judy** — right-center, feet on the painted bank
- **Chocolate box** — mid-foreground between them

Characters sit *inside* the painting's composition: the painted flower fringe at the very bottom reads as slightly in front of their shins. Scale ~75% of Ch1 size — the sky + city are doing the heavy emotional lift.

### Parallax speeds
| Layer | Scroll speed | Notes |
|---|---|---|
| 1 Sky (`sky.png` + stars overlay) | 5% | slowest — sky feels distant |
| 2 City (`city.png` + beams/bling/river/ripples overlays) | 40% | painted mid/foreground |
| Characters + box | 50% | a touch faster — they feel "on camera" |
| Fireflies | 45% | weave between city and characters |

---

## 2. AMBIENT SCENE ANIMATIONS

All loop continuously, independent of scroll or dialogue. Goal: the sky **shimmers** with starlight, and the city **blings** with movement — warm window glow, sweeping searchlights, and a river that feels alive.

Full implementation details live in [`SKY_LAYER.md`](chapter3/backgrounds/SKY_LAYER.md) and [`CITY_LAYER.md`](chapter3/backgrounds/CITY_LAYER.md). This section is the summary.

### 2.1 Starry sky twinkle (`sky_overlays/stars.svg`)
SVG on top of `sky.png` with ~40 discrete `<circle>` stars placed over the brightest painted spots.
- **Group A (14 stars):** `opacity: 0.5 → 1.0 → 0.5`, 2.8s loop
- **Group B (14 stars):** 3.6s loop, offset start 1.3s
- **Group C (12 stars):** 4.4s loop, offset start 2.2s
- **5 hero stars:** add `scale(1 → 1.2 → 1)` at twinkle peak + a 4-point cream cross-flare

Plus two CSS-only effects on `sky.png` itself: a **Milky Way brightness pulse** (`filter: brightness(0.95 → 1.05)` over 10s) and a very slow **horizontal drift** (`background-position: 0 → 30px → 0` over 45s) for an imperceptible air-current feel.

### 2.2 Big searchlight beams (`city_overlays/beams.svg`) — signature effect
Three LARGE cream-white conical beams anchored at the hero spire's top, sweeping across the sky. User-requested, intentionally oversized.
- **Beam 1:** `rotate(-18° → 18° → -18°)` over 9s ease-in-out
- **Beam 2:** `rotate(-25° → 15° → -25°)` over 13s (wider, slower)
- **Beam 3:** `rotate(-8° → 22° → -8°)` over 7s
- Each beam has its own opacity pulse (`0.30–0.70` range, 3–5s period, unsynced) — real xenon feel.

Z-order: above `city.png`, below characters (so beams feel like they're far across the river).

### 2.3 City window "bling" (`city_overlays/window_sparkles.png`)
The painted lit windows get warm-gold glow dots positioned over the brightest clusters (~30 dots).
- Each dot: `opacity: 0.2 → 1.0 → 0.2`, 4–7s period (randomized), offset randomized
- 2 "TV-glow" dots: rapid flicker burst every ~20s
- A sparkle-cross accent (reuses `sparkle_cross.png`) scale-fades at a random dot every ~8s — the diamond-glint "bling" moment

### 2.4 Floating river shimmer (`city_overlays/river_shimmer.svg`)
SVG displacement filter applied to a clipped river region of `city.png`:
- `feTurbulence` + `feDisplacementMap` with animated `scale: 2 → 6 → 2` over 3s
- Hero-spire magenta reflection gets a second, stronger filter (`scale: 3 → 8`)
- Optional 3 ripple rings (`city_overlays/ripples.svg`): `scale(0.3 → 1.4)` + `opacity(0.7 → 0)` over 2.5s, staggered, pausing 4–8s between loops

### 2.5 Fireflies (`city_overlays/firefly.png`)
5–6 tiny warm dots (`#F5D06A`, 4px + soft halo) drifting over the bank/foreground on slow curving Bézier paths over 14–20s each. `opacity: 0 → 1 → 0` per trip. Staggered so 2–3 are visible at any moment.

### 2.6 Nick + Judy idle (subtle)
- Breathing `scale(1 → 1.012 → 1)`, staggered 2s
- Every ~12s: a quick glance at each other (`scaleX(-0.97)` over 0.4s). Suppressed during hover/unwrap.
- Every ~18s: one of them (alternating) briefly looks up at the sky — `translateY(1px)` + head-tilt overlay ~500ms. Sells the "watching this view together" mood.

---

## 3. NICK — POSES & ANIMATIONS

Chapter 3 uses **6 Nick poses**, 4 reused from existing assets and **2 new frames** drawn specifically for this chapter. Plus one multi-frame micro-animation.

### 3.1 Reused from existing library
| Pose | Source file | Ch3 usage |
|---|---|---|
| Neutral standing | `Apr 19 01_51_44 PM` | default / between bars |
| Presenting open palm | `Apr 20 01_39_01 AM` | "stay a bit longer" bar |
| Pointing up smiling | `Apr 20 01_40_20 AM` | "I missed you" bar |
| Shrugging both hands | `Apr 20 01_42_58 AM` | "almost didn't happen" bar |
| Double thumbs up + sparkles | `Apr 20 01_58_26 AM` | final "notification" bar |

### 3.2 NEW — Nick leaning in (`nick_leaning.png`)
- **Purpose:** played when the user hovers any chocolate bar — Nick leans toward the box curiously
- **Pose description:** Body tilted forward ~15° from hip, one hand resting on the (implied) table edge, other hand slightly raised palm-up as if about to gesture, head angled down toward the box, eyes visible over the sunglasses (glasses slightly pushed down the muzzle), mouth closed in a small interested smile, ears forward-angled, tail curled comfortably behind
- **Why:** sunglasses-pushed-down is a signature "I'm actually paying attention" Nick tell — keeps character consistency

### 3.3 NEW — Nick hand-on-heart (`nick_heart.png`)
- **Purpose:** played on the final (locked) bar reveal — quiet sincere beat
- **Pose description:** Standing upright, right hand flat over left chest (paw, not a cheesy cartoon heart), left arm loose at side, head tilted slightly down and left, soft closed-mouth smile (genuine, not grinning), eyes soft and direct (not squinting), ears relaxed not perked, tail still — not wagging
- **Why:** the whole Ch3 builds to this beat; it deserves a pose the rest of the site doesn't have

### 3.4 Nick chuckle micro-animation (used on bars #4 and #6)
Small 3-frame animation overlaying the current pose — drawn as 3 head-only variants that swap in for 0.9s total, then return to the held pose.

| Frame | Duration | Description | Diff from previous |
|---|---|---|---|
| **chuckle-1** | 300ms | Head in normal position, mouth closed small smile | (baseline) |
| **chuckle-2** | 300ms | Head tilted back ~6°, eyes closed into happy crescents, mouth open in a soft "heh" shape (short, not a full laugh) | Head rotates up 6°, eyes close, mouth opens |
| **chuckle-3** | 300ms | Head returning — halfway back down (~3°), mouth half-closed, eyes still softened but slightly open | Head rotates down 3°, eyes reopen slightly, mouth closing |

Playback: chuckle-1 → chuckle-2 → chuckle-3 → hold pose. As a standalone animated PNG or CSS sprite this is 3 frames, 300ms each.

### 3.5 Nick pose-swap transitions
- All Nick pose changes in Ch3 use **opacity crossfade 0.3s** (per design system).
- No position jumping — both poses are drawn at the same foot-anchor, so they crossfade in place.

---

## 4. JUDY — POSES & ANIMATIONS

Chapter 3 uses **7 Judy poses**. 3 reused + **4 new frames** (two were already on the planning list, two are genuinely new).

### 4.1 Reused from existing library
| Pose | Source file | Ch3 usage |
|---|---|---|
| Neutral warm (hands on hips) | `Apr 20 11_09_58 AM` | default |
| Presenting/pointing smiling | `Apr 20 11_17_45 AM` | reacting to Nick |
| Confident hands on hips (smug) | `Apr 19 01_46_26 PM` | bar #3 beat |

### 4.2 FROM PRIOR PLAN (already listed, needed here)
- **Judy excited/pointing at box** — `judy_excited_point.png` (see WEBSITE_PLAN.md description)
- **Judy bounce A** — `judy_bounce_a.png`
- **Judy bounce B** — `judy_bounce_b.png` 

### 4.3 NEW — Judy leaning in (`judy_leaning.png`)
- **Purpose:** paired with Nick leaning in on any bar hover — both characters converge on the box
- **Pose description:** body leaning forward ~15° from hip, both forearms resting on the (implied) table edge (so hands are forward, near the box), ears tilted forward and slightly down (engaged listening), eyes wide with curiosity, small closed-mouth smile, head angled down-left toward the box, one foot slightly lifted at heel (weight forward)

### 4.4 NEW — Judy reaching for bar (`judy_reaching.png`)
- **Purpose:** plays at the start of the unwrap animation — visual cue that Judy is the one picking up the bar
- **Pose description:** body still slightly leaned in, right arm extended forward and down, paw open with fingers soft (about to pick something up), left hand still resting on table, head following her hand, mouth slightly open in an anticipatory "oh" shape, ears upright, tail visible behind her with a slight curve (excited but controlled)
- **Key detail:** the extended paw aligns so it appears to be grasping the top-right corner of the active chocolate bar in the box

### 4.5 Judy bounce cycle (expanded)
The bounce cycle from the WEBSITE_PLAN gets a more precise spec here because it's used on bar #3:

**3-frame cycle (not 2)** for a more readable bounce:
| Frame | Duration | Description |
|---|---|---|
| **bounce-prep** | 150ms | Knees bent deep, body compressed ~8% shorter, arms tucked in slightly, ears drooping, face in a scrunched pre-launch grin — the "loading" frame |
| **bounce-peak** | 200ms | Body stretched tall ~6% taller than neutral, both feet off ground (gap visible under feet), arms out wide, ears straight up and slightly apart, eyes wide, open-mouth grin — peak of bounce |
| **bounce-land** | 150ms | Body slightly compressed ~4% (softer landing), knees bent, ears mid-flop, arms coming back in, closed happy smile |

Full cycle: `prep → peak → land → prep → peak → land`, played twice (2× as per plan). Total duration ~1.0s. Can also be seen as returning to neutral on land-2.

### 4.6 Judy pose-swap transitions
- Same 0.3s crossfade as Nick.
- Exception: **reaching-for-bar** transitions in/out with a 0.2s fade because it's meant to feel snappier (it's tied to the click).

---

## 5. CHOCOLATE BOX (container)

Replaces the heart-shaped-box asset from the original plan.

### Asset: `chocolate_box_open.png`
- **Shape:** rectangular, landscape orientation, roughly 4:1 aspect (e.g. 1600×400 at render size)
- **View angle:** ~30° top-down (not pure bird's-eye — we see a little of the inside front wall to give it depth)
- **Box material:** warm cream cardboard (`#E8DCC0`), crayon-sketch edges with slight wobble, visible "drawn" fold creases at corners
- **Lid:** shown flipped open behind/above the box, slightly tilted on an angle (not perfectly aligned — feels hand-placed). Lid interior is slightly darker cream (`#D4C4A0`) showing thickness. On the lid exterior: a handwritten label "open me when the night almost didn't happen" in `Caveat` font, ink color `#2A2118`, with a small crayon-drawn ribbon doodle.
- **Interior:** divided into **8 rectangular compartments** in a **2 rows × 4 columns grid**. Each compartment is lined with a soft pleated paper cup (warm peach `#F2C4B0`), drawn with a few crayon gather-lines to suggest the pleats.
- **Bars in compartments:** each of the 8 bars (see below) sits in its compartment. They're drawn as if nestled — slight shadow underneath each. One or two bars look subtly tilted (imperfect, charming) rather than robotically aligned.
- **Shadow under box:** soft warm-dark elliptical shadow underneath to anchor it to the table surface.

### Asset: `chocolate_box_empty_slot.png`
- A **single** compartment rendered in isolation (transparent background) showing the peach paper cup and a darker "shadow spot" where a bar used to sit.
- **Purpose:** swapped in via CSS when a bar has been fully unwrapped, so the box visually "remembers" what's been opened.

---

## 6. CHOCOLATE BAR DESIGNS (×8)

Each bar is **drawn as 3 separate sub-assets** (3 PNGs per bar, 24 total for the wrapped+unwrapped states, plus additional frames for the unwrap sequence — full list in §8):
- `bar_N_wrapped.png` — the bar with its wrapper fully sealed (in-box state)
- `bar_N_unwrapped.png` — the chocolate bar itself, no wrapper, showing the mold pattern
- `bar_N_wrapper_peeled.png` — the wrapper after it's been peeled back, tucked behind the bar (used in the final unwrap frame)

All bars are the same size and rectangular shape (think a small Ghirardelli square, but oblong — ~3:2 ratio). They differ in **wrapper color, wrapper pattern, chocolate mold imprint, and assigned message**.

The 8 bars are laid out in the box **left-to-right, top-to-bottom**. Bar #8 is visually locked until bars 1–7 are opened.

---

### Bar #1 — "you should stay a bit longer"
- **Wrapper color:** soft peach `#F2C4B0`
- **Wrapper pattern:** a single thin ink line that loops once around the middle of the bar like a loose ribbon, tied in a tiny off-center bow on the top-right
- **Chocolate mold (unwrapped):** milk chocolate tone `#8B5E3C`, a crescent moon shape embossed in the center
- **Message:** "you should stay a bit longer" (handwritten `Caveat`, ink)
- **Nick pose on open:** Presenting open palm
- **Judy pose on open:** Neutral warm, slight head tilt

### Bar #2 — "i missed you"
- **Wrapper color:** dusty rose `#D99BA8`
- **Wrapper pattern:** tiny scattered ink hearts (5–6 of them, different sizes, irregular placement), plus a crayon-sketched label band across the middle reading "#2"
- **Chocolate mold:** milk `#8B5E3C`, a small embossed heart centered
- **Message:** "i missed you more than i said"
- **Nick pose:** Pointing up smiling
- **Judy pose:** Presenting/pointing at box

### Bar #3 — "Almost didn't happen"
- **Wrapper color:** dusty blue `#8BB8D4` (matches the system's sky blue)
- **Wrapper pattern:** a large hand-drawn question mark taking up most of the wrapper, crayon-sketched, slightly wobbly
- **Chocolate mold:** dark chocolate `#4A2E1F`, mold imprint is a single "?" embossed
- **Message:** "this night almost didn't happen"
- **Nick pose:** Shrugging both hands
- **Judy pose:** Bounce cycle (see §4.5) — plays the full 1.0s bounce once, then settles into **Judy excited/pointing at box**

### Bar #4 — "Unseen message"
- **Wrapper color:** slate gray-blue `#6F7A88`
- **Wrapper pattern:** an ink doodle of a paper airplane mid-flight with a little dotted trail behind it
- **Chocolate mold:** dark `#4A2E1F`, imprint is a tiny paper-plane shape
- **Message:** "i almost didn't see it"
- **Nick animation:** chuckle micro-animation (§3.4) over neutral standing pose
- **Judy pose:** Confident hands on hips (smug) — like "I'm glad you did"

### Bar #5 — "Late-night talks"
- **Wrapper color:** deep plum `#5A3A5A`
- **Wrapper pattern:** a crayon moon (crescent) in the top-left corner and a small sketch of two stacked speech bubbles lower-right
- **Chocolate mold:** dark `#4A2E1F`, imprint is two overlapping small speech-bubble shapes
- **Message:** "the hours we stayed up talking"
- **Nick pose:** Neutral standing, eyes squinting (reuse `Apr 19 01_51_51 PM`)
- **Judy pose:** Judy leaning in (§4.3)

### Bar #6 — "Tiny bravery"
- **Wrapper color:** sage green `#A8C090`
- **Wrapper pattern:** a tiny ink lion doodle (cartoon, friendly) in the center, with a sketch of a small shield below it
- **Chocolate mold:** milk `#8B5E3C`, imprint is a small shield outline
- **Message:** "the smallest kind of brave"
- **Nick animation:** chuckle micro-animation over Adjusting sunglasses
- **Judy pose:** Neutral warm, eyes soft

### Bar #7 — "Second chance"
- **Wrapper color:** warm amber `#E8A04A` (fox orange's warmer cousin)
- **Wrapper pattern:** a looped arrow (circular, like a refresh/undo icon) drawn in crayon ink, centered
- **Chocolate mold:** milk `#8B5E3C`, imprint is a small spiral/loop
- **Message:** "a second first night"
- **Nick pose:** Presenting open palm (same as #1 — intentional visual rhyme)
- **Judy pose:** Judy reaching (§4.4) — fits perfectly

### Bar #8 — "If one notification…" (LOCKED)
- **Wrapper color:** gold foil effect (`#E3C264` base with thin crayon hatching in lighter cream `#F2D48A` to suggest shimmer — not photographic foil, still hand-drawn style)
- **Wrapper pattern:** a single large embossed star in the center. A small **crayon-sketched padlock icon** (ink, `#2A2118`) sits over the top-right corner. The bar is subtly desaturated (~15%) compared to the others while locked.
- **Chocolate mold:** dark `#4A2E1F`, imprint is a 5-point star
- **Message:** "if one notification didn’t arrive…, this night wouldn’t exist"
- **Nick pose:** Double thumbs up + sparkles, then transitions to **Nick hand-on-heart** after the message fully reveals
- **Judy pose:** Judy excited/pointing at box → holds

**Lock behavior:**
- Hovering bar #8 while locked: wrapper does NOT lift; instead, the padlock icon jiggles (`rotate(-8deg → 8deg → -8deg → 0deg)` over 0.4s) and a ghost caption appears above the box: "open the others first"
- When bars 1–7 are all unwrapped: the padlock does a one-time **lock-break animation** (see §10) and bar #8 becomes hover-active.

---

## 7. HOVER ANIMATION

Triggered when the cursor enters a non-locked wrapped bar. Loops gently while cursor remains over the bar. Ends on a rest frame when cursor leaves.

### Frames
Not a frame-by-frame sprite — this is CSS transforms on the single `bar_N_wrapped.png` element. But the states are defined as 4 positional keyframes:

| State | Transform | Other | Duration to reach |
|---|---|---|---|
| **rest** | `translateY(0) rotate(0)` | default shadow: `0 2px 3px rgba(42,33,24,0.18)` | — |
| **lift-1** | `translateY(-4px) rotate(0)` | shadow deepens: `0 5px 7px rgba(42,33,24,0.24)` | 180ms ease-out from rest |
| **lift-2** | `translateY(-8px) rotate(-1.5deg)` | shadow: `0 9px 12px rgba(42,33,24,0.28)` | 220ms ease-out from lift-1 |
| **lift-2 + shimmer** | (same as lift-2) + overlay `shimmer_sweep.png` | shimmer element animates diagonally across wrapper | 600ms sweep, triggered at lift-2 |

### The shimmer sweep
- A separate small asset: `shimmer_sweep.png` — a soft diagonal white gradient strip, ~30% the width of the bar, with feathered edges and 40% peak opacity. Drawn with a slight grainy/crayon texture so it doesn't feel like a digital gradient.
- Animated via CSS: starts at `translateX(-110%) skewX(-20deg)`, ends at `translateX(110%) skewX(-20deg)`, clipped to the wrapper shape.
- **Plays once per hover-enter** (not looped). If the user leaves and re-enters, it replays.

### Return-to-rest
- On cursor leave: all transforms animate back to rest over **280ms ease-in-out**. Shimmer fades (`opacity: current → 0`) in 150ms.

### Companion character animation
- When ANY wrapped bar is hovered: Nick crossfades to **Nick leaning in** and Judy crossfades to **Judy leaning in** (0.3s each, simultaneous). On cursor leave from bar: crossfade back to their current assigned pose for that bar (or neutral if no bar is currently open). Small visual delay of 200ms before the return-crossfade starts — avoids thrashing on hover-flickers.

---

## 8. UNWRAP ANIMATION

Triggered on click of a wrapped bar (not locked). The bar lifts out of the box slightly, peels open, reveals the chocolate, and the message appears. 6 frame-based stages plus CSS motion between them.

### Assets needed per bar (7 PNGs per bar)
For each of bars 1–8, draw the following as separate PNGs so the unwrap reads as hand-animated rather than a CSS transform trick. These are small (e.g. 400×260 render size) so the total asset count is manageable.

| # | Filename pattern | Description |
|---|---|---|
| 1 | `bar_N_unwrap_1_sealed.png` | **Sealed.** Full wrapper intact. Same as `bar_N_wrapped.png`. |
| 2 | `bar_N_unwrap_2_cornerlift.png` | Top-right corner of wrapper is pinched and peeled up ~15%. Small triangular flap visible. Rest of wrapper still covers bar. Tiny ink crease lines where the fold happened. |
| 3 | `bar_N_unwrap_3_topflap45.png` | Top third of wrapper peeled back at ~45° angle. A sliver of the bar's chocolate-brown surface peeks out at the top. Wrapper shows fold-shadow along the crease. |
| 4 | `bar_N_unwrap_4_topflap90.png` | Top half of wrapper flipped back 90°, now standing upright behind the bar. Upper half of chocolate fully exposed — you can see the top of the mold imprint. Wrapper shows its inside (slightly lighter cream, matte side). |
| 5 | `bar_N_unwrap_5_fullyopen.png` | Wrapper flipped fully back 180°, lying flat behind/beneath the bar. Chocolate bar fully exposed, mold imprint centered and readable. |
| 6 | `bar_N_unwrap_6_tucked.png` | Wrapper has been slid/tucked more neatly behind the bar (a cleaner final composition). The bar sits slightly lifted out of its compartment — i.e. floated up maybe 6px to emphasize it. |
| 7 | `bar_N_wrapper_peeled.png` | (Same as already listed in §6.) This is frame 6's wrapper layer in isolation, in case we need it separately. |

### Frame-by-frame diff (how each frame differs from the previous)

| From → To | What moves | What appears | What disappears |
|---|---|---|---|
| 1 → 2 | Top-right corner lifts | Small flap triangle; first crease line | — |
| 2 → 3 | Top third of wrapper rolls back | Sliver of chocolate top visible; fold-shadow along crease | The original flat top edge of the wrapper |
| 3 → 4 | Wrapper hinges up to 90° (standing) | Upper half of mold imprint; inside of wrapper | The 45°-angled flap |
| 4 → 5 | Wrapper continues hinge to 180° (laid flat back) | Full chocolate bar including mold imprint fully visible | The upright wrapper silhouette |
| 5 → 6 | Bar floats up ~6px; wrapper tucks behind/under | Cleaner composition, subtle shadow under lifted bar | Slight crumple visible in frame 5 |

### Timing
- Frame 1 → 2: 120ms
- Frame 2 → 3: 180ms
- Frame 3 → 4: 220ms
- Frame 4 → 5: 240ms
- Frame 5 → 6: 200ms
- **Total unwrap:** ~960ms
- Transitions between frames use **hard swap** (not crossfade) — the hand-drawn frames already imply motion, crossfading would muddy them. Except frame 5 → 6, which crossfades at 180ms because it's primarily a position shift.

### Accompanying CSS motion
- The entire bar element translates up `-12px` over the full 960ms with ease-out — as if being gently lifted while it's being unwrapped.
- Tiny rotation wobble: `rotate(0 → -2deg → 1deg → 0)` keyframed across the same duration — gives it organic hand motion.
- Very soft paper-rustle SFX is fine if audio is added later (optional, out of scope for assets).

### Character reaction during unwrap
- On click (frame 1): Judy crossfades to **Judy reaching** (0.2s — snappier than normal).
- On frame 4 (wrapper standing open): Judy crossfades back to her assigned pose for that bar (per §6 table).
- Nick holds **Nick leaning in** throughout the unwrap, then crossfades to his assigned pose (per §6 table) on frame 6.

---

## 9. MESSAGE REVEAL ANIMATION

After the unwrap completes (frame 6), the bar's message appears.

### Asset
- **Not a static image** — text is rendered in HTML with `Caveat` font, ink `#2A2118`, size ~32px, with a slight rotation (randomized per bar between `-1.5deg` and `+1.5deg`).

### Animation
- Position: floats just above the unwrapped bar, anchored to the bar's center-top.
- Enter:
  - `opacity: 0 → 1` over 400ms
  - `translateY(8px → 0)` over 400ms ease-out
  - A thin hand-drawn underline swoosh (small PNG: `message_underline.png` — crayon scribble, 3px stroke, slightly tapered ends) draws in from left to right using CSS `clip-path: inset(0 100% 0 0) → inset(0 0 0 0)` over 500ms, starting 200ms after the text begins fading in
- **Delay before enter:** 250ms after unwrap frame 6 settles — gives the reveal a beat.

### Lingering behavior
- Message stays visible as long as the bar stays opened.
- If the user opens a different bar: the previous message fades out (`opacity 1 → 0`, 300ms) BEFORE the new unwrap starts.

---

## 10. FINAL BAR LOCK-BREAK

Plays once, automatically, the moment bars 1–7 are all in the "opened" state.

### Sequence

| Frame | Duration | Description |
|---|---|---|
| **L1** | 400ms | Bar #8 pulses: `scale(1 → 1.06 → 1)` ease-in-out. Padlock icon still in place. |
| **L2** | 250ms | Padlock rattles: `rotate(-14deg → 14deg → -10deg → 10deg → 0)` in 4 quick beats. |
| **L3** | 200ms | Padlock **snaps open** — the loop of the lock visibly lifts away from the body. This is a single new drawn frame: `padlock_open.png` (same lock shape but with the U-shackle rotated up ~35°). |
| **L4** | 350ms | Padlock lifts off the wrapper: `translateY(-24px) opacity(1 → 0)`. Small crayon-sketch "sparkle" cross appears briefly where the lock sat, fades in/out over 400ms. |
| **L5** | 500ms | Wrapper desaturation lifts — CSS `filter: saturate(0.85) → saturate(1)` over 500ms. Bar returns to full vibrancy. A gentle warm glow (`box-shadow` pulse) halos the bar once. |

Total: ~1.7s. After L5, bar #8 is fully hover-interactive. The "open the others first" hint caption, if visible, fades out on L1.

### Assets to create for lock-break
- `padlock_closed.png` — the small ink crayon padlock (already used on bar #8's wrapped state in §6)
- `padlock_open.png` — same lock, U-shackle rotated up 35°
- `sparkle_cross.png` — a small 4-point sparkle (can reuse the sparkle crosses from `ch3_sky.png` if drawn as a separate asset, which is recommended anyway)

---

## ASSET CHECKLIST

### Backgrounds (2 base PNGs + overlays)
- [x] `chapter3/backgrounds/sky.png` — starry night base (star field + Milky Way band + cloud wisps) ✓ drawn
- [x] `chapter3/backgrounds/city.png` — city + mountains + river + bank + flowers, transparent sky region ✓ drawn
- [ ] `chapter3/backgrounds/sky_overlays/stars.svg` — ~40 twinkling star circles in 3 stagger groups (5 heroes with cross-flares)
- [ ] `chapter3/backgrounds/city_overlays/beams.svg` — 3 big searchlight cones anchored at the hero spire
- [ ] `chapter3/backgrounds/city_overlays/window_sparkles.png` — ~30 positioned warm glow dots matching the brightest painted windows
- [ ] `chapter3/backgrounds/city_overlays/river_shimmer.svg` — SVG `<filter>` defs (turbulence + displacement) for the water
- [ ] `chapter3/backgrounds/city_overlays/ripples.svg` — 3 ripple ellipses (optional, skip if river shimmer alone is enough)
- [ ] `chapter3/backgrounds/city_overlays/firefly.png` — single small warm dot (reused for 5–6 fireflies)

Detailed plans: [`SKY_LAYER.md`](chapter3/backgrounds/SKY_LAYER.md), [`CITY_LAYER.md`](chapter3/backgrounds/CITY_LAYER.md)

### Ambient (2)
- [ ] `message_underline.png` — crayon underline swoosh
- [ ] `sparkle_cross.png` — 4-point sparkle (reused multiple places, incl. city "bling" accent)

### Nick poses (2 new)
- [ ] `nick_leaning.png`
- [ ] `nick_heart.png`
- [ ] `nick_chuckle_1.png`, `nick_chuckle_2.png`, `nick_chuckle_3.png` — head-only 3-frame chuckle

### Judy poses (4 new + bounce cycle refinement)
- [ ] `judy_leaning.png`
- [ ] `judy_reaching.png`
- [ ] `judy_excited_point.png` (already in WEBSITE_PLAN list)
- [ ] `judy_bounce_prep.png` (expands prior plan's Bounce A)
- [ ] `judy_bounce_peak.png` (expands prior plan's Bounce B)
- [ ] `judy_bounce_land.png` (new — soft landing frame)

### Chocolate box + bars (1 container + 8 bars × ~7 frames each = ~58)
- [ ] `chocolate_box_open.png`
- [ ] `chocolate_box_empty_slot.png`
- [ ] For each N in 1..8:
  - [ ] `bar_N_wrapped.png`
  - [ ] `bar_N_unwrap_2_cornerlift.png`
  - [ ] `bar_N_unwrap_3_topflap45.png`
  - [ ] `bar_N_unwrap_4_topflap90.png`
  - [ ] `bar_N_unwrap_5_fullyopen.png`
  - [ ] `bar_N_unwrap_6_tucked.png`
  - [ ] `bar_N_unwrapped.png` (reference / fallback — same as frame 6 without the bar-lifted offset)

### Interaction elements (3)
- [ ] `shimmer_sweep.png`
- [ ] `padlock_closed.png`
- [ ] `padlock_open.png`

### Totals
- Backgrounds + ambient: **~8 files** (2 base PNGs already drawn + 5 SVG/PNG overlays + 2 small ambient). Down from 15 under the 6-layer plan.
- Characters: **~11 files** (2 Nick poses, 3 Nick chuckle, 4 Judy poses, 3 Judy bounce, -1 for reuse with prior plan)
- Chocolate system: **2 box + (8 bars × 6 unwrap frames) + 8 reference = 58 files**
- Interaction: **3 files**
- **Grand total ≈ 80 new assets for Chapter 3** (down from 87 under the 6-layer plan)

---

## NOTES FOR THE ARTIST / IMAGE-GEN PROMPTS

- Every asset must feel **hand-drawn with crayon/ink**, not vector-clean. Slight line wobble, visible strokes, occasional imperfection.
- Keep a **consistent light source** on characters and the box: warm amber spilling from **the right** (the city glow coming from across the river), with a cooler blue-moon rim from **the upper-left** (the moon and sky swirls). Characters should have warm highlights on their right side and subtle cool rim-light on their left — this anchors them into the painted scene.
- Chocolate bars should feel **chunky and tactile** — the mold imprints are shallow but clearly embossed, not painted-on.
- Wrappers should read as **matte paper**, not glossy plastic — this keeps them consistent with the paper-texture system.
- Characters in Ch3 scale: slightly smaller than Ch1 (~85%) to give the chocolate box room to be center stage.
- When drawing the bar unwrap frames, **keep the bar position identical across all 6 frames** except for the final `translateY(-6px)` in frame 6. Only the wrapper moves. This keeps the animation clean when swapped.
