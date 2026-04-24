'use client'
import { useState, useEffect } from 'react'
import styles from './Background.module.css'

const CITY_FRAMES = 5
const FOREGROUND_FRAMES = 5
const CITY_FRAME_MS = 400
const FOREGROUND_FRAME_MS = 800

const windDelays = ['0s', '2.1s', '4.4s', '6.8s', '9.3s']
const windTops = ['18%', '32%', '24%', '40%', '28%']

export default function Background() {
  const [cityFrame, setCityFrame] = useState(1)
  const [fgFrame, setFgFrame] = useState(1)

  useEffect(() => {
    const id = setInterval(() => setCityFrame(f => (f % CITY_FRAMES) + 1), CITY_FRAME_MS)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setInterval(() => setFgFrame(f => (f % FOREGROUND_FRAMES) + 1), FOREGROUND_FRAME_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <div className={styles.scene}>
      {/* Layer 1: Sky */}
      <img
        className={styles.sky}
        src="/chapter1/backgrounds/sky/frame1.png"
        alt=""
        draggable={false}
      />

      {/* Layer 3: Mountains */}
      <img
        className={styles.mountains}
        src="/chapter1/backgrounds/mountains/frame1.png"
        alt=""
        draggable={false}
      />

      {/* Layer 4: City buildings (frame cycling + CSS drift) */}
      <img
        key={cityFrame}
        className={styles.city}
        src={`/chapter1/backgrounds/city_buildings/frame${cityFrame}.png`}
        alt=""
        draggable={false}
      />

      {/* Layer 5: Foreground bushes (frame cycling) */}
      <img
        key={`fg-${fgFrame}`}
        className={styles.foreground}
        src={`/chapter1/backgrounds/foreground_bushes/frame${fgFrame}.png`}
        alt=""
        draggable={false}
      />

      {/* Wind streaks (CSS only) */}
      {windDelays.map((delay, i) => (
        <div
          key={i}
          className={styles.windStreak}
          style={{ top: windTops[i], animationDelay: delay }}
        />
      ))}
    </div>
  )
}
