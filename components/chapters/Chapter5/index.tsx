'use client'
import { useRef, useEffect } from 'react'
import './chapter5.css'

interface Props { onComplete: () => void }

function spawnRain(
  container: HTMLDivElement,
  count: number, minDur: number, maxDur: number,
  minOp: number, maxOp: number, dxRange: number
) {
  container.innerHTML = ''
  for (let i = 0; i < count; i++) {
    const drop = document.createElement('div')
    drop.className = 'ch5-drop'
    const dur = minDur + Math.random() * (maxDur - minDur)
    const op  = minOp  + Math.random() * (maxOp  - minOp)
    const dx  = -(Math.random() * dxRange)
    const h   = 12 + Math.random() * 6
    drop.style.cssText = [
      `left:${Math.random() * 110 - 5}vw`,
      `height:${h}px`,
      `opacity:${op}`,
      `--dx:${dx}px`,
      `animation-duration:${dur.toFixed(2)}s`,
      `animation-delay:${(Math.random() * maxDur * -1).toFixed(2)}s`,
    ].join(';')
    container.appendChild(drop)
  }
}

export default function Chapter5({ onComplete }: Props) {
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const rootRef   = useRef<HTMLDivElement>(null)
  const rainRef   = useRef<HTMLDivElement>(null)
  const flashRef  = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const rain = rainRef.current
    if (!rain) return
    spawnRain(rain, 80, 1.0, 1.4, 0.4, 0.7, 20)
    return () => { rain.innerHTML = '' }
  }, [])

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
