'use client'
import { useEffect, useRef } from 'react'

interface LayerDef {
  srcs: string[]
  intervalMs: number
  blendMode?: GlobalCompositeOperation
}

const LAYERS: LayerDef[] = [
  {
    // Night sky base
    srcs: ['/chapter3/backgrounds/sky.png'],
    intervalMs: 0,
  },
  {
    // Star twinkle overlay (4 frames)
    srcs: Array.from({ length: 4 }, (_, i) => `/chapter3/backgrounds/sky_overlays/frame${i + 1}.png`),
    intervalMs: 700,
    blendMode: 'screen',
  },
  {
    // Starry city — animated night scene (8 frames)
    srcs: Array.from({ length: 8 }, (_, i) => `/chapter3/backgrounds/city_night/frames/frame${i + 1}.png`),
    intervalMs: 220,
  },
]

function loadImages(srcs: string[]): HTMLImageElement[] {
  return srcs.map(src => {
    const img = new Image()
    img.src = src
    return img
  })
}

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const layerImgs = LAYERS.map(l => loadImages(l.srcs))
    const frameIdx  = LAYERS.map(() => 0)
    const lastSwap  = LAYERS.map(() => 0)

    function resize() {
      canvas!.width  = window.innerWidth
      canvas!.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    let rafId: number

    function frame(ts: number) {
      const cw = canvas!.width
      const ch = canvas!.height

      LAYERS.forEach((l, i) => {
        if (l.intervalMs > 0 && l.srcs.length > 1 && ts - lastSwap[i] >= l.intervalMs) {
          frameIdx[i] = (frameIdx[i] + 1) % l.srcs.length
          lastSwap[i] = ts
        }
      })

      ctx.clearRect(0, 0, cw, ch)

      LAYERS.forEach((l, i) => {
        const img = layerImgs[i][frameIdx[i]]
        if (!img.complete || img.naturalWidth === 0) return
        const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
        const w = img.naturalWidth  * scale
        const h = img.naturalHeight * scale
        ctx.globalCompositeOperation = l.blendMode ?? 'source-over'
        ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h)
      })

      ctx.globalCompositeOperation = 'source-over'
      rafId = requestAnimationFrame(frame)
    }

    rafId = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    />
  )
}
