'use client'
import { useState, useEffect, useRef } from 'react'

interface Props {
  frames: string[]
  frameInterval: number
  alt?: string
  style?: React.CSSProperties
}

export default function SpriteAnimation({ frames, frameInterval, alt = '', style }: Props) {
  const [frameIndex, setFrameIndex] = useState(0)
  const framesRef = useRef(frames)
  framesRef.current = frames

  useEffect(() => {
    setFrameIndex(0)
    if (frames.length <= 1) return
    const id = setInterval(
      () => setFrameIndex(i => (i + 1) % framesRef.current.length),
      frameInterval
    )
    return () => clearInterval(id)
  }, [frames, frameInterval])

  return <img src={frames[frameIndex]} alt={alt} draggable={false} style={style} />
}
