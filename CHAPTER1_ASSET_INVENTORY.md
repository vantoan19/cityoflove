# CHAPTER 1 — ASSET INVENTORY
## Full frame-by-frame breakdown for all animated elements

---

## BACKGROUND LAYERS

---

### LAYER 1 — Sky

**File:** `bg_sky.png`
**Format:** Wide PNG — minimum **200% of viewport width** so CSS pan never shows an edge
**Animation:** CSS `translateX(0 → -25%)` over `60s`, linear, infinite loop
**Frames:** 1 (no drawn frames — CSS handles the movement)

- **Frame 1:** Full wide sky painting. Crayon blue gradient top-to-bottom (deeper blue at top, lighter near horizon). A few large background cloud masses painted directly into the sky — these are part of the static layer and move with the pan. Visible crayon stroke texture throughout.

---

### LAYER 2 — Individual Cloud Cutouts

**Format:** Transparent PNG per cloud (white + light gray, no background)
**Animation per cloud:** CSS `translateX` drift across screen (each at different speed) + CSS crossfade between 2 drawn frames to make the cloud feel like it's breathing/shifting shape
**Frame cycle:** Frame 1 → Frame 2 → Frame 1, crossfade at `2–3s` per frame

Draw **4 clouds**, each with **2 frames**:

---

**Cloud A — Large Puffy (8 cloud assets total: 4 clouds × 2 frames)**

| | Description |
|--|-------------|
| **Frame 1** | Large cloud, 3 rounded bumps across the top (left bump = medium, center bump = tallest, right bump = medium-small). Base is roughly flat. Left edge soft and wispy. Overall shape leans slightly left. |
| **Frame 2** | Same cloud — center bump grows ~5% taller, right bump puffs out a little more. Left edge develops a small extra wisp curling downward. Feels like the cloud quietly expanded. |
| CSS drift speed | `90s` loop, starts off right edge of screen |

---

**Cloud B — Medium Rounded**

| | Description |
|--|-------------|
| **Frame 1** | Medium cloud, 2 main bumps. Left bump is slightly taller. Base has a gentle curve, not flat. Right edge trails into a thin wisp. |
| **Frame 2** | Right bump grows to match the left bump height. The wispy right edge stretches 8–10px further right. Base curves a little lower in the middle — the cloud looks slightly wider and flatter. |
| CSS drift speed | `120s` loop, starts further off screen (creates depth: slower = further away) |

---

**Cloud C — Small Compact Puff**

| | Description |
|--|-------------|
| **Frame 1** | Small cloud, tight round shape, 1 main dome with a small secondary bump on the right. Base is almost circular. Sits high in the sky. |
| **Frame 2** | Main dome is fractionally taller (+3px). Secondary bump moves slightly right and puffs a little. The whole cloud feels like it took a small breath inward. |
| CSS drift speed | `70s` loop — fastest because it's smallest / feels closest |

---

**Cloud D — Long Wispy Streak**

| | Description |
|--|-------------|
| **Frame 1** | Long, thin, horizontal cloud — like a brushstroke. Thicker in the left-center, tapers to thin wisps on both ends. Multiple thin crayon strokes layered horizontally. |
| **Frame 2** | Center thickens slightly more. Right wisp grows 12–15px longer. Left wisp shortens slightly. The whole streak shifts its weight slightly rightward — like it's being pushed by wind. |
| CSS drift speed | `150s` loop — slowest, feels very far/high in sky |

---

### LAYER 3 — Mountains

**File:** `mountains.png` (existing asset — reuse as-is)
**Frames:** 1 (no new drawing needed)
**Animation:** CSS `translateX(0 → 4px → 0)` ease-in-out, `8s` loop — very slow subtle sway

---

### LAYER 4 — City Buildings

**File:** `bg_city_buildings.png`
**Format:** Transparent PNG — city skyline only, no sky, no mountains, no foreground
**Frames:** 1
**Animation:** CSS slow horizontal drift — `translateX(0 → -8px → 0)` over `25s` loop. Slightly faster than mountains to reinforce depth.

- **Frame 1:** Full city skyline mass from the existing composed scenes (`Apr 19` references) — all the colorful spires and buildings — isolated on transparent background. Bottom edge blends into transparency (soft fade) so it sits naturally over the mountain layer.

---

### LAYER 5 — Foreground Bushes + Stone Wall

**File:** `foreground.png` (existing) + 2 new frames
**Frames:** 3 frames total
**Animation:** Cycle 1 → 2 → 1 → 3 → 1, each frame `0.8s` ease-in-out

