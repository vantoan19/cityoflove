import type { Beat } from './types'

export const beats: Beat[] = [
  { text: null,                         nickPose: 'neutral_idle', judyPose: 'neutral_idle'     },
  { text: 'Some cities are planned.',   nickPose: 'presenting',   judyPose: 'neutral_idle'     },
  { text: "This one… wasn't.",          nickPose: 'shrug',        judyPose: 'smug'             },
  { text: 'It just appeared.',          nickPose: 'pointing_up',  judyPose: 'curious_pointing' },
  { text: 'Unexpected.',                nickPose: 'sunglasses',   judyPose: 'surprised'        },
  { text: 'A little chaotic.',          nickPose: 'finger_guns',  judyPose: 'amused'           },
  { text: 'Kind of fun.',               nickPose: 'thumbs_up',    judyPose: 'warm_happy'       },
  { text: null, cta: "Let's explore →", nickPose: 'thumbs_up',    judyPose: 'warm_happy'       },
]

export const INTRO_BEAT = 0
export const CTA_BEAT = 7
export const MAX_BEAT = beats.length - 1
