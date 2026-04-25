'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './chapter6.css'

interface Props { onComplete: () => void }

const STAGES = [1, 2, 3, 4, 5, 6].map(n => `/chapter7/sprout_stage_${n}.png`)

const MESSAGES = [
  { lines: ['After all the noise…', 'there was this quiet.'] },
  { lines: ['Staying near you', 'makes the world feel calm.'] },
  { lines: ['We were learning.', 'Not from a book.', 'Just two people, figuring it out.'] },
  { lines: ["We're learning how to love each other.", 'And that, somehow,', 'is its own kind of brave.'] },
  { lines: ['Something unexpected started happening.', 'I started liking myself more.', 'Not because you fixed me.', 'But because loving you', 'made me want to be worth it.'] },
  { lines: ['You make the me inside me', 'want to become a better me.', "And that's the most unexpected gift."] },
]

export default function Chapter6({ onComplete }: Props) {
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const rootRef    = useRef<HTMLDivElement>(null)
  const letterRef  = useRef<HTMLDivElement>(null)
  const hintRef    = useRef<HTMLDivElement>(null)
  const nextBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const root    = rootRef.current!
    const letter  = letterRef.current!
    const hint    = hintRef.current!
    const nextBtn = nextBtnRef.current!

    STAGES.forEach(src => { const img = new Image(); img.src = src })

    const sproutImgs = Array.from(root.querySelectorAll<HTMLImageElement>('.ch6-sprout-img'))
    const beatEls    = Array.from(root.querySelectorAll<HTMLElement>('.ch6-beat'))

    let imgRatio    = 2.2
    let letterH     = 0
    let maxScroll   = 0
    let currentStage = 0
    let current      = -1
    let animating    = false

    // Store full text and clear all paragraphs before anything renders
    beatEls.forEach(el => {
      el.querySelectorAll<HTMLElement>('p').forEach(p => {
        p.dataset.full = p.textContent ?? ''
        p.textContent = ''
      })
    })

    // Typing timers — one slot per beat
    const typingTimers: (ReturnType<typeof setTimeout> | undefined)[] = new Array(MESSAGES.length).fill(undefined)

    function cancelTyping(i: number) {
      clearTimeout(typingTimers[i])
      typingTimers[i] = undefined
      beatEls[i]?.querySelectorAll<HTMLElement>('p.ch6-typing').forEach(p => p.classList.remove('ch6-typing'))
    }

    function typeBeat(i: number, onDone?: () => void) {
      cancelTyping(i)
      const el = beatEls[i]
      if (!el) return
      const paragraphs = Array.from(el.querySelectorAll<HTMLElement>('p'))
      paragraphs.forEach(p => { if (!p.dataset.full) p.dataset.full = p.textContent ?? '' })
      paragraphs.forEach(p => { p.textContent = '' })

      let lineIdx = 0
      let charIdx = 0

      function tick() {
        if (lineIdx >= paragraphs.length) {
          paragraphs.forEach(p => p.classList.remove('ch6-typing'))
          onDone?.()
          return
        }
        const p    = paragraphs[lineIdx]
        const full = p.dataset.full ?? ''
        if (charIdx === 0) {
          if (lineIdx > 0) paragraphs[lineIdx - 1].classList.remove('ch6-typing')
          p.classList.add('ch6-typing')
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

    function layout() {
      const colW = root.offsetWidth * 0.5
      const vh   = root.offsetHeight
      letterH   = colW * imgRatio
      maxScroll = Math.max(letterH - vh, 0)
      letter.style.height = `${letterH}px`
    }

    function setStage(idx: number) {
      if (idx === currentStage) return
      currentStage = idx
      sproutImgs.forEach((img, i) => img.classList.toggle('ch6-active', i === idx))
    }

    function panLetter(beatIdx: number, animate: boolean) {
      if (maxScroll <= 0) return
      const progress = beatIdx / Math.max(beatEls.length - 1, 1)
      const targetY  = -(maxScroll * progress)
      if (animate) {
        gsap.to(letter, { y: targetY, duration: 0.7, ease: 'power2.inOut', overwrite: true })
      } else {
        gsap.set(letter, { y: targetY })
      }
    }

    function showBeat(i: number) {
      const el = beatEls[i]
      if (!el) return
      panLetter(i, true)
      setStage(i)
      gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' })
      typeBeat(i, () => {
        if (i === beatEls.length - 1) nextBtn.classList.add('ch6-visible')
      })
    }

    function hideBeat(i: number, cb: () => void) {
      cancelTyping(i)
      const el = beatEls[i]
      if (!el) { cb(); return }
      gsap.to(el, { opacity: 0, y: -10, duration: 0.3, ease: 'power2.in', onComplete: cb })
    }

    function goTo(next: number) {
      if (animating) return
      if (next === current) return
      if (next < -1 || next >= beatEls.length) return

      animating = true
      const prev = current
      current    = next

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

    const probe = new Image()
    probe.onload = function () {
      imgRatio = (this as HTMLImageElement).naturalHeight / (this as HTMLImageElement).naturalWidth
      layout()
      window.addEventListener('resize', layout)
    }
    probe.src = '/chapter2/letter_long.png'

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
      window.removeEventListener('resize',    layout)
      window.removeEventListener('wheel',     onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend',   onTouchEnd)
      window.removeEventListener('keydown',    onKeyDown)
      typingTimers.forEach((t, i) => cancelTyping(i))
      gsap.killTweensOf(letter)
      gsap.killTweensOf(hint)
      beatEls.forEach(el => gsap.killTweensOf(el))
    }
  }, [])

  return (
    <div className="ch6-root" ref={rootRef}>
      <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
        <defs>
          <filter id="ch6-sketch-edge" x="-50%" y="-4%" width="200%" height="108%">
            <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="3" seed="5" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <div className="ch6-letter-col">
        <div className="ch6-letter" ref={letterRef} />
        {MESSAGES.map((msg, i) => (
          <div key={i} className="ch6-beat">
            {msg.lines.map((line, j) => (
              <p key={j} className={j === 0 && msg.lines.length > 1 ? '' : 'ch6-emph'}>{line}</p>
            ))}
          </div>
        ))}
        <div className="ch6-hint" ref={hintRef}>
          scroll to read
          <span className="ch6-hint-arrow">↓</span>
        </div>
        <button className="ch6-next-btn" ref={nextBtnRef} onClick={() => onCompleteRef.current()}>
          next chapter →
        </button>
      </div>

      <div className="ch6-divider" />

      <div className="ch6-sprout-col">
        {STAGES.map((src, i) => (
          <img key={i} src={src} alt="" className={`ch6-sprout-img${i === 0 ? ' ch6-active' : ''}`} />
        ))}
      </div>
    </div>
  )
}
