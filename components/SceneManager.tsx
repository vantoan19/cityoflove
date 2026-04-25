'use client'
import { useState, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import ChapterTransition from './ChapterTransition'
import ChapterStub from './chapters/ChapterStub'

type Dir = 'rtl' | 'ltr' | 'btt' | 'ttb'

const Chapter0 = dynamic(() => import('./chapters/Chapter0'), { ssr: false })
const Chapter1 = dynamic(() => import('./chapters/Chapter1'), { ssr: false })
const Chapter2 = dynamic(() => import('./chapters/Chapter2'), { ssr: false })
const Chapter3 = dynamic(() => import('./chapters/Chapter3'), { ssr: false })
const Chapter5 = dynamic(() => import('./chapters/Chapter5'), { ssr: false })
const Chapter6 = dynamic(() => import('./chapters/Chapter6'), { ssr: false })

function dirFor(to: number): Dir {
  if (to === 2) return 'ttb'
  if (to === 3) return 'btt'
  if (to === 7) return 'ttb'
  return 'rtl'
}

export default function SceneManager() {
  const [currentChapter, setCurrentChapter] = useState(() => {
    if (typeof window !== 'undefined') {
      const n = parseInt(window.location.hash.replace('#ch', ''), 10)
      if (!isNaN(n) && n >= 0) return n
    }
    return 0
  })
  const [transitioning, setTransitioning] = useState(false)
  const [pendingChapter, setPendingChapter] = useState<number | null>(null)
  const [transitionDir, setTransitionDir] = useState<Dir>('rtl')

  // White overlay that bridges the ch0 → ch1 unmount gap
  const ch0CompletedRef = useRef(false)
  const [ch0FadeOut, setCh0FadeOut] = useState(false)
  const [ch0FadeOpacity, setCh0FadeOpacity] = useState(0)

  const advanceChapter = useCallback((to: number) => {
    setTransitionDir(dirFor(to))
    setPendingChapter(to)
    setTransitioning(true)
  }, [])

  const handleMidpoint = useCallback(() => {
    if (pendingChapter !== null) setCurrentChapter(pendingChapter)
  }, [pendingChapter])

  const handleTransitionDone = useCallback(() => {
    setTransitioning(false)
    setPendingChapter(null)
  }, [])

  // ch0 complete: direct switch to ch1, no cloud wipe
  const handleCh0Complete = useCallback(() => {
    if (ch0CompletedRef.current) return
    ch0CompletedRef.current = true
    setCurrentChapter(1)
    setCh0FadeOut(true)
    setCh0FadeOpacity(1)
    // Two rAF ticks to ensure the div is painted at opacity 1 before transitioning
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setCh0FadeOpacity(0)
      })
    })
    // Fallback: guarantee cleanup even if transitionend never fires (e.g. hidden tab)
    setTimeout(() => setCh0FadeOut(false), 700)
  }, [])

  return (
    <div style={{ width: '100vw', height: '100dvh', overflow: 'hidden', position: 'relative' }}>
      {currentChapter === 0 && (
        <div data-testid="chapter-0" style={{ width: '100%', height: '100%' }}>
          <Chapter0 onComplete={handleCh0Complete} />
        </div>
      )}
      {currentChapter === 1 && (
        <div data-testid="chapter-1" style={{ width: '100%', height: '100%' }}>
          <Chapter1 onComplete={() => advanceChapter(2)} />
        </div>
      )}
      {currentChapter === 2 && (
        <div data-testid="chapter-2" style={{ width: '100%', height: '100%' }}>
          <Chapter2 onComplete={() => advanceChapter(3)} />
        </div>
      )}
      {currentChapter === 3 && (
        <div data-testid="chapter-3" style={{ width: '100%', height: '100%' }}>
          <Chapter3 onComplete={() => advanceChapter(4)} />
        </div>
      )}
      {currentChapter === 5 && (
        <div data-testid="chapter-5" style={{ width: '100%', height: '100%' }}>
          <Chapter5 onComplete={() => advanceChapter(6)} />
        </div>
      )}
      {currentChapter === 6 && (
        <div data-testid="chapter-6" style={{ width: '100%', height: '100%' }}>
          <Chapter6 onComplete={() => advanceChapter(7)} />
        </div>
      )}
      {currentChapter > 3 && currentChapter !== 5 && currentChapter !== 6 && (
        <div data-testid={`chapter-stub-${currentChapter}`} style={{ width: '100%', height: '100%' }}>
          <ChapterStub
            chapterNumber={currentChapter}
            onBack={() => advanceChapter(1)}
          />
        </div>
      )}

      {/* White overlay that fades out after ch0 → ch1 switch */}
      {ch0FadeOut && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: '#fff',
            opacity: ch0FadeOpacity,
            transition: 'opacity 500ms ease-in-out',
            zIndex: 50,
            pointerEvents: 'none',
          }}
          onTransitionEnd={() => setCh0FadeOut(false)}
        />
      )}

      <ChapterTransition
        active={transitioning}
        dir={transitionDir}
        onMidpoint={handleMidpoint}
        onDone={handleTransitionDone}
      />
    </div>
  )
}
