'use client'
import { useState, useEffect, useCallback } from 'react'
import Background from './Background'
import Characters from './Characters'
import DialogueBox from './DialogueBox'
import NavigationHint from './NavigationHint'
import { beats, INTRO_BEAT, CTA_BEAT, MAX_BEAT } from './chapter1-beats'
import { nickPoseConfigs, judyPoseConfigs } from './chapter1-poses'

interface Props {
  onComplete: () => void
}

function prefetchAssets() {
  const allFrames = [
    ...Object.values(nickPoseConfigs).flatMap(c => c.frames),
    ...Object.values(judyPoseConfigs).flatMap(c => c.frames),
  ]
  allFrames.forEach(src => { const img = new Image(); img.src = src })
}

export default function Chapter1({ onComplete }: Props) {
  const [currentBeat, setCurrentBeat] = useState(INTRO_BEAT)
  const [showHint, setShowHint] = useState(false)

  // Show "tap to begin" after 2s on beat 0
  useEffect(() => {
    if (currentBeat !== INTRO_BEAT) return
    const id = setTimeout(() => setShowHint(true), 2000)
    return () => clearTimeout(id)
  }, [currentBeat])

  // Prefetch remaining frames after first paint
  useEffect(() => {
    const id = setTimeout(prefetchAssets, 500)
    return () => clearTimeout(id)
  }, [])

  const handleAdvance = useCallback(() => {
    setCurrentBeat(b => {
      if (b >= MAX_BEAT) return b
      const next = b + 1
      if (next > INTRO_BEAT) setShowHint(false)
      return next
    })
  }, [])

  const beat = beats[currentBeat]
  const hintLabel = currentBeat === INTRO_BEAT ? 'Tap to begin ↓' : 'Tap to continue'

  return (
    <div
      data-testid="chapter-1"
      style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}
    >
      <Background />
      <Characters nickPose={beat.nickPose} judyPose={beat.judyPose} />

      {currentBeat > INTRO_BEAT && currentBeat < CTA_BEAT && (
        <DialogueBox
          beat={beat}
          beatIndex={currentBeat}
          onAdvance={handleAdvance}
          onComplete={onComplete}
        />
      )}

      {currentBeat === INTRO_BEAT && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Tap to begin"
          onClick={handleAdvance}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleAdvance() }}
          style={{ position: 'absolute', inset: 0, zIndex: 10, cursor: 'pointer' }}
          data-testid="scene-intro-tap"
        />
      )}

      {currentBeat === CTA_BEAT && (
        <DialogueBox
          beat={beat}
          beatIndex={currentBeat}
          onAdvance={handleAdvance}
          onComplete={onComplete}
        />
      )}

      {showHint && <NavigationHint label={hintLabel} />}
    </div>
  )
}
