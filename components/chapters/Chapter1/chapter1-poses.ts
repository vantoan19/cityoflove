import type { NickPose, JudyPose, PoseConfig } from './types'

const n = (_pose: string, count: number, dir: string): string[] =>
  Array.from({ length: count }, (_, i) =>
    `/chapter1/characters/nick/${dir}/frame${i + 1}.png`
  )

const j = (_pose: string, count: number, dir: string): string[] =>
  Array.from({ length: count }, (_, i) =>
    `/chapter1/characters/judy/${dir}/frame${i + 1}.png`
  )

export const nickPoseConfigs: Record<NickPose, PoseConfig> = {
  neutral_idle: { frames: n('', 3, 'pose1_neutral_idle'),            frameInterval: 350 },
  presenting:   { frames: n('', 2, 'pose2_presenting'),              frameInterval: 400 },
  shrug:        { frames: n('', 3, 'pose3_shrug'),                   frameInterval: 300 },
  pointing_up:  { frames: n('', 2, 'pose4_pointing_up'),             frameInterval: 300 },
  sunglasses:   { frames: n('', 4, 'pose5_adjusting_sunglasses'),    frameInterval: 250 },
  finger_guns:  { frames: n('', 2, 'pose6_finger_guns'),             frameInterval: 250 },
  thumbs_up:    { frames: n('', 3, 'pose7_thumbs_up'),               frameInterval: 300 },
}

export const judyPoseConfigs: Record<JudyPose, PoseConfig> = {
  neutral_idle:     { frames: j('', 3, 'pose1_neutral_idle'),        frameInterval: 350 },
  smug:             { frames: j('', 2, 'pose2_smug'),                frameInterval: 500 },
  curious_pointing: { frames: j('', 2, 'pose3_curious_pointing'),    frameInterval: 500 },
  surprised:        { frames: j('', 3, 'pose4_surprised'),           frameInterval: 350 },
  amused:           { frames: j('', 2, 'pose5_amused'),              frameInterval: 550 },
  warm_happy:       { frames: j('', 2, 'pose6_warm_happy'),          frameInterval: 550 },
}
