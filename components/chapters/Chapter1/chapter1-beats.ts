import type { Beat } from './types'

export const beats: Beat[] = [
  { text: null,                         nickPose: 'neutral_idle', judyPose: 'neutral_idle'                          },
  { text: 'Some cities are planned.',   nickPose: 'presenting',   judyPose: 'neutral_idle',    reaction: 'Ohh?'     },
  { text: "This one… wasn't.",     nickPose: 'shrug',        judyPose: 'smug',            reaction: 'Really?!' },
  { text: 'It just appeared.',          nickPose: 'pointing_up',  judyPose: 'curious_pointing',reaction: "What's that?" },
  { text: 'Unexpected.',                nickPose: 'sunglasses',   judyPose: 'surprised',       reaction: 'Ahh!'     },
  { text: 'A little chaotic.',          nickPose: 'finger_guns',  judyPose: 'amused',          reaction: 'Ha ha!'   },
  { text: 'Kind of fun.',               nickPose: 'thumbs_up',    judyPose: 'warm_happy',      reaction: 'Heehee~'  },
  { text: null, cta: "Let's explore →", nickPose: 'thumbs_up', judyPose: 'warm_happy'                          },
]

export const INTRO_BEAT = 0
export const CTA_BEAT = 7
export const MAX_BEAT = beats.length - 1
