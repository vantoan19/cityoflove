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

  return (
    <>
      <div
        data-testid="scene-tap-target"
        className={styles.tapTarget}
        role="button"
        tabIndex={0}
        onClick={() => { if (!isCTA) onAdvance() }}
        onKeyDown={(e) => { if (!isCTA && (e.key === 'Enter' || e.key === ' ')) onAdvance() }}
        aria-label="Tap to continue"
      />

      {isCTA && (
        <div className={styles.box}>
          <button className={styles.ctaButton} onClick={onComplete}>
            {beat.cta}
          </button>
        </div>
      )}
    </>
  )
}
