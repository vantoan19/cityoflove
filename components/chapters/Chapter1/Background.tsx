'use client'
import { useState, useEffect } from 'react'
import styles from './Background.module.css'

const SKY_FRAMES = 5
const CITY_FRAMES = 5
const FOREGROUND_FRAMES = 5
const SKY_FRAME_MS = 1200
const CITY_FRAME_MS = 400
const FOREGROUND_FRAME_MS = 800

const windDelays = ['0s', '2.1s', '4.4s', '6.8s', '9.3s']
const windTops = ['18%', '32%', '24%', '40%', '28%']

export default function Background() {
  const [skyFrame, setSkyFrame] = useState(1)
  const [cityFrame, setCityFrame] = useState(1)
  const [fgFrame, setFgFrame] = useState(1)

  useEffect(() => {
    const id = setInterval(() => setSkyFrame(f => (f % SKY_FRAMES) + 1), SKY_FRAME_MS)
    return () => clearInterval(id)
  }, [])

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
      {/* Layer 1: Sky (5-frame cycle + subtle pan) */}
      <img
        key={`sky-${skyFrame}`}
        className={`${styles.layer} ${styles.sky}`}
        src={`/chapter1/backgrounds/sky/frame${skyFrame}.png`}
        alt=""
        draggable={false}
      />

      {/* Layer 2: Mountains (single frame + sway) */}
      <img
        className={`${styles.layer} ${styles.mountains}`}
        src="/chapter1/backgrounds/mountains/frame1.png"
        alt=""
        draggable={false}
      />

      {/* Layer 3: City buildings (5-frame cycle + drift) */}
      <img
        key={`city-${cityFrame}`}
        className={`${styles.layer} ${styles.city}`}
        src={`/chapter1/backgrounds/city_buildings/frame${cityFrame}.png`}
        alt=""
        draggable={false}
      />

      {/* Layer 4: Foreground bushes (5-frame cycle) */}
      <img
        key={`fg-${fgFrame}`}
        className={styles.layer}
        src={`/chapter1/backgrounds/foreground_bushes/frame${fgFrame}.png`}
        alt=""
        draggable={false}
      />

      {/* Wind streaks */}
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
