'use client'
import { useEffect, useRef } from 'react'

type Dir = 'rtl' | 'ltr' | 'btt' | 'ttb'

interface Props {
  active: boolean
  dir?: Dir
  onMidpoint: () => void
  onDone: () => void
}

const NS = 'http://www.w3.org/2000/svg'

function buildCloud(r: number, color: string, dir: Dir, VW: number, VH: number): SVGSVGElement {
  const svg = document.createElementNS(NS, 'svg') as SVGSVGElement
  svg.style.cssText =
    `position:absolute;top:0;left:0;width:${VW}px;height:${VH}px;overflow:visible;will-change:transform;`

  const rect = document.createElementNS(NS, 'rect') as SVGRectElement
  rect.setAttribute('fill', color)
  svg.appendChild(rect)

  const mkC = (cx: number, cy: number) => {
    const c = document.createElementNS(NS, 'circle') as SVGCircleElement
    c.setAttribute('cx', String(cx))
    c.setAttribute('cy', String(cy))
    c.setAttribute('r', String(r))
    c.setAttribute('fill', color)
    svg.appendChild(c)
  }

  if (dir === 'rtl') {
    const n = Math.ceil(VH / (r * 2)) + 3
    rect.setAttribute('x', String(r));       rect.setAttribute('y', String(-(r * 2)))
    rect.setAttribute('width', String(VW * 3)); rect.setAttribute('height', String(VH + r * 4))
    for (let i = -1; i <= n; i++) mkC(r, i * r * 2 + r)
  } else if (dir === 'ltr') {
    const n = Math.ceil(VH / (r * 2)) + 3
    rect.setAttribute('x', String(-(VW * 3))); rect.setAttribute('y', String(-(r * 2)))
    rect.setAttribute('width', String(VW * 3 + VW - r)); rect.setAttribute('height', String(VH + r * 4))
    for (let i = -1; i <= n; i++) mkC(VW - r, i * r * 2 + r)
  } else if (dir === 'btt') {
    const n = Math.ceil(VW / (r * 2)) + 3
    rect.setAttribute('x', String(-(r * 2))); rect.setAttribute('y', String(r))
    rect.setAttribute('width', String(VW + r * 4)); rect.setAttribute('height', String(VH * 3))
    for (let i = -1; i <= n; i++) mkC(i * r * 2 + r, r)
  } else {
    // ttb
    const n = Math.ceil(VW / (r * 2)) + 3
    rect.setAttribute('x', String(-(r * 2))); rect.setAttribute('y', String(-(VH * 3)))
    rect.setAttribute('width', String(VW + r * 4)); rect.setAttribute('height', String(VH * 3 + VH - r))
    for (let i = -1; i <= n; i++) mkC(i * r * 2 + r, VH - r)
  }

  return svg
}

export default function ChapterTransition({ active, dir = 'rtl', onMidpoint, onDone }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null)

  // Keep latest callbacks in refs so the effect closure never goes stale
  const onMidpointRef = useRef(onMidpoint)
  const onDoneRef     = useRef(onDone)
  onMidpointRef.current = onMidpoint
  onDoneRef.current     = onDone

  useEffect(() => {
    if (!active || !overlayRef.current) return

    const overlay = overlayRef.current
    const DUR     = 420   // ms per wave
    const STAGGER = 260   // ms between wave starts (≤ 0.646 × DUR → no coverage gap)
    const VW = window.innerWidth
    const VH = window.innerHeight
    const isH = dir === 'rtl' || dir === 'ltr'
    const R   = Math.round((isH ? VH : VW) / 9)
    const dim = isH ? VW : VH
    const prop = (isH ? 'translateX' : 'translateY')

    let start: number, end: number
    switch (dir) {
      case 'rtl': start =  dim; end = -dim * 3; break
      case 'ltr': start = -dim; end =  dim * 3; break
      case 'btt': start =  dim; end = -dim * 3; break
      default:    start = -dim; end =  dim * 3; break  // ttb
    }

    const eio = (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2

    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []
    const rafs: number[] = []

    function animateWave(r: number, color: string, delay: number, onWaveDone?: () => void) {
      const svg = buildCloud(r, color, dir, VW, VH)
      svg.style.transform = `${prop}(${start}px)`
      overlay.appendChild(svg)

      let t0: number | null = null
      function go(ts: number) {
        if (cancelled) return
        if (!t0) t0 = ts
        const p = Math.min((ts - t0) / DUR, 1)
        svg.style.transform = `${prop}(${start + (end - start) * eio(p)}px)`
        if (p < 1) {
          rafs.push(requestAnimationFrame(go))
        } else {
          if (overlay.contains(svg)) overlay.removeChild(svg)
          if (!cancelled) onWaveDone?.()
        }
      }

      timers.push(setTimeout(() => {
        if (!cancelled) rafs.push(requestAnimationFrame(go))
      }, delay))
    }

    const waves = [
      { r: R,          color: '#FFB7C5' },
      { r: R * 0.92,   color: '#FFCCD7' },
      { r: R * 1.05,   color: '#FFB7C5' },
    ]

    waves.forEach((w, i) => {
      animateWave(w.r, w.color, i * STAGGER,
        i === waves.length - 1 ? () => onDoneRef.current() : undefined)
    })

    // Midpoint: wave 1 has exited, wave 2 fully covers screen — safe to swap chapter
    timers.push(setTimeout(() => onMidpointRef.current(), DUR))

    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
      rafs.forEach(cancelAnimationFrame)
      while (overlay.firstChild) overlay.removeChild(overlay.firstChild)
    }
  }, [active, dir])

  if (!active) return null

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed', inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    />
  )
}
