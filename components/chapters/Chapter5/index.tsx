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
        <div className="ch5-sp" />

        {/* b1: deceptive calm */}
        <div className="ch5-beat" id="ch5-b1">
          <p className="ch5-t-calm">Then…</p>
        </div>
        <div className="ch5-sp" />

        {/* b2 */}
        <div className="ch5-beat" id="ch5-b2">
          <p className="ch5-t-bold">we did something impressive.</p>
        </div>
        <div className="ch5-sp" />

        {/* b3: hero line */}
        <div className="ch5-beat" id="ch5-b3">
          <p className="ch5-t-hero">We speedran a relationship.</p>
        </div>
        <div className="ch5-sp" />

        {/* b4: monospace trio */}
        <div className="ch5-beat" id="ch5-b4">
          <p className="ch5-t-mono">Any% completion.</p>
          <p className="ch5-t-mono" data-d="150">No tutorials.</p>
          <p className="ch5-t-mono" data-d="300">No save points.</p>
        </div>
        <div className="ch5-sp" />

        {/* b7 */}
        <div className="ch5-beat" id="ch5-b7">
          <p className="ch5-t-bold">I might have pressed</p>
        </div>
        <div className="ch5-sp" />

        {/* b8: skew glitch */}
        <div className="ch5-beat ch5-skew" id="ch5-b8">
          <p className="ch5-t-quote">&ldquo;fast forward&rdquo;</p>
        </div>
        <div className="ch5-sp" />

        {/* b9: confession */}
        <div className="ch5-beat" id="ch5-b9">
          <p className="ch5-t-conf">a bit too hard.</p>
        </div>

        {/* M2 beats added in Task 5 */}
      </div>
    </div>
  )
}
