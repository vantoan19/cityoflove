'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './chapter7.css'

interface Props { onComplete: () => void }

const MESSAGES = [
  { lines: ["I don't think this story needs a label."] },
  { lines: ["Or a timeline."] },
  { lines: ["Or a script."] },
  { lines: ["Maybe it just needs…"] },
  { lines: ["a bit of space."] },
  { lines: ["And the same curiosity that started it."] },
]

function drawSketchBg(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!
  const W   = canvas.width
  const H   = canvas.height
  const r   = (a: number, b: number) => a + Math.random() * (b - a)

  ctx.fillStyle = '#F4A7B9'
  ctx.fillRect(0, 0, W, H)

  ctx.lineCap  = 'round'
  ctx.lineJoin = 'round'

  // ── directional crayon passes — long sweeping strokes, mostly horizontal ──
  // Each pass has a dominant angle (like pressing crayon side across paper).
  // Strokes are dense, long, and slightly curved — matching the sprout background.
  const passes = [
    { angle: 0.04,  count: 55, lenMin: 180, lenMax: 420, wMin: 3.5, wMax: 6.5, aMin: 0.08, aMax: 0.18, color: '#9a3555' },
    { angle: -0.06, count: 50, lenMin: 160, lenMax: 380, wMin: 3.0, wMax: 5.5, aMin: 0.06, aMax: 0.15, color: '#7a2040' },
    { angle: 0.10,  count: 45, lenMin: 200, lenMax: 450, wMin: 2.5, wMax: 5.0, aMin: 0.05, aMax: 0.13, color: '#c06080' },
    { angle: -0.02, count: 40, lenMin: 150, lenMax: 350, wMin: 2.0, wMax: 4.5, aMin: 0.04, aMax: 0.11, color: '#6a1535' },
    { angle: 0.07,  count: 35, lenMin: 220, lenMax: 500, wMin: 4.0, wMax: 7.5, aMin: 0.05, aMax: 0.12, color: '#b05070' },
  ]

  for (const pass of passes) {
    const baseAngle = pass.angle
    for (let i = 0; i < pass.count; i++) {
      // Spread strokes across the full canvas including edges
      const sx = r(-80, W + 80)
      const sy = r(-20, H + 20)

      // Per-stroke angle jitter — stays close to the pass direction
      const angle  = baseAngle + r(-0.12, 0.12)
      const len    = r(pass.lenMin, pass.lenMax)

      // Slight S-curve to mimic real crayon hand movement
      const bend1x = r(-18, 18)
      const bend1y = r(-10, 10)
      const bend2x = r(-18, 18)
      const bend2y = r(-10, 10)

      const ex = sx + Math.cos(angle) * len
      const ey = sy + Math.sin(angle) * len

      ctx.save()
      ctx.globalAlpha = r(pass.aMin, pass.aMax)
      ctx.strokeStyle = pass.color
      ctx.lineWidth   = r(pass.wMin, pass.wMax)
      ctx.beginPath()
      ctx.moveTo(sx, sy)
      ctx.bezierCurveTo(
        sx + Math.cos(angle) * len * 0.33 + bend1x,
        sy + Math.sin(angle) * len * 0.33 + bend1y,
        sx + Math.cos(angle) * len * 0.66 + bend2x,
        sy + Math.sin(angle) * len * 0.66 + bend2y,
        ex, ey,
      )
      ctx.stroke()
      ctx.restore()
    }
  }

  // ── fine grain layer — shorter overlapping strokes for paper texture ──
  for (let i = 0; i < 120; i++) {
    const sx    = r(-30, W + 30)
    const sy    = r(-10, H + 10)
    const angle = r(-0.18, 0.18)
    const len   = r(40, 120)

    ctx.save()
    ctx.globalAlpha = r(0.03, 0.09)
    ctx.strokeStyle = r(0, 1) > 0.5 ? '#8a2545' : '#5a1030'
    ctx.lineWidth   = r(1.2, 2.8)
    ctx.beginPath()
    ctx.moveTo(sx, sy)
    ctx.lineTo(
      sx + Math.cos(angle) * len + r(-8, 8),
      sy + Math.sin(angle) * len + r(-5, 5),
    )
    ctx.stroke()
    ctx.restore()
  }
}

