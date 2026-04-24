'use client'
import styles from './Characters.module.css'
import SpriteAnimation from './SpriteAnimation'
import { nickPoseConfigs, judyPoseConfigs } from './chapter1-poses'
import type { NickPose, JudyPose } from './types'

// styles import is required to inject the @keyframes poseEnter into the page
void styles

interface Props {
  nickPose: NickPose
  judyPose: JudyPose
}

export default function Characters({ nickPose, judyPose }: Props) {
  const nickCfg = nickPoseConfigs[nickPose]
  const judyCfg = judyPoseConfigs[judyPose]

  const charStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '18%',
    height: '38vh',
    width: 'auto',
    animation: 'poseEnter 0.4s ease-out forwards',
  }

  return (
    <>
      <SpriteAnimation
        key={`nick-${nickPose}`}
        frames={nickCfg.frames}
        frameInterval={nickCfg.frameInterval}
        alt="Nick"
        style={{ ...charStyle, left: '10%' }}
      />
      <SpriteAnimation
        key={`judy-${judyPose}`}
        frames={judyCfg.frames}
        frameInterval={judyCfg.frameInterval}
        alt="Judy"
        style={{ ...charStyle, right: '10%' }}
      />
    </>
  )
}
