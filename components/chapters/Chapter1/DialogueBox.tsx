'use client'
import styles from './DialogueBox.module.css'
import type { Beat } from './types'
import { CTA_BEAT } from './chapter1-beats'

interface Props {
  beat: Beat
  beatIndex: number
  onAdvance: () => void
  onComplete: () => void
}

export default function DialogueBox({ beat, beatIndex, onAdvance, onComplete }: Props) {
  const isCTA = beatIndex === CTA_BEAT

  const handleTap = () => {
    if (!isCTA) onAdvance()
  }

  return (
    <>
      <div
        data-testid="scene-tap-target"
        className={styles.tapTarget}
        role="button"
        tabIndex={0}
        onClick={handleTap}
        onKeyDown={(e) => { if (!isCTA && (e.key === 'Enter' || e.key === ' ')) onAdvance() }}
        aria-label="Tap to continue"
      />

      <div className={styles.box}>
        {!isCTA && beat.text && (
          <p key={beat.text} className={styles.text}>{beat.text}</p>
        )}

        {isCTA && (
          <button className={styles.ctaButton} onClick={onComplete}>
            {beat.cta}
          </button>
        )}

        <div className={styles.dots}>
          {Array.from({ length: 7 }, (_, i) => {
            const dotBeat = i + 1
            const state =
              dotBeat < beatIndex ? 'dotPast' :
              dotBeat === beatIndex ? 'dotCurrent' : 'dotFuture'
            return (
              <div
                key={dotBeat}
                data-testid="beat-dot"
                className={`${styles.dot} ${styles[state]}`}
              />
            )
          })}
        </div>
      </div>
    </>
  )
}
