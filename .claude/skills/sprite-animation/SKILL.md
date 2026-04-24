---
name: sprite-animation
description: Generate a smooth sprite-animation frame sequence from a static base image using the nano-banana MCP server. Use when the user wants to turn a single illustration into a looping animation — e.g. beams sweeping across a city, fireflies drifting over flowers, stars twinkling in a sky, flames flickering in a torch. Every generated frame must look essentially IDENTICAL to the base image in resolution, dimensions, composition, palette, and sketch style. Only tiny per-frame deltas (a few pixels of shift, a sub-degree rotation, a small opacity bump on a glowing element) are applied.
allowed-tools: mcp__nano-banana__generate_image, Read, Write, Bash, Glob, ToolSearch
---

# Sprite animation from a base image

This skill orchestrates the generation of a looping N-frame sprite animation from a single base image. It is designed for gentle, atmospheric motion — the kind you sit behind other content in a parallax scene. Every frame preserves the base's look; only small animated elements move.

## Inputs (ask the user if any are missing)

1. **Base image path** — absolute path to the static PNG / JPG to animate (e.g. `C:/Projects/foo/city.png`). This image is the identity anchor for every frame.
2. **Output folder** — where the frames should be saved. Default: `<base_image_folder>/<base_name>_frames/` (e.g. `city_overlays/` for `city.png`). Create it if it doesn't exist.
3. **Number of frames** — typically 4–12. Lower for very slow atmospheric motion, higher for smoother sweeps. Default: 8.
4. **High-level animation description** — one-paragraph summary of what moves across the cycle. Example: *"Three cream searchlight beams sweep across the sky from the hero spire top. Warm window halos migrate across the skyline. The river's reflection streaks shimmer with ±1–2px horizontal drift. A handful of fireflies drift along slow arcs over the flowers."*
5. **Per-frame descriptions** — the specific delta state for each frame (frame 1 through frame N). Each frame's description should be a small, concrete advance from the previous frame's state. Numeric specs are ideal (angles, px offsets, alpha values, radii).

If the user gives only high-level text, ask clarifying questions to pin down: which elements move, how many frames, what the per-frame state looks like. Do not guess numeric deltas silently — confirm them.

## Non-negotiable rules for every frame

1. **Base identity is sacred.** Every frame must look near-pixel-identical to the base in: resolution, canvas dimensions, aspect ratio, composition, framing, palette, building/object silhouettes, stroke texture, paper grain, ink outlines, transparent regions. If the model drifts on any of these, regenerate.
2. **Deltas are tiny.** A single frame-to-frame delta is 1–2 px of shift, a sub-degree tilt, a small opacity bump, or the appearance/disappearance of a faint overlay. NEVER 5°+ rotations, new building shapes, recolored surfaces, or redrawn regions.
3. **Color and style are EXTREMELY consistent across frames — this is the most common failure mode.** Every non-overlay pixel must look the same frame-to-frame: the same hues, the same saturation, the same brightness/contrast, the same stroke weight, the same paper-grain grit, the same ink-outline thickness. Imagine the 8 frames played in a loop at ~10 fps: if any single patch of sky, water, building, or flower "breathes" in color or texture, it will read as a jarring flicker — worse than any overlay motion you add on top. Concrete guardrails:
   - **No palette drift.** If a rooftop is `#2E1E45` in the base, it must be visually indistinguishable from `#2E1E45` in every frame. Warm ambers must not creep redder or more orange between frames. Teals must not shift toward blue-green. If the model recolors anything by even a small perceptual step, regenerate.
   - **No saturation/brightness shift.** Gemini sometimes subtly boosts saturation or contrast when re-synthesizing. Adjacent frames with different global saturation will flicker in a loop. Spot-check two frames side by side at 100% zoom — if one looks "juicier" or "flatter" than the other, reject.
   - **No style drift.** The crayon / oil-pastel / line-art stroke character must not "smooth out", "tighten", or "fuzz up" frame-to-frame. Ink-outline thickness stays constant. Paper grain visible in the base remains visible at the same intensity in every frame.
   - **Always include explicit color + style lock phrases in the prompt.** Every frame's prompt must contain something like: *"Keep the exact same palette, saturation, brightness, contrast, stroke thickness, paper grain, and ink outlines as the reference base. Do NOT recolor, re-saturate, smooth, stylize, or re-render any pixel that is not part of the {overlay elements}."*
   - **If style/color drift is unavoidable after 2–3 regens, fall back to local PIL compositing** (see bottom of this skill). A mathematically-clean overlay on the true base pixels will always loop better than an API-re-painted near-copy.
