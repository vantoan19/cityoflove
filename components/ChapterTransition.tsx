'use client'
import { useEffect, useState } from 'react'

interface Props {
  active: boolean
  onMidpoint: () => void
  onDone: () => void
}

export default function ChapterTransition({ active, onMidpoint, onDone }: Props) {
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    if (!active) return
    // Fade in
    setOpacity(1)
    const midTimer = setTimeout(() => {
      onMidpoint()
      // Fade out
      setTimeout(() => {
        setOpacity(0)
        setTimeout(onDone, 600)
      }, 100)
    }, 800)
    return () => clearTimeout(midTimer)
  }, [active])

  if (!active && opacity === 0) return null

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        backgroundColor: '#1A1A1A',
        opacity,
        transition: `opacity ${active ? '0.8s' : '0.6s'} ease-in-out`,
        pointerEvents: active ? 'all' : 'none',
      }}
    />
  )
}
