'use client'
import { useEffect, useRef } from 'react'

interface LayerDef {
  srcs: string[]
  intervalMs: number
  animX?: (elapsedMs: number, cw: number) => number // canvas-space X offset
}

const LAYERS: LayerDef[] = [
  {
    srcs: Array.from({ length: 5 }, (_, i) => `/chapter1/backgrounds/sky/frame${i + 1}.png`),
    intervalMs: 1200,
  },
  {
    srcs: ['/chapter1/backgrounds/mountains/frame1.png'],
    intervalMs: 0,
    animX: (t, cw) => Math.sin((t / 8000) * Math.PI * 2) * cw * 0.002,
  },
  {
    srcs: Array.from({ length: 5 }, (_, i) => `/chapter1/backgrounds/city_buildings/frame${i + 1}.png`),
    intervalMs: 400,
    animX: (t, cw) => Math.sin((t / 25000) * Math.PI * 2) * cw * -0.006,
  },
  {
    srcs: Array.from({ length: 5 }, (_, i) => `/chapter1/backgrounds/foreground_bushes/frame${i + 1}.png`),
    intervalMs: 800,
  },
]

const WIND = [
  { speedPx: 180, topPct: 18, delayMs: 0 },
  { speedPx: 200, topPct: 32, delayMs: 2100 },
  { speedPx: 190, topPct: 24, delayMs: 4400 },
  { speedPx: 210, topPct: 40, delayMs: 6800 },
  { speedPx: 195, topPct: 28, delayMs: 9300 },
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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const canvasEl = canvas as HTMLCanvasElement
    const ctx = canvasEl.getContext('2d')!

    const layerImgs = LAYERS.map(l => loadImages(l.srcs))
    const frameIdx = LAYERS.map(() => 0)
    const lastSwap = LAYERS.map(() => 0)

    function resize() {
      canvasEl.width = window.innerWidth
      canvasEl.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const startTs = performance.now()
    let rafId: number

    function frame(ts: number) {
      const elapsed = ts - startTs
      const cw = canvasEl.width
      const ch = canvasEl.height

      // Advance each layer's frame index at its own interval
      LAYERS.forEach((l, i) => {
        if (l.intervalMs > 0 && l.srcs.length > 1 && ts - lastSwap[i] >= l.intervalMs) {
          frameIdx[i] = (frameIdx[i] + 1) % l.srcs.length
          lastSwap[i] = ts
        }
      })

      ctx.clearRect(0, 0, cw, ch)

      // Draw background layers — sky (i=0) at natural brightness, rest boosted
      LAYERS.forEach((l, i) => {
        const img = layerImgs[i][frameIdx[i]]
        if (!img.complete || img.naturalWidth === 0) return
        const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
        const w = img.naturalWidth * scale
        const h = img.naturalHeight * scale
        const tx = l.animX ? l.animX(elapsed, cw) : 0
        ctx.filter = i === 2 ? 'brightness(1.75)' : 'none'
        ctx.drawImage(img, (cw - w) / 2 + tx, (ch - h) / 2, w, h)
      })
      ctx.filter = 'none'

      // Wind streaks
      ctx.globalAlpha = 0.07
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 1
      for (const w of WIND) {
        const period = ((cw + 310) / w.speedPx) * 1000
        const wx = (((elapsed + w.delayMs) % period) / period) * (cw + 310) - 200
        const wy = ch * w.topPct / 100
        ctx.beginPath()
        ctx.moveTo(wx, wy)
        ctx.lineTo(wx + 110, wy)
        ctx.stroke()
      }
      ctx.globalAlpha = 1

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
