'use client'
import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import ChapterTransition from './ChapterTransition'
import ChapterStub from './chapters/ChapterStub'

const Chapter1 = dynamic(() => import('./chapters/Chapter1'), { ssr: false })

export default function SceneManager() {
  const [currentChapter, setCurrentChapter] = useState(1)
  const [transitioning, setTransitioning] = useState(false)
  const [pendingChapter, setPendingChapter] = useState<number | null>(null)

  const advanceChapter = useCallback((to: number) => {
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
      {currentChapter !== 1 && (
        <div data-testid={`chapter-stub-${currentChapter}`} style={{ width: '100%', height: '100%' }}>
          <ChapterStub
            chapterNumber={currentChapter}
            onBack={() => advanceChapter(1)}
          />
        </div>
      )}
      <ChapterTransition
        active={transitioning}
        onMidpoint={handleMidpoint}
        onDone={handleTransitionDone}
      />
    </div>
  )
}