export default function Chapter7({ onComplete }: Props) {
  const rootRef   = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hintRef   = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root   = rootRef.current!
    const canvas = canvasRef.current!
    const hint   = hintRef.current!
    const dialog = dialogRef.current!

    // Draw sketch background at viewport resolution
    canvas.width  = root.offsetWidth  || window.innerWidth
    canvas.height = root.offsetHeight || window.innerHeight
    drawSketchBg(canvas)

    const beatEls = Array.from(root.querySelectorAll<HTMLElement>('.ch7-beat'))

    // Clear initial text — MESSAGES constant is the authoritative source for typing
    beatEls.forEach(el => {
      el.querySelectorAll<HTMLElement>('p').forEach(p => { p.textContent = '' })
    })

    const typingTimers: (ReturnType<typeof setTimeout> | undefined)[] =
      new Array(MESSAGES.length).fill(undefined)
    let dialogTimer: ReturnType<typeof setTimeout> | undefined
    let dialogShown = false
    let current     = -1
    let animating   = false

    function cancelTyping(i: number) {
      clearTimeout(typingTimers[i])
      typingTimers[i] = undefined
      beatEls[i]?.querySelectorAll<HTMLElement>('p.ch7-typing')
        .forEach(p => p.classList.remove('ch7-typing'))
    }

    function showDialog() {
      if (dialogShown) return
      dialogShown = true
      dialog.style.display = 'block'
      gsap.fromTo(
        dialog,
        { opacity: 0, scale: 0.85, xPercent: -50, yPercent: -50, rotation: -0.5 },
        { opacity: 1, scale: 1,    xPercent: -50, yPercent: -50, rotation: -0.5, duration: 0.2, ease: 'power2.out' }
      )
    }

    function typeBeat(i: number, onDone?: () => void) {
      cancelTyping(i)
      const el = beatEls[i]
      if (!el) return
      const paragraphs = Array.from(el.querySelectorAll<HTMLElement>('p'))
      const lines      = MESSAGES[i]?.lines ?? []
      paragraphs.forEach(p => { p.textContent = '' })

      let lineIdx = 0
      let charIdx = 0

      function tick() {
        if (lineIdx >= lines.length) {
          paragraphs.forEach(p => p.classList.remove('ch7-typing'))
          onDone?.()
          return
        }
        const p    = paragraphs[lineIdx]
        const full = lines[lineIdx]
        if (!p) { lineIdx++; charIdx = 0; typingTimers[i] = setTimeout(tick, 180); return }
        if (charIdx === 0) {
          if (lineIdx > 0) paragraphs[lineIdx - 1]?.classList.remove('ch7-typing')
          p.classList.add('ch7-typing')
        }
        if (charIdx < full.length) {
          p.textContent = full.slice(0, charIdx + 1)
          charIdx++
          typingTimers[i] = setTimeout(tick, 28)
        } else {
          lineIdx++
          charIdx = 0
          typingTimers[i] = setTimeout(tick, 180)
        }
      }
      tick()
    }

    function showBeat(i: number) {
      const el = beatEls[i]
      if (!el) return
      gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' })
      const isLast = i === beatEls.length - 1
      typeBeat(i, isLast ? () => {
        dialogTimer = setTimeout(showDialog, 2500)
      } : undefined)
    }

    function hideBeat(i: number, cb: () => void) {
      cancelTyping(i)
      const el = beatEls[i]
      if (!el) { cb(); return }
      gsap.to(el, {
        opacity: 0, y: -10, duration: 0.3, ease: 'power2.in',
        onComplete: () => { gsap.set(el, { y: 0 }); cb() },
      })
    }

    function goTo(next: number) {
      if (animating) return
      if (next === current) return
      if (next < -1 || next >= beatEls.length) return

      animating    = true
      const prev   = current
      current      = next

      function doShow() {
        if (next === -1) {
          gsap.to(hint, { opacity: 1, duration: 0.4 })
          animating = false
          return
        }
        showBeat(next)
        setTimeout(() => { animating = false }, 750)
      }

      if (prev === -1) {
        gsap.to(hint, { opacity: 0, duration: 0.3, onComplete: doShow })
      } else {
        hideBeat(prev, doShow)
      }
    }

    const hintTimer = setTimeout(() => gsap.to(hint, { opacity: 1, duration: 0.5 }), 700)

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (animating) return
      goTo(current + (e.deltaY > 0 ? 1 : -1))
    }

    let touchY0: number | null = null
    const onTouchStart = (e: TouchEvent) => { touchY0 = e.touches[0].clientY }
    const onTouchEnd   = (e: TouchEvent) => {
      if (touchY0 === null) return
      const dy = touchY0 - e.changedTouches[0].clientY
      touchY0 = null
      if (Math.abs(dy) < 40 || animating) return
      goTo(current + (dy > 0 ? 1 : -1))
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (animating) return
      if (e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); goTo(current + 1) }
      else if (e.key === 'ArrowUp')               { e.preventDefault(); goTo(current - 1) }
    }

    window.addEventListener('wheel',      onWheel,      { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true  })
    window.addEventListener('touchend',   onTouchEnd,   { passive: true  })
    window.addEventListener('keydown',    onKeyDown)

    return () => {
      clearTimeout(hintTimer)
      clearTimeout(dialogTimer)
      window.removeEventListener('wheel',      onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend',   onTouchEnd)
      window.removeEventListener('keydown',    onKeyDown)
      typingTimers.forEach((_, i) => cancelTyping(i))
      gsap.killTweensOf(hint)
      gsap.killTweensOf(dialog)
      beatEls.forEach(el => gsap.killTweensOf(el))
    }
  }, [])

  return (
    <div className="ch7-root" ref={rootRef}>
      <canvas className="ch7-sketch-canvas" ref={canvasRef} />

      <div className="ch7-content">
        <div className="ch7-hint" ref={hintRef}>
          scroll to read
          <span className="ch7-hint-arrow">↓</span>
        </div>

        {MESSAGES.map((msg, i) => (
          <div key={i} className="ch7-beat">
            {msg.lines.map((line, j) => (
              <p key={j}>{line}</p>
            ))}
          </div>
        ))}
      </div>

      <div className="ch7-dialog" ref={dialogRef}>
        <p className="ch7-dialog-line">There are a lot more things to explore in the city?</p>
        <p className="ch7-dialog-line">Would you like to explore it together with me, as a girl friend?</p>
        <p className="ch7-dialog-line ch7-muted">— Please tell me your answer in person</p>
      </div>
    </div>
  )
}
