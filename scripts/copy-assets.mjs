import { cpSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

const SRC = 'chapter1/animations'
const DST = 'public/chapter1'

function copy(src, dst) {
  if (!existsSync(src)) { console.warn(`SKIP (missing): ${src}`); return }
  mkdirSync(dst, { recursive: true })
  cpSync(src, dst, { recursive: true, filter: p => !p.endsWith('animation.md') })
  console.log(`✓ ${src} → ${dst}`)
}

// Backgrounds
for (const layer of ['sky', 'mountains', 'city_buildings', 'foreground_bushes']) {
  copy(join(SRC, 'backgrounds', layer), join(DST, 'backgrounds', layer))
}

// Nick (fox)
const nickPoses = [
  'pose1_neutral_idle', 'pose2_presenting', 'pose3_shrug',
  'pose4_pointing_up', 'pose5_adjusting_sunglasses', 'pose6_finger_guns', 'pose7_thumbs_up',
]
for (const pose of nickPoses) {
  copy(join(SRC, 'fox', pose), join(DST, 'characters', 'nick', pose))
}

// Judy (bunny)
const judyPoses = [
  'pose1_neutral_idle', 'pose2_smug', 'pose3_curious_pointing',
  'pose4_surprised', 'pose5_amused', 'pose6_warm_happy',
]
for (const pose of judyPoses) {
  copy(join(SRC, 'bunny', pose), join(DST, 'characters', 'judy', pose))
}

console.log('\nDone. Assets in public/chapter1/')
