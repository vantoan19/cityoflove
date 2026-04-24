# Chapter 1 Assets

Generated from `CHAPTER1_ASSET_INVENTORY.md` with `scripts/generate_chapter1_assets.py`.

## Folder layout

- `backgrounds/sky/bg_sky.png`
- `backgrounds/clouds/cloud_a_frame1.png` to `cloud_d_frame2.png`
- `backgrounds/city/bg_city_buildings.png`
- `backgrounds/mountains/mountains.png`
- `backgrounds/foreground/foreground_frame1.png`
- `backgrounds/foreground/foreground_frame2_wind_left.png`
- `backgrounds/foreground/foreground_frame3_wind_right.png`
- `characters/nick/nick_pose1_frame1.png` to `nick_pose7_frame3.png`
- `characters/judy/judy_pose1_frame1.png` to `judy_pose6_frame2.png`

## Notes

- Reused source pose files were copied into canonical names where the inventory marked them as existing.
- Missing frames were synthesized from the provided source artwork with scripted bitmap transforms.
- Regenerate everything with:

```powershell
C:\Users\toan.tran\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe scripts\generate_chapter1_assets.py
```
