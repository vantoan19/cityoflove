'use client'
import styles from './Characters.module.css'
import SpriteAnimation from './SpriteAnimation'
import SpeechBubble from './SpeechBubble'
import { nickPoseConfigs, judyPoseConfigs } from './chapter1-poses'
import type { NickPose, JudyPose } from './types'

interface Props {
  nickPose: NickPose
  judyPose: JudyPose
  focus: 'nick' | 'judy' | 'none'
  speechText: string | null
  phase: 'speaker' | 'reactor' | 'idle'
}

export default function Characters({ nickPose, judyPose, focus, speechText, phase }: Props) {
  const nickCfg = nickPoseConfigs[nickPose]
  const judyCfg = judyPoseConfigs[judyPose]

  const nickFocus = focus === 'nick' ? styles.focused : focus === 'judy' ? styles.unfocused : ''
  const judyFocus = focus === 'judy' ? styles.focused : focus === 'nick' ? styles.unfocused : ''

  return (
    <>
      <div className={`${styles.charOuter} ${styles.nick} ${nickFocus}`}>
        <div key={`nick-${nickPose}`} className={styles.charInner}>
          <SpriteAnimation frames={nickCfg.frames} frameInterval={nickCfg.frameInterval} alt="Nick" />
        </div>
        {focus === 'nick' && phase === 'speaker' && speechText && (
          <SpeechBubble text={speechText} side="left" />
        )}
      </div>

      <div className={`${styles.charOuter} ${styles.judy} ${judyFocus}`}>
        <div key={`judy-${judyPose}`} className={styles.charInner}>
          <SpriteAnimation frames={judyCfg.frames} frameInterval={judyCfg.frameInterval} alt="Judy" />
        </div>
      </div>
    </>
  )
}
