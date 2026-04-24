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

type Phase = 'speaker' | 'reactor' | 'idle'

function prefetchAssets() {
  const allFrames = [
    ...Object.values(nickPoseConfigs).flatMap(c => c.frames),
    ...Object.values(judyPoseConfigs).flatMap(c => c.frames),
  ]
  allFrames.forEach(src => { const img = new Image(); img.src = src })
}

export default function Chapter1({ onComplete }: Props) {
  const [currentBeat, setCurrentBeat] = useState(INTRO_BEAT)
  const [phase, setPhase] = useState<Phase>('idle')
  const [showIntroHint, setShowIntroHint] = useState(false)

  // Show intro hint after 2s
  useEffect(() => {
    if (currentBeat !== INTRO_BEAT) return
    const id = setTimeout(() => setShowIntroHint(true), 2000)
    return () => clearTimeout(id)
  }, [currentBeat])

  // Prefetch remaining frames after first paint
  useEffect(() => {
    const id = setTimeout(prefetchAssets, 500)
    return () => clearTimeout(id)
  }, [])

  // Set speaker phase when beat advances — no auto-transition to reactor
  useEffect(() => {
    if (currentBeat === INTRO_BEAT || currentBeat === CTA_BEAT) {
      setPhase('idle')
      return
    }
    setPhase('speaker')
  }, [currentBeat])

  // Each click advances: intro → beat1, speaker → reactor, reactor → next beat
  const handleAdvance = useCallback(() => {
    if (currentBeat === INTRO_BEAT) {
      setCurrentBeat(1)
      setShowIntroHint(false)
      return
    }
    if (currentBeat >= MAX_BEAT) return
    if (phase === 'speaker') {
      setPhase('reactor')
    } else if (phase === 'reactor') {
      setCurrentBeat(b => b + 1)
    }
  }, [currentBeat, phase])

  const beat = beats[currentBeat]
  const isDialogue = currentBeat > INTRO_BEAT && currentBeat < CTA_BEAT

  const focus = currentBeat === INTRO_BEAT || currentBeat === CTA_BEAT
    ? 'none'
    : phase === 'speaker' ? 'nick' : 'judy'

  const speechText = phase === 'speaker' && isDialogue ? beat.text : null
  const reactionText = phase === 'reactor' && isDialogue ? (beat.reaction ?? null) : null

  const cameraTransform =
    phase === 'idle'    ? 'scale(1) translateX(0)' :
    phase === 'speaker' ? 'scale(2) translateX(8%)' :
                          'scale(2) translateX(-8%)'

  const hintLabel =
    currentBeat === INTRO_BEAT ? 'Tap anywhere to begin' :
    phase === 'speaker'        ? 'Tap to see her reaction →' :
                                 'Tap to continue →'

  return (
    <div
      data-testid="chapter-1"
      style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}
    >
      {/* Zoomable scene layer */}
      <div style={{
        position: 'absolute', inset: 0,
        transform: cameraTransform,
        transformOrigin: '50% 85%',
        transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <Background />
        <Characters
          nickPose={beat.nickPose}
          judyPose={beat.judyPose}
          focus={focus as 'nick' | 'judy' | 'none'}
          speechText={speechText}
          reactionText={reactionText}
          phase={phase}
        />
      </div>

      {/* Title — always visible */}
      <img
        src="/chapter1/title.png"
        alt="The City of Love"
        style={{
          position: 'absolute',
          top: 'calc(18% - 50vh)',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'clamp(400px, 75vw, 1100px)',
          zIndex: 5,
          pointerEvents: 'none',
          opacity: phase === 'idle' ? 1 : 0,
          transition: 'opacity 0.5s ease',
          filter: 'drop-shadow(0 0 18px rgba(0,0,0,0.9)) drop-shadow(0 0 40px rgba(0,0,0,0.7))',
        }}
      />

      {/* Dialogue tap target */}
      {isDialogue && (
        <DialogueBox
          beat={beat}
          beatIndex={currentBeat}
          onAdvance={handleAdvance}
          onComplete={onComplete}
        />
      )}

      {/* Intro full-screen tap */}
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

      {/* CTA beat — Let's explore button */}
      {currentBeat === CTA_BEAT && (
        <>
          <button
            onClick={onComplete}
            style={{
              position: 'absolute',
              bottom: 'calc(22% + 30vh)',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 20,
              padding: '14px 40px',
              fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
              fontFamily: 'var(--font-lilita), Georgia, serif',
              fontWeight: '400',
              color: '#fff',
              background: 'linear-gradient(135deg, #2ecc71 0%, #1abc9c 100%)',
              border: '3px solid rgba(255,255,255,0.4)',
              borderRadius: '50px',
              cursor: 'pointer',
              letterSpacing: '0.05em',
              animation: 'explorePulse 2.2s ease-in-out infinite',
            }}
          >
            Let&apos;s explore ✦
          </button>
          <style>{`
            @keyframes explorePulse {
              0%, 100% { box-shadow: 0 4px 24px rgba(0,0,0,0.4), 0 0 0 0 rgba(46,204,113,0.5); }
              50%       { box-shadow: 0 4px 24px rgba(0,0,0,0.4), 0 0 0 12px rgba(46,204,113,0); }
            }
          `}</style>
        </>
      )}

      {/* Navigation hint — intro (after delay) or always during dialogue */}
      {(showIntroHint || isDialogue) && currentBeat !== CTA_BEAT && (
        <NavigationHint label={hintLabel} />
      )}
    </div>
  )
}
