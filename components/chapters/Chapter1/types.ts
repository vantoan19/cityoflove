export type NickPose =
  | 'neutral_idle' | 'presenting' | 'shrug' | 'pointing_up'
  | 'sunglasses' | 'finger_guns' | 'thumbs_up'

export type JudyPose =
  | 'neutral_idle' | 'smug' | 'curious_pointing'
  | 'surprised' | 'amused' | 'warm_happy'

export interface Beat {
  text: string | null
  cta?: string
  reaction?: string
  nickPose: NickPose
  judyPose: JudyPose
}

export interface PoseConfig {
  frames: string[]       // absolute public paths e.g. /chapter1/characters/nick/...
  frameInterval: number  // ms between frames
}
