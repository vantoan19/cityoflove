# Chapter 1 Animation Tasks

Each subfolder contains one `animation.md` file with a ChatGPT-ready prompt set to generate the frames of that sprite animation.

## Canonical base images (identity anchor for EVERY frame)

- **Fox base:** `C:\Projects\zootopia\assets\base.png`
- **Bunny base:** `C:\Projects\zootopia\assets\basee.png`

Every character frame is generated using the appropriate base image as the primary identity reference. The generated frame must look **exactly** like the base image — same pose, same outfit, same proportions, same style — with only a very small sprite-animation delta applied (a couple of pixels of limb/tail/ear/tie shift, or a sub-degree tilt). **These are sprite animations: frame-to-frame changes are tiny on purpose.**

## Characters

### Fox (Nick)

- [pose1_neutral_idle](fox/pose1_neutral_idle/animation.md)
- [pose2_presenting](fox/pose2_presenting/animation.md)
- [pose3_shrug](fox/pose3_shrug/animation.md)
- [pose4_pointing_up](fox/pose4_pointing_up/animation.md)
- [pose5_adjusting_sunglasses](fox/pose5_adjusting_sunglasses/animation.md)
- [pose6_finger_guns](fox/pose6_finger_guns/animation.md)
- [pose7_thumbs_up](fox/pose7_thumbs_up/animation.md)

### Bunny (Judy)

- [pose1_neutral_idle](bunny/pose1_neutral_idle/animation.md)
- [pose2_smug](bunny/pose2_smug/animation.md)
- [pose3_curious_pointing](bunny/pose3_curious_pointing/animation.md)
- [pose4_surprised](bunny/pose4_surprised/animation.md)
- [pose5_amused](bunny/pose5_amused/animation.md)
- [pose6_warm_happy](bunny/pose6_warm_happy/animation.md)

## Backgrounds

- [sky](backgrounds/sky/animation.md)
- [cloud_a_large_puffy](backgrounds/cloud_a_large_puffy/animation.md)
- [cloud_b_medium_rounded](backgrounds/cloud_b_medium_rounded/animation.md)
- [cloud_c_small_puff](backgrounds/cloud_c_small_puff/animation.md)
- [cloud_d_long_wispy](backgrounds/cloud_d_long_wispy/animation.md)
- [mountains](backgrounds/mountains/animation.md)
- [city_buildings](backgrounds/city_buildings/animation.md)
- [foreground_bushes](backgrounds/foreground_bushes/animation.md)

## Global rules (apply to EVERY frame)

1. **Identity anchor:** start from `base.png` (fox) or `basee.png` (bunny). Every generated frame must look exactly like that base image — same stance, outfit, proportions, palette, facial features, clean white background, crayon / colored-pencil style.
2. **Sprite animation deltas are tiny:** each frame differs from its neighbours by only a few pixels of limb / tail / ear / tie / hat motion, or a sub-degree tilt. Do NOT re-pose the character. Do NOT swap the outfit. Do NOT change framing, scale, or palette.
3. **The pose for every frame in one animation is essentially the same.** Only the micro-movement specified for that frame is different.
4. **Preserve opaque whites:** all white fur, muzzle, paws, tail tips must stay fully opaque white. No paper texture, no black fill, no crop artifacts.
5. **Clean white background** in every frame.
6. **Same framing and scale** as the base image in every frame — do not zoom, crop, or re-centre.

## How to use

For each animation folder:

1. Open the `animation.md`.
2. Upload the base image(s) listed at the top of the file to ChatGPT (GPT Image) or pass them to the nano-banana MCP server.
3. For each frame, paste the frame prompt together with the uploaded base image(s).
4. Save the result as `frame1.png`, `frame2.png`, etc. inside the same folder.
