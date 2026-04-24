'use client'
import { useState, useEffect, useRef } from 'react'
import styles from './Background.module.css'

const windDelays = ['0s', '2.1s', '4.4s', '6.8s', '9.3s']
const windTops = ['18%', '32%', '24%', '40%', '28%']

const skyFrames  = Array.from({ length: 5 }, (_, i) => `/chapter1/backgrounds/sky/frame${i + 1}.png`)
const cityFrames = Array.from({ length: 5 }, (_, i) => `/chapter1/backgrounds/city_buildings/frame${i + 1}.png`)
const fgFrames   = Array.from({ length: 5 }, (_, i) => `/chapter1/backgrounds/foreground_bushes/frame${i + 1}.png`)

function useCrossfade(frames: string[], intervalMs: number) {
  const [slot, setSlot] = useState<0 | 1>(0)
  const [srcs, setSrcs] = useState<[string, string]>([frames[0], frames[0]])
  const slotRef = useRef<0 | 1>(0)
  const idxRef = useRef(0)

  useEffect(() => {
    const id = setInterval(() => {
      idxRef.current = (idxRef.current + 1) % frames.length
      const next: 0 | 1 = slotRef.current === 0 ? 1 : 0
      slotRef.current = next
      setSrcs(prev => {
        const updated: [string, string] = [prev[0], prev[1]]
        updated[next] = frames[idxRef.current]
        return updated
      })
      setSlot(next)
    }, intervalMs)
    return () => clearInterval(id)
  }, [frames, intervalMs])

  return { slot, srcs }
}

export default function Background() {
  const sky  = useCrossfade(skyFrames,  1200)
  const city = useCrossfade(cityFrames,  400)
  const fg   = useCrossfade(fgFrames,   800)

  return (
    <div className={styles.scene}>
      <div className={`${styles.layerWrapper} ${styles.sky}`}>
        <img src={sky.srcs[0]} className={styles.layerImg} style={{ opacity: sky.slot === 0 ? 1 : 0 }} alt="" draggable={false} />
        <img src={sky.srcs[1]} className={styles.layerImg} style={{ opacity: sky.slot === 1 ? 1 : 0 }} alt="" draggable={false} />
      </div>

      <div className={`${styles.layerWrapper} ${styles.mountains}`}>
        <img src="/chapter1/backgrounds/mountains/frame1.png" className={styles.layerImg} alt="" draggable={false} />
      </div>

      <div className={`${styles.layerWrapper} ${styles.city}`}>
        <img src={city.srcs[0]} className={styles.layerImg} style={{ opacity: city.slot === 0 ? 1 : 0 }} alt="" draggable={false} />
        <img src={city.srcs[1]} className={styles.layerImg} style={{ opacity: city.slot === 1 ? 1 : 0 }} alt="" draggable={false} />
      </div>

      <div className={styles.layerWrapper}>
        <img src={fg.srcs[0]} className={styles.layerImg} style={{ opacity: fg.slot === 0 ? 1 : 0 }} alt="" draggable={false} />
        <img src={fg.srcs[1]} className={styles.layerImg} style={{ opacity: fg.slot === 1 ? 1 : 0 }} alt="" draggable={false} />
      </div>

      {windDelays.map((delay, i) => (
        <div key={i} className={styles.windStreak} style={{ top: windTops[i], animationDelay: delay }} />
      ))}
    </div>
  )
}