| Frame | Description |
|-------|-------------|
| **Frame 1 (neutral)** | Existing `foreground.png` — bushes upright, leaves at natural resting position, stone wall unchanged. This is the base/rest frame. |
| **Frame 2 (wind left)** | Same stone wall (unchanged). Bushes tilt left by ~2°, `transform-origin: bottom`. Top leaves bend leftward, some leaves near the top show their underside (slightly lighter green tone). Branch tips curve left. The leftmost bush leans a bit more than the right one (wind hits it first). |
| **Frame 3 (wind right)** | Mirror of Frame 2. Bushes tilt right by ~2°. Top leaves bend rightward, same underside effect on right-facing leaves. Right bush leans slightly more. |

> Note: The stone wall in all 3 frames is identical — only the plants move.

---

### WIND STREAKS (CSS only — no drawn asset needed)

**Implementation:** Pure CSS — 5 thin `div` elements, each `1px` tall, `80–140px` wide, `opacity: 0.07`, color `#FFFFFF`
**Animation:** Each streak sweeps `translateX(-200px → 110vw)` — staggered delays: `0s`, `2.1s`, `4.4s`, `6.8s`, `9.3s`. Duration: `2.2s` per sweep. Repeat interval: `10–15s` per streak (use `animation-delay` with long gaps).

> These do not need any image assets.

---

---

## CHARACTER ANIMATIONS

Each character pose is a **looping 2–4 frame animation** that plays while that dialogue line is active.
All frames are **transparent PNG**, same canvas size (so they can be swapped in place via CSS `opacity` or JS).

---

## NICK (Fox)

---

### NICK POSE 1 — Neutral Idle
*Used between dialogue lines / before first line*

**Frames:** 3 | **Canvas:** Same size for all 3 | **Cycle:** 1→2→3→2→1, `0.6s` per frame

| Frame | Full description |
|-------|-----------------|
| **Frame 1 (neutral)** | Nick standing upright. Weight evenly distributed. Arms hang loosely at sides, elbows very slightly bent. Tail arcs naturally behind him at mid-height — tip pointing slightly upward. Mouth: closed, very slight upward curve (resting content expression). Tie hangs straight down. Sunglasses level. |
| **Frame 2 (breathe in)** | Chest expands very subtly — torso 2–3% wider, shoulders rise 2–3px. Tail tip curls just slightly more upward. Tie shifts 2px to the right as if caught by a gentle breeze. Sunglasses unchanged. Mouth unchanged. |
| **Frame 3 (breathe out)** | Shoulders drop 2–3px below Frame 1 (not below neutral — just settling). Chest narrows back. Tail drops 3–4px from Frame 2, settling below neutral position briefly. Tie swings back 2px left. Mouth unchanged. |

> The breathing arc: neutral → slightly inflated → slightly deflated → back to neutral. Subtle. Like watching someone stand in a light breeze.

---

### NICK POSE 2 — Presenting Right Hand
*Line 2: "Some cities are planned."*

**Frames:** 2 | **Cycle:** 1→2→1, `0.7s` per frame

| Frame | Full description |
|-------|-----------------|
| **Frame 1 (arm extended)** | Right arm reaches outward toward the city (screen-left direction). Elbow gently bent, palm open facing upward, fingers slightly spread and relaxed — a welcoming "behold" gesture. Torso leans ~3° toward the city. Left arm hangs at side slightly back for balance. Tail swings right for counterbalance. Mouth: open with a confident side-smile (one corner raised more than the other). Sunglasses level. |
| **Frame 2 (arm slight rise + emphasis)** | Right arm raises 5–7° higher than Frame 1. Palm tilts more upward (more of the palm visible). Fingers spread just a bit more. The lean stays the same. Eyebrows raise slightly above sunglasses frames (visible as slight upward crinkle at brow). Tail position unchanged. |

---

### NICK POSE 3 — Shrug
*Line 3: "This one… wasn't."*

**Frames:** 3 | **Cycle:** 1 (0.3s) → 2 (0.5s) → 3 (hold, loop 2↔3 while line is active)

| Frame | Full description |
|-------|-----------------|
| **Frame 1 (building shrug)** | Both forearms beginning to rise — elbows lifting outward from sides, palms just starting to face upward. Shoulders begin to hunch. Eyebrows start to raise above sunglasses. Mouth: closed, slight smirk beginning. Tail drops slightly lower. |
| **Frame 2 (peak shrug)** | Both arms fully raised — elbows at shoulder height, palms face fully upward, fingers spread wide open. Shoulders hunched up toward ears (ears partially framed by raised shoulders). Mouth opens into a wide "who knows?" smirk, both corners raised, slight teeth showing. Tail hangs loose, drooped down. Head tilts very slightly to one side (3–4°). |
| **Frame 3 (resting shrug)** | Arms drop 3–4° from peak — still clearly shrugging but slightly less extreme, as if he's settled into it. Shoulders remain hunched. Mouth stays in smirk but slightly less wide. Tail still drooped. This is the "held" position — loops with Frame 2 gently (2→3→2→3). |

