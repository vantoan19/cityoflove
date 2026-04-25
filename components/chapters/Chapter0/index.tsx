'use client'
import { useState, useEffect, useRef } from 'react'
import type { ChangeEvent, KeyboardEvent } from 'react'
import './chapter0.css'

interface Props {
  onComplete: () => void
}

type Phase = 'idle' | 'passwordPrompt' | 'opening' | 'zooming'

const IDLE_FRAMES = [
  '/loveletter/idle/frame1.png',
  '/loveletter/idle/frame2.png',
  '/loveletter/idle/frame3.png',
]

const OPENING_FRAMES = [
  '/loveletter/opening/frame1.png',
  '/loveletter/opening/frame2.png',
  '/loveletter/opening/frame3.png',
  '/loveletter/opening/frame4.png',
  '/loveletter/opening/frame5.png',
  '/loveletter/opening/frame6.png',
  '/loveletter/opening/frame7.png',
]

const OPENING_DURATIONS = [200, 200, 200, 200, 250, 250, 250]

const CORRECT_PASSWORD = '19/03/2026'

export default function Chapter0({ onComplete }: Props) {
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  // Pending timers from event handlers — cleared on unmount
  const pendingTimers = useRef<ReturnType<typeof setTimeout>[]>([])

  const [phase, setPhase] = useState<Phase>('idle')
  const [idleFrame, setIdleFrame] = useState(0)
  const [openingFrame, setOpeningFrame] = useState(0)
  const [password, setPassword] = useState('')
  const [inputError, setInputError] = useState(false)
  const [modalClosing, setModalClosing] = useState(false)
  const [whiteVisible, setWhiteVisible] = useState(false)

  // Clear all event-handler timers on unmount
  useEffect(() => {
    return () => { pendingTimers.current.forEach(clearTimeout) }
  }, [])

  // Prefetch all frames so animations play immediately
  useEffect(() => {
    ;[...IDLE_FRAMES, ...OPENING_FRAMES].forEach(src => {
      const img = new Image()
      img.src = src
    })
  }, [])

  // Idle frame loop — 800ms per frame
  useEffect(() => {
    if (phase !== 'idle') return
    const id = setInterval(() => {
      setIdleFrame(f => (f + 1) % IDLE_FRAMES.length)
    }, 800)
    return () => clearInterval(id)
  }, [phase])

  // Opening animation sequencer — all timer IDs captured for cancellation
  useEffect(() => {
    if (phase !== 'opening') return
    let frameIdx = 0
    const timers: ReturnType<typeof setTimeout>[] = []

    function playFrame() {
      setOpeningFrame(frameIdx)
      const duration = OPENING_DURATIONS[frameIdx]
      if (frameIdx < OPENING_FRAMES.length - 1) {
        frameIdx++
        timers.push(setTimeout(playFrame, duration))
      } else {
        timers.push(setTimeout(() => {
          setPhase('zooming')
          setWhiteVisible(true)
        }, duration))
      }
    }

    playFrame()
    return () => timers.forEach(clearTimeout)
  }, [phase])

  // Zoom phase: call onComplete after 850ms
  useEffect(() => {
    if (phase !== 'zooming') return
    const id = setTimeout(() => {
      onCompleteRef.current()
    }, 850)
    return () => clearTimeout(id)
  }, [phase])

  function handleLetterClick() {
    if (phase !== 'idle') return
    setPhase('passwordPrompt')
  }

  function handleSubmit() {
    if (password.trim() === CORRECT_PASSWORD) {
      setModalClosing(true)
      const id = setTimeout(() => {
        setPhase('opening')
        setModalClosing(false)
      }, 200)
      pendingTimers.current.push(id)
    } else {
      setInputError(true)
      const id = setTimeout(() => setInputError(false), 600)
      pendingTimers.current.push(id)
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSubmit()
  }

  const currentSrc =
    phase === 'opening' || phase === 'zooming'
      ? OPENING_FRAMES[openingFrame]
      : IDLE_FRAMES[idleFrame]

  return (
    <div className="ch0-root">
      <img
        src={currentSrc}
        alt=""
        className={`ch0-letter-img${phase === 'zooming' ? ' ch0-zooming' : ''}`}
        onClick={handleLetterClick}
        draggable={false}
      />

      {phase === 'idle' && (
        <div className="ch0-hint">tap to open ♡</div>
      )}

      {(phase === 'passwordPrompt' || modalClosing) && (
        <div className="ch0-modal-backdrop">
          <div className={`ch0-modal${modalClosing ? ' ch0-closing' : ''}`}>
            <p>There is only 1 special person can open this love letter.</p>
            <p>The password is the first day we met and talk to each other</p>
            <input
              className={`ch0-input${inputError ? ' ch0-input-error' : ''}`}
              type="text"
              inputMode="text"
              placeholder="DD/MM/YYYY"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <div className="ch0-error-text">
              {inputError ? "That's not right… try again ♡" : ''}
            </div>
            <button className="ch0-btn" onClick={handleSubmit}>
              open ♡
            </button>
          </div>
        </div>
      )}

      <div className={`ch0-white-overlay${whiteVisible ? ' ch0-fade-in' : ''}`} />
    </div>
  )
}
