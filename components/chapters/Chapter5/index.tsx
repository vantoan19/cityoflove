'use client'
import { useRef } from 'react'
import './chapter5.css'

interface Props { onComplete: () => void }

export default function Chapter5({ onComplete }: Props) {
  const rootRef   = useRef<HTMLDivElement>(null)
  const rainRef   = useRef<HTMLDivElement>(null)
  const flashRef  = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <div className="ch5-root" ref={rootRef}>
      <div className="ch5-bg" />
      <div className="ch5-rain" ref={rainRef} />
      <div className="ch5-fog" />
      <div className="ch5-flash" ref={flashRef} />
      <div className="ch5-scroll" ref={scrollRef}>
        {/* beats added in later tasks */}
      </div>
    </div>
  )
}