---

### NICK POSE 4 — Pointing Up
*Line 4: "It just appeared."*

**Frames:** 2 | **Cycle:** 1→2→1, `0.5s` per frame

| Frame | Full description |
|-------|-----------------|
| **Frame 1 (point)** | Right arm raised, elbow bent at ~120°. Index finger extended straight upward, other fingers loosely curled into palm, thumb slightly out. Chin tilted up ~10° following the finger. Mouth open mid-speech, lower teeth slightly visible (energetic expression). Tail arcs upward and backward with the energy of the gesture. Left arm swings slightly back. |
| **Frame 2 (emphasis push)** | Arm extends ~10° straighter (elbow less bent). Finger pushes 4–5° further upward — the tip of the gesture. Body leans very slightly back (~2°) from the extension. Tail arcs 5px higher than Frame 1. Chin follows up another 3°. Same open mouth expression. |

---

### NICK POSE 5 — Adjusting Sunglasses
*Line 5: "Unexpected."*

**Frames:** 4 | **Cycle:** 1 (0.3s) → 2 (0.3s) → 3 (0.6s, held) → 4 (0.3s) → back to 3 briefly (loop 3→4→3 while line is active)

| Frame | Full description |
|-------|-----------------|
| **Frame 1 (hand rising)** | Right hand rising toward face, elbow lifting. Fingertips approaching the glasses from below-right. Body otherwise relaxed. Mouth: closed, slight smirk. Tail neutral. |
| **Frame 2 (fingers on glasses)** | Right fingertips touch the glasses frame — index and middle finger resting on the bridge/right lens edge. Glasses still level. The act of touching is visible. Other arm stays at side. |
| **Frame 3 (glasses tilted — PEAK)** | Glasses now angled: right side of glasses pushed up (~8°), left side lowered — creating a slight tilt. Nick's left eye is now barely visible above the lowered left lens (a sliver of green eye peeking over the frame). Mouth: slow wide confident grin, one side of mouth raised higher. Hand still on glasses. Tail flicks upward slightly — cool energy. This is the "coolest" frame — hold it. |
| **Frame 4 (glasses settling)** | Hand lowering back to side. Glasses returned to level position. The smug grin remains — slightly narrower than Frame 3. Eyes back behind lenses fully. Tail settles. |

---

### NICK POSE 6 — Finger Guns
*Line 6: "A little chaotic."*

**Frames:** 2 | **Cycle:** 1→2→1→2, `0.4s` per frame (rapid alternation = the animation)

| Frame | Full description |
|-------|-----------------|
| **Frame 1 (guns right)** | Both hands formed into finger-gun shape — index fingers extended, thumbs up, other fingers curled. Both arms pointing to the right side (toward Judy / city). Weight shifted slightly right — right hip forward. Smug grin, one eyebrow arched above sunglasses. Tail swings left for counterbalance. |
| **Frame 2 (guns left)** | Identical pose but both arms now pointing left. Weight shifts slightly left. Tail swings right. Same grin — expression unchanged. The rapid 1→2→1→2 gives the feel of "directing traffic" left and right. |

---

### NICK POSE 7 — Double Thumbs Up + Sparkles
*Line 7: "Kind of fun."*

**Frames:** 3 | **Cycle:** 1 (0.3s) → 2 (0.4s) → 3 (hold, loop)

| Frame | Full description |
|-------|-----------------|
| **Frame 1 (rising)** | Both arms rising — elbows bending outward and upward. Thumbs beginning to form (other fingers curling inward). Big open grin appearing, eyes beginning to squint with the smile. Tail lifts behind him. Chest opens forward slightly — proud energy building. No sparkles yet. |
| **Frame 2 (peak)** | Both arms fully raised, elbows out, thumbs pointing proudly up. Full wide grin, cheeks raised, eyes squinting happily. **4-pointed star burst sparkles** drawn on the character: one at each thumb tip (small, ~8px), one near each lens of the sunglasses (small). Tail arcs high behind him — maximum energy. |
| **Frame 3 (settled hold)** | Arms drop ~5° from peak — still clearly thumbs up but settled. Grin remains full. Sparkles still present but drawn ~20% smaller than Frame 2. Tail settles slightly. This loops: overlay CSS `opacity 0.6→1→0.6` on the sparkle marks at `1s` loop for a twinkle effect without redrawing. |