4. **Motion is in the overlay layer, not the base.** The base painting is static; the animation lives in thin elements layered on top (beams, halos, ripples, fireflies, streak shifts). Treat the base as untouchable and the overlays as the only place change happens.
5. **Smooth loop.** The Nth frame's deltas should set up a natural wrap back to frame 1 — no visible jump between the last and first frames of the cycle.
6. **No labeled identifiers in the prompt.** NEVER write `F1`, `B2`, `R3`, `S5` etc. in any prompt you send to nano-banana — Gemini renders those tokens as literal text in the output image. Describe each element by position and role instead (e.g. *"one firefly in the far-left flower tangle at ~9% x, ~84% y, alpha 1.0"* or *"the leftmost beam at -18° from vertical"*). Internal spec files (CITY_LAYER.md, etc.) may use labels for state tables — just strip them when composing the prompt. Also pass a `negative_prompt="text, letters, numbers, labels, captions, watermarks, annotations, legends"` on every call as belt-and-suspenders defense.

7. **No added foreground elements — ever.** Gemini aggressively duplicates / scatters "granular" details like flowers, foliage, grass, leaves, stones, debris when it sees them in the base. A wildflower fringe in the bottom-left becomes flowers across the entire foreground. **Every prompt must include an explicit preservation clause** naming the specific elements and their confinement: *"Do NOT add, extend, duplicate, or scatter {flowers / foliage / grass / stones / any granular element} beyond what is already baked into the base. The {element} exists only in the {specific region} of the base and must stay confined there — same count, same positions, same density."* Also consider adding those element types to the `negative_prompt` when you're NOT animating them (e.g. `negative_prompt="..., extra flowers, scattered foliage, added foreground plants"`).

8. **Sweeping motion must be a SMOOTH sinusoidal trajectory with small per-frame steps.** Before generating any frame, sketch the 8 (or N) angle values for each sweeping element as a full-cycle sine wave. Rules:
   - **Per-frame delta ≤ 4°** (ideally 2–3°). If adjacent frames jump 6°+, the sweep reads as jerky hops, not gentle motion.
   - **Total amplitude ≤ ~8° either side of center.** A real searchlight sweeps slowly; resist the urge to use dramatic ±25° ranges.
   - **All points on the same trajectory.** Three beams sweeping together should stay in parallel relationships (e.g. all three shift by the same sine-offset), not twist independently.
   - Verify the table before sending: every adjacent-frame delta in the same direction and same small magnitude. If any row breaks the pattern, redesign.

9. **Animate FIXED elements pulsing in place, not migrating clusters.** For window halos, firefly glow, star twinkles, reflections — pick a FIXED set of positions at the start and use those exact positions in every frame. The animation is ONLY a small opacity/brightness pulse per element on staggered phases. Never write "halos migrate from left skyline to right skyline" — that reads as flickering different lights, not consistent ambient glow. Write instead: *"the same eight specific windows at positions {list} are haloed in every frame; at this frame, windows at {subset} are at ~50% halo alpha (peak) and the others at ~20% alpha (trough), with phases staggered so different subsets peak in different frames."*

## Workflow

### Step 1 — Verify nano-banana tool is loaded

If `mcp__nano-banana__generate_image` is not already in the tool list, run:

```
ToolSearch(query="select:mcp__nano-banana__generate_image", max_results=1)
```

If the MCP server isn't connected, ask the user to run `/mcp` to reconnect before proceeding.

### Step 2 — Check base image dimensions

Read the base image metadata to know the canvas dimensions — frames must match. Pick the closest supported `aspect_ratio` value (one of `1:1, 4:3, 3:4, 16:9, 9:16, 21:9, 2:3, 3:2, 4:5, 5:4`) to the base's width/height ratio.

```bash
py -c "from PIL import Image; img = Image.open('<base_path>'); print(img.size, img.mode)"
```

### Step 3 — Generate frame 1 (base only as reference)

Call `mcp__nano-banana__generate_image` with:

