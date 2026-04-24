'use client'
import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import ChapterTransition from './ChapterTransition'
import ChapterStub from './chapters/ChapterStub'

type Dir = 'rtl' | 'ltr' | 'btt' | 'ttb'

const Chapter1 = dynamic(() => import('./chapters/Chapter1'), { ssr: false })
const Chapter2 = dynamic(() => import('./chapters/Chapter2'), { ssr: false })
const Chapter3 = dynamic(() => import('./chapters/Chapter3'), { ssr: false })
const Chapter5 = dynamic(() => import('./chapters/Chapter5'), { ssr: false })

function dirFor(to: number): Dir {
  if (to === 2) return 'ttb'   // ch1 → ch2: top-to-bottom
  if (to === 3) return 'btt'   // ch2 → ch3: bottom-to-top
  return 'rtl'
}

export default function SceneManager() {
  const [currentChapter, setCurrentChapter] = useState(() => {
    if (typeof window !== 'undefined') {
      const n = parseInt(window.location.hash.replace('#ch', ''), 10)
      if (n >= 1) return n
    }
    return 1
  })
  const [transitioning, setTransitioning] = useState(false)
  const [pendingChapter, setPendingChapter] = useState<number | null>(null)
  const [transitionDir, setTransitionDir] = useState<Dir>('rtl')

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

  return (
    <div style={{ width: '100vw', height: '100dvh', overflow: 'hidden', position: 'relative' }}>
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
      {currentChapter > 3 && currentChapter !== 5 && (
        <div data-testid={`chapter-stub-${currentChapter}`} style={{ width: '100%', height: '100%' }}>
          <ChapterStub
            chapterNumber={currentChapter}
            onBack={() => advanceChapter(1)}
          />
        </div>
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