---

---

## JUDY (Rabbit)

---

### JUDY POSE 1 — Neutral Idle
*Between lines / default*

**Frames:** 3 | **Cycle:** 1→2→3→2→1, `0.6s` per frame — **start at Frame 2** (offset from Nick so they don't breathe in sync)

| Frame | Full description |
|-------|-----------------|
| **Frame 1 (neutral)** | Judy standing, hands on hips loosely (not tense — relaxed). Ears upright and parallel, angled very slightly forward (alert but calm). Eyes open, warm forward gaze, soft closed smile. Police hat level. |
| **Frame 2 (breathe in)** | Chest expands gently — torso 2–3% taller/wider. Both ears rise 2–3px and spread fractionally apart at tips. Hat shifts 1–2px upward with the body rise. Smile unchanged. |
| **Frame 3 (breathe out)** | Torso settles back — ears relax slightly outward and lower 2–3px from neutral (not drooping, just at ease). Hat settles back down. Hands on hips loosen further. Eyes may have a very slight softening — barely perceptible. |

---

### JUDY POSE 2 — Smug / One Eyebrow Raised
*Line 3: "This one… wasn't."*

**Frames:** 2 | **Cycle:** 1→2→1, `0.9s` per frame

| Frame | Full description |
|-------|-----------------|
| **Frame 1 (eyebrow raise)** | Weight shifts slightly to her left leg (left hip pops out 3–4px). Right eyebrow arched noticeably higher than left — skeptical/amused. Left eyebrow stays near normal. Eyes slightly narrowed with the arch. Mouth: closed, one corner of mouth (right side) pulled upward in a smirk — a "hmm, is that so?" expression. Left ear tilts slightly outward. Hands stay on hips. |
| **Frame 2 (head tilt)** | Same expression plus a slight head tilt — head tilts 3–4° to her right (toward Nick). The arched right eyebrow goes just a touch higher. The smirk widens very slightly, pulling the right corner of her mouth up another 2–3px. Ear tilt increases just fractionally. |

---

### JUDY POSE 3 — Curious / Pointing at City
*Line 4: "It just appeared."*

**Frames:** 2 | **Cycle:** 1→2→1, `0.9s` per frame

| Frame | Full description |
|-------|-----------------|
| **Frame 1 (head tilt + point)** | Right arm extended, pointing toward the city (screen-left). Arm at ~45° angle downward-outward. Head tilts 10° to the right (curious tilt). Both ears shift: right ear tilts forward toward the city, left ear tilts slightly back. Eyes wide and round with curiosity — big. Mouth slightly open, bottom lip dropped — "oh, interesting" expression. Left hand comes off hip and opens loosely at her side. |
| **Frame 2 (leaning in)** | Head tilt reduces to 5° (coming back level slightly). Arm stays pointing. Whole upper body leans 3–4° toward the city (she's drawn to it). Eyes stay wide. Mouth closes slightly — more of a wondering expression than surprise. Left hand returns partially toward hip. Ears shift forward together. |

---

### JUDY POSE 4 — Surprised *(NEW FRAME — must be drawn)*
*Line 5: "Unexpected."*

**Frames:** 3 | **Cycle:** 1 (0.3s) → 2 (0.5s) → 3 (hold while line is active, blink on 3 every ~2s)

| Frame | Full description |
|-------|-----------------|
| **Frame 1 (surprise building)** | Eyes beginning to widen (20% larger than normal). Both ears starting to rise from resting position — about halfway up from neutral to peak. Mouth forming an "oh" shape — lips rounding. Hands beginning to lift off hips slightly (involuntary reaction). Body barely leaning back (~1°). |
| **Frame 2 (peak surprise)** | Eyes at maximum — fully round, as large as they get, irises clearly visible, a small sheen/shine dot in each eye (joy/wonder highlight). Both ears fully extended upward and slightly apart at tips. Mouth fully open in a round "oh!" — top teeth barely visible. Hands float off hips, both raised slightly at sides (arms bent ~15° outward). Body leans back ~3°. Small blush circles on both cheeks (soft pink, very light, like a crayon smudge). |
| **Frame 3 (settling)** | Eyes stay wide but blink drawn as a separate sub-frame (eyes closed for 1 frame every ~2s — implement as CSS toggle). Ears settle to ~80% of peak height, slightly less apart. Mouth closes to a small surprised "o" — smaller than peak but still open. Hands return partway to hips. Blush circles remain but slightly lighter. Body returns to near-vertical. |

> Blink sub-frame for Frame 3: Judy's eyes fully closed (just curved lines for closed lids), everything else same as Frame 3. Swap in for `0.1s` every `2s` using JS/CSS.

---

### JUDY POSE 5 — Amused / Hands on Hips
*Line 6: "A little chaotic."*

**Frames:** 2 | **Cycle:** 1→2→1, `1.0s` per frame

| Frame | Full description |
|-------|-----------------|
| **Frame 1 (amused stance)** | Classic hands-on-hips, weight even. Both ears tilted slightly forward (engaged). Eyes slightly narrowed in a genuine laugh-smile — the corners crinkle. Closed-mouth grin, both corners raised. Head level. |
| **Frame 2 (hip pop + head shake)** | Weight shifts onto left leg — left hip pops out 4–5px. Head tilts ~3° to the right as if doing a tiny "I can't believe this guy" head shake. One ear tilts more forward, other stays. Smile crinkles just a bit more at the eyes — she's thoroughly amused. |

---

### JUDY POSE 6 — Warm Happy
*Line 7: "Kind of fun."*

**Frames:** 2 | **Cycle:** 1→2→1, `1.0s` per frame

| Frame | Full description |
|-------|-----------------|
| **Frame 1 (open warm)** | Hands on hips but relaxed — grip loose, fingers open. Big warm closed smile (wide, both corners raised equally). Eyes bright and warm, open fully — not squinting, genuinely open and happy. Ears in a natural relaxed upright position, not tense. Upper body leans very slightly forward (~2°) — open, positive energy. |
| **Frame 2 (subtle agreement)** | One hand (right) lifts off hip — fingers loose and open, hand at waist level, a very subtle agreement gesture (not a full point, just a small open-palm acknowledgment). Smile widens just a hint — bottom lip drops very slightly, hint of teeth visible. Ears angle forward together warmly. Weight shifts very slightly forward onto toes. |

---

---

## SUMMARY TABLE

| # | Asset | Frames | New / Existing |
|---|-------|--------|----------------|
| BG-1 | Sky wide pan (`bg_sky.png`) | 1 | New (wider version) |
| BG-2A | Cloud A large puffy | 2 | New |
| BG-2B | Cloud B medium rounded | 2 | New |
| BG-2C | Cloud C small puff | 2 | New |
| BG-2D | Cloud D long wispy | 2 | New |
| BG-3 | Mountains | 1 | Existing (`mountains.png`) |
| BG-4 | City buildings isolated | 1 | New (isolate from existing scenes) |
| BG-5A | Foreground neutral | 1 | Existing (`foreground.png`) |
| BG-5B | Foreground wind left | 1 | New |
| BG-5C | Foreground wind right | 1 | New |
| N-1 | Nick neutral idle | 3 | New (frames 2+3) |
| N-2 | Nick presenting right hand | 2 | Frame 1 = existing `01_35_47 AM` · Frame 2 = new |
| N-3 | Nick shrug | 3 | Frame 2 = existing `01_42_58 AM` · Frames 1+3 = new |
| N-4 | Nick pointing up | 2 | Frame 1 = existing `01_40_20 AM` · Frame 2 = new |
| N-5 | Nick adjusting sunglasses | 4 | Frame 2 = existing `01_47_19 AM` · Frames 1,3,4 = new |
| N-6 | Nick finger guns | 2 | Frame 1 = existing `01_45_49 AM` · Frame 2 = new (mirrored) |
| N-7 | Nick double thumbs up | 3 | Frame 2 = existing `01_58_26 AM` · Frames 1+3 = new |
| J-1 | Judy neutral idle | 3 | Frame 1 = existing `11_09_58 AM` · Frames 2+3 = new |
| J-2 | Judy smug / eyebrow | 2 | Frame 1 = existing `01_46_26 PM` · Frame 2 = new |
| J-3 | Judy curious / pointing | 2 | Frame 1 = existing `11_17_45 AM` · Frame 2 = new |
| J-4 | Judy surprised | 3 | All new |
| J-5 | Judy amused hands on hips | 2 | Frame 1 = existing `11_09_58 AM` · Frame 2 = new |
| J-6 | Judy warm happy | 2 | Frame 1 = existing `11_09_58 AM` · Frame 2 = new |

**Total frames to draw (new only):**
- Background: 10 new frames (sky wide, 8 cloud frames, 2 foreground wind frames, 1 city buildings)
- Nick: 10 new frames
- Judy: 11 new frames
- **= 31 new frames to draw for Chapter 1**

**Reused from existing assets: 11 frames** (no redrawing needed)
