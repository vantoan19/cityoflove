'use client'
import styles from './Characters.module.css'
import SpriteAnimation from './SpriteAnimation'
import { nickPoseConfigs, judyPoseConfigs } from './chapter1-poses'
import type { NickPose, JudyPose } from './types'

interface Props {
  nickPose: NickPose
  judyPose: JudyPose
}

export default function Characters({ nickPose, judyPose }: Props) {
  const nickCfg = nickPoseConfigs[nickPose]
  const judyCfg = judyPoseConfigs[judyPose]

  return (
    <>
      <div key={`nick-${nickPose}`} className={`${styles.character} ${styles.nick}`}>
        <SpriteAnimation
          frames={nickCfg.frames}
          frameInterval={nickCfg.frameInterval}
          alt="Nick"
        />
      </div>
      <div key={`judy-${judyPose}`} className={`${styles.character} ${styles.judy}`}>
        <SpriteAnimation
          frames={judyCfg.frames}
          frameInterval={judyCfg.frameInterval}
          alt="Judy"
        />
      </div>
    </>
  )
}
