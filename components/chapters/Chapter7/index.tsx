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

export default function Chapter7({ onComplete }: Props) {
  const rootRef   = useRef<HTMLDivElement>(null)
  const hintRef   = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root   = rootRef.current!
    const hint   = hintRef.current!
    const dialog = dialogRef.current!

    const beatEls = Array.from(root.querySelectorAll<HTMLElement>('.ch7-beat'))

    beatEls.forEach(el => {
      el.querySelectorAll<HTMLElement>('p').forEach(p => {
        p.dataset.full = p.textContent ?? ''
        p.textContent = ''
      })
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
      paragraphs.forEach(p => { p.textContent = '' })

      let lineIdx = 0
      let charIdx = 0

      function tick() {
        if (lineIdx >= paragraphs.length) {
          paragraphs.forEach(p => p.classList.remove('ch7-typing'))
          onDone?.()
          return
        }
        const p    = paragraphs[lineIdx]
        const full = p.dataset.full ?? ''
        if (charIdx === 0) {
          if (lineIdx > 0) paragraphs[lineIdx - 1].classList.remove('ch7-typing')
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
