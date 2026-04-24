# Chapter 1 Character Generation Tasks

This folder contains copy-paste generation tasks for recreating Chapter 1 character frames manually in ChatGPT web using GPT Image.

## Files

- [Nick tasks](C:/Projects/zootopia/assets/chapter1/GPT_IMAGE_TASKS_NICK.md)
- [Judy tasks](C:/Projects/zootopia/assets/chapter1/GPT_IMAGE_TASKS_JUDY.md)

## Output folders

- Nick outputs: `C:\Projects\zootopia\assets\chapter1\characters\nick`
- Judy outputs: `C:\Projects\zootopia\assets\chapter1\characters\judy`

## Global instructions for every generation

Use these rules in every prompt:

- Match the supplied crayon / colored-pencil illustration style closely.
- Keep a clean white background.
- Preserve all white fur, muzzle, paws, tail tips, eye highlights, and teeth as opaque visible white.
- Keep character proportions, costume details, and facial features consistent with the supplied base art.
- Keep the full body visible unless the prompt explicitly says otherwise.
- Center the character on canvas with enough padding for frame-to-frame swaps in animation.
- Avoid paper texture, black fill, rectangular crop artifacts, or missing limbs.
- Keep the character facing the same general direction and scale as the provided reference image.

## Recommended workflow in ChatGPT web

For each frame:

1. Upload the base character image.
2. Upload the nearest pose reference image if one exists.
3. Paste the frame prompt from the relevant task sheet.
4. Download the result.
5. Save it to the exact canonical filename shown in the task sheet.

## Reused existing frames

These do not need regeneration unless you want higher consistency:

### Fox reused frames

- `nick_pose2_frame1.png` from `assets\ChatGPT Image Apr 20, 2026, 01_35_47 AM.png`
- `nick_pose3_frame2.png` from `assets\ChatGPT Image Apr 20, 2026, 01_42_58 AM.png`
- `nick_pose4_frame1.png` from `assets\ChatGPT Image Apr 20, 2026, 01_40_20 AM.png`
- `nick_pose5_frame2.png` from `assets\ChatGPT Image Apr 20, 2026, 01_47_19 AM.png`
- `nick_pose6_frame1.png` from `assets\ChatGPT Image Apr 20, 2026, 01_45_49 AM.png`
- `nick_pose7_frame2.png` from `assets\ChatGPT Image Apr 20, 2026, 01_58_26 AM.png`

### Bunny reused frames

- `judy_pose1_frame1.png` from `assets\ChatGPT Image Apr 20, 2026, 11_09_58 AM.png`
- `judy_pose2_frame1.png` from `assets\ChatGPT Image Apr 19, 2026, 01_46_26 PM.png`
- `judy_pose3_frame1.png` from `assets\ChatGPT Image Apr 20, 2026, 11_17_45 AM.png`
- `judy_pose5_frame1.png` from `assets\ChatGPT Image Apr 20, 2026, 11_09_58 AM.png`
- `judy_pose6_frame1.png` from `assets\ChatGPT Image Apr 20, 2026, 11_09_58 AM.png`

## Canonical frame counts

- Fox: 19 frames total
- Bunny: 14 frames total
- New GPT-image generations needed:
  - Fox: 13 frames if you reuse the marked existing ones
  - Bunny: 9 frames if you reuse the marked existing ones