- `prompt` — follow the per-frame prompt template below, filled with frame 1's state and the rules block
- `input_image_path_1` — the base image path
- `mode="generate"` — **CRITICAL: must be `"generate"`, never `"edit"`. See `.agent.md` for the reason (resolution param is silently dropped in edit mode).**
- `model_tier="nb2"` — fast default. Use `"pro"` only if nb2 drifts too much on a particular base.
- `resolution="4k"` — required for output to match a high-res base. In generate mode this produces true native 4K+ output.
- `aspect_ratio` — matching the base's ratio (e.g. `"16:9"`).
- `output_path` — `<output_folder>/frame1.png`.
- `return_full_image=false` — keep MCP responses small.
- `negative_prompt="text, letters, numbers, labels, captions, watermarks, annotations, legends"` — suppresses the label-leak failure mode (see rule 6).

### Step 4 — Generate frames 2..N (base-only reference, NOT chained)

**DO NOT pass the previous frame as a second reference.** It feels intuitive (continuity for the overlay state) but in practice Gemini weights the previous frame heavily and drift accumulates: by frame 5–6 halos have multiplied, palette has shifted, silhouettes have warped. The loop ends up looking unrelated to the base.

Instead, for every frame after frame 1, call `generate_image` with **only `input_image_path_1` set to the base image** — same as frame 1. Each prompt must fully describe the overlay state for that frame from scratch (don't rely on the previous frame to "carry" state; the prompt is self-contained).

Arguments:
- `input_image_path_1` — the base image (no `input_image_path_2`)
- Same `mode="generate"`, `model_tier`, `resolution`, `aspect_ratio`, `output_path`, `negative_prompt` as frame 1.
- Prompt: use the frame-1 template structure (single reference), swapping in this frame's overlay state.

Since no frame depends on its predecessor, frames can in principle run in parallel — but nano-banana's backend often rate-limits, so sequential generation with retries on 503 is the safer default.

Retry on 503 / deadline-expired errors (nano-banana's Gemini backend occasionally times out on large inputs). Same prompt, same inputs — just re-invoke.

**Tradeoff:** adjacent frames won't have pixel-locked overlay continuity — a halo may land on a slightly different window, a firefly may be interpreted a few pixels off. The base itself stays pristine across all N frames, which is the more important consistency. If the jitter in overlay positions is too visible, that's a signal to fall back to local PIL compositing (see bottom of this file), not to add back previous-frame chaining.

### Step 5 — Verify output dimensions match the base

After all frames are generated, check each one matches the base's canvas dimensions exactly. If any frame came back at a smaller size (the edit-mode bug symptom), regenerate it — do NOT upscale with LANCZOS unless the user explicitly accepts softer output.

```bash
py -c "
from PIL import Image
from pathlib import Path
base = Image.open('<base_path>').size
for p in sorted(Path('<output_folder>').glob('frame*.png')):
    sz = Image.open(p).size
    ok = '✓' if sz == base else '✗ RESIZE or REGENERATE'
    print(f'{p.name}: {sz} {ok}')
"
```

### Step 6 — Sanity-check the delta magnitude

For the sprite animation to read as *one scene moving gently* rather than *different images flashing*, adjacent frames should differ in only a small fraction of pixels. Run a quick diff:

```bash
py -c "
from PIL import Image, ImageChops
import numpy as np
a = np.asarray(Image.open('frame1.png').convert('RGB'))
b = np.asarray(Image.open('frame2.png').convert('RGB'))
diff = np.abs(a.astype(int) - b.astype(int)).sum(axis=2)
changed = (diff > 10).sum()
pct = 100 * changed / diff.size
print(f'pixels changed >threshold: {pct:.2f}%')
"
```

- **< 3%** changed = healthy tiny-delta animation.
- **3–10%** = acceptable if motion is concentrated in a known overlay region (beams, halos).
- **> 10%** = the model is re-painting the base. Regenerate with a stricter prompt, or fall back to local PIL compositing (see fallback below).

### Step 7 — Color consistency check (critical for smooth loop)

Even if the delta % looks good, the per-frame mean RGB must stay stable. Global saturation / brightness drift between frames causes the worst loop flicker. Check:

```bash
py -c "
from PIL import Image
import numpy as np
from pathlib import Path
for p in sorted(Path('<output_folder>').glob('frame*.png')):
    arr = np.asarray(Image.open(p).convert('RGB'))
    mean = arr.mean(axis=(0,1))
    std = arr.std(axis=(0,1))
    print(f'{p.name}: mean RGB {mean.round(1).tolist()} | std {std.round(1).tolist()}')
"
```

- **Per-channel mean should vary by < 2 units across all frames.** If frame 3's mean red is 84.1 and frame 4's is 91.2, that's a saturation shift → regenerate frame 4.
- **Std (contrast) should also be stable** — a jump in std means the model re-applied a different contrast curve to one frame.
- **If drift is small but visible, run a normalization pass:** for each frame, rescale RGB per-channel so all frames share frame 1's mean/std. This is a last-resort fix — better to regenerate the offending frame with a stricter color-lock prompt first.

## Per-frame prompt template

For **frame 1**, use this structure:

```
You are generating FRAME 1 of {N} in a sprite animation loop. The ONE reference image is the STATIC BASE PAINTING. Reproduce the base pixel-for-pixel: same {palette, silhouettes, composition, stroke texture, ink outlines, paper grain, aspect ratio, transparency, framing, every detail}. Do NOT re-paint, re-compose, reinterpret, or restyle anything.

COLOR AND STYLE CONSISTENCY IS THE TOP PRIORITY. Keep the exact same palette, saturation, brightness, contrast, stroke thickness, paper grain, and ink-outline weight as the reference. Do NOT recolor, re-saturate, smooth, stylize, or re-render any pixel that is not part of the overlay elements listed below. Imagine this frame will be played in a loop with 7 others — any global color/saturation/contrast drift will read as a jarring flicker.

This frame must look like a near-identical copy of the base with ONLY these tiny overlay additions on top:

{frame 1 overlay descriptions — beams at angles X/Y/Z, halos on windows at positions A/B/C, ripples at radii, fireflies at positions, etc.}

Keep all base pixels stable. Output at the same resolution and aspect ratio as the reference.
```

For **frame 2..N**, use the SAME single-reference structure as frame 1 — the only difference is the overlay state values change to match that frame's position in the cycle. Do NOT pass the previous frame as a second reference (drift compounds; see Step 4).

```
You are generating FRAME {i} of {N} in a sprite animation loop. The ONE reference image is the STATIC BASE PAINTING. Reproduce the base pixel-for-pixel: same {palette, silhouettes, composition, stroke texture, ink outlines, paper grain, aspect ratio, transparency, framing, every detail}.

COLOR AND STYLE CONSISTENCY IS THE TOP PRIORITY. Keep the exact same palette, saturation, brightness, contrast, stroke thickness, paper grain, and ink-outline weight as the reference. Do NOT recolor, re-saturate, smooth, stylize, brighten, darken, or re-render any pixel that is not part of the overlay elements listed below. Imagine this frame will be played in a loop with {N-1} others — any global color/saturation/contrast drift will read as a jarring flicker.

This frame must look like a near-identical copy of the base with ONLY these overlay elements on top (fully specified, not advances from any other frame):

{frame i overlay descriptions — fully described, not as deltas}

Keep all base pixels stable. Output at the same resolution and aspect ratio as the reference.
```

Every frame's prompt is fully self-contained — state the overlay positions from scratch, never reference "frame i-1" or "advances". The model has only the base as context, so the prompt must carry all the state.

## Supporting files

Keep per-animation specs in a YAML or Markdown file in the same folder, e.g. `city_overlays/ANIMATION.md`, containing the 5 inputs above plus a state table per frame. When regenerating, read the spec file rather than asking the user to re-describe the animation.

## Fallback: local compositing for perfect identity

If the API consistently drifts the base style/silhouettes despite strict prompts (common for very busy paintings), abandon the API and render the overlay deltas in Python directly:

1. Load the base image with PIL at its native resolution.
2. For each frame, create a transparent overlay layer, draw the animated elements (beams as gradient polygons, halos as feathered circles, ripples as ellipses, fireflies as radial dots), and alpha-composite onto the base.
3. Save each composite as `frameN.png`.

This guarantees pixel-perfect identity between frames (only the overlay pixels change) and native base resolution. The tradeoff is the overlays look mathematically clean rather than painterly. See `chapter3/gen_sky_twinkle_frames.py` in this project for a working example — ~150 lines, produces 4 frames of subtle star twinkling on top of a 5504×3072 sky.

## Output

After success, summarize for the user:
- Number of frames generated and their file paths
- Verified dimensions (matching the base)
- The measured frame-to-frame delta % (from step 6)
- Any frames that needed regeneration and why
