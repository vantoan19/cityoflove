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
  { lines: ["We’re learning how to love each other.", 'And that, somehow,', 'is its own kind of brave.'] },
  { lines: ['Something unexpected started happening.', 'I started liking myself more.', 'Not because you fixed me.', 'But because loving you', 'made me want to be worth it.'] },
  { lines: ['You make the me inside me', 'want to become a better me.', "And that’s the most unexpected gift."] },
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

    let letterH  = 0
    let imgRatio = 2.2
    let vScroll  = 0
    let maxScroll = 0
    let atEnd    = false
    let obs: IntersectionObserver | null = null

    // Preload sprout images
    STAGES.forEach(src => { const img = new Image(); img.src = src })

    // Sprout stage management
    const sproutImgs = Array.from(root.querySelectorAll<HTMLImageElement>('.ch6-sprout-img'))
    let currentStage = 0

    function setStage(idx: number) {
      if (idx === currentStage) return
      currentStage = idx
      sproutImgs.forEach((img, i) => img.classList.toggle('ch6-active', i === idx))
    }

    // Layout
    function layout() {
      const colW = root.offsetWidth * 0.55
      const vh   = root.offsetHeight
      letterH   = colW * imgRatio
      maxScroll = Math.max(letterH - vh, 0)
      letter.style.height = `${letterH}px`

      const msgEls = Array.from(root.querySelectorAll<HTMLElement>('.ch6-message'))
      const yTop   = letterH * 0.08
      const yBot   = letterH * 0.90
      const step   = (yBot - yTop) / msgEls.length
      msgEls.forEach((el, i) => {
        const slotMid = yTop + i * step + step / 2
        el.style.top  = `${slotMid - el.offsetHeight / 2}px`
      })

      applyScroll(vScroll, false)
    }

    // Scroll application
    function applyScroll(target: number, animate: boolean) {
      target  = Math.max(0, Math.min(target, maxScroll))
      vScroll = target

      if (animate) {
        gsap.to(letter, { y: -vScroll, duration: 0.35, ease: 'power2.out', overwrite: true })
      } else {
        gsap.set(letter, { y: -vScroll })
      }

      // Sprout stage
      const progress = maxScroll > 0 ? vScroll / maxScroll : 0
      setStage(Math.min(Math.floor(progress * 6), 5))

      // Hide hint on first scroll
      if (vScroll > 10) gsap.to(hint, { opacity: 0, duration: 0.4, overwrite: true })

      // End detection
      const isEnd = vScroll >= maxScroll - 40
      if (isEnd && !atEnd) {
        atEnd = true
        setTimeout(() => nextBtn.classList.add('ch6-visible'), 400)
      } else if (!isEnd && atEnd) {
        atEnd = false
        nextBtn.classList.remove('ch6-visible')
      }
    }

    // Input handlers
    const onWheel = (e: WheelEvent) => { e.preventDefault(); applyScroll(vScroll + e.deltaY, true) }

    let touchY0: number | null = null
    const onTouchStart = (e: TouchEvent) => { touchY0 = e.touches[0].clientY }
    const onTouchMove  = (e: TouchEvent) => {
      if (touchY0 === null) return
      e.preventDefault()
      const dy = touchY0 - e.touches[0].clientY
      touchY0 = e.touches[0].clientY
      applyScroll(vScroll + dy, true)
    }

    const onKeyDown = (e: KeyboardEvent) => {
      const step = root.offsetHeight * 0.18
      if (e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); applyScroll(vScroll + step, true) }
      if (e.key === 'ArrowUp')                    { e.preventDefault(); applyScroll(vScroll - step, true) }
    }

    // Boot: probe letter image ratio, then set up layout + IntersectionObserver
    const probe = new Image()
    probe.onload = function () {
      imgRatio = (this as HTMLImageElement).naturalHeight / (this as HTMLImageElement).naturalWidth
      layout()
      window.addEventListener('resize', layout)
      setStage(0)

      // IntersectionObserver for message fade-in
      const msgEls = Array.from(root.querySelectorAll<HTMLElement>('.ch6-message'))
      gsap.set(msgEls, { opacity: 0, y: 16 })
      obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (!e.isIntersecting) return
          const el = e.target as HTMLElement
          gsap.fromTo(el, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
          obs!.unobserve(el)
        })
      }, { root: root.querySelector('.ch6-letter-col'), threshold: 0.15, rootMargin: '0px 0px -40px 0px' })
      msgEls.forEach(el => obs!.observe(el))
    }
    probe.src = '/chapter2/letter_long.png'

    root.addEventListener('wheel',      onWheel,      { passive: false })
    root.addEventListener('touchstart', onTouchStart, { passive: true  })
    root.addEventListener('touchmove',  onTouchMove,  { passive: false })
    window.addEventListener('keydown',  onKeyDown)
    nextBtn.addEventListener('click', () => onCompleteRef.current())

    return () => {
      window.removeEventListener('resize',  layout)
      window.removeEventListener('keydown', onKeyDown)
      root.removeEventListener('wheel',      onWheel)
      root.removeEventListener('touchstart', onTouchStart)
      root.removeEventListener('touchmove',  onTouchMove)
      obs?.disconnect()
      gsap.killTweensOf(letter)
    }
  }, [])

  return (
    <div className="ch6-root" ref={rootRef}>
      <div className="ch6-letter-col">
        <div className="ch6-letter" ref={letterRef}>
          {MESSAGES.map((msg, i) => (
            <div key={i} className="ch6-message">
              {msg.lines.map((line, j) => (
                <p key={j} className={j === 0 && msg.lines.length > 1 ? '' : 'ch6-emph'}>{line}</p>
              ))}
            </div>
          ))}
        </div>
        <div className="ch6-hint" ref={hintRef}>
          scroll to read
          <span className="ch6-hint-arrow">↓</span>
        </div>
        <button className="ch6-next-btn" ref={nextBtnRef}>
          next chapter →
        </button>
      </div>

      <div className="ch6-sprout-col">
        {STAGES.map((src, i) => (
          <img key={i} src={src} alt="" className={`ch6-sprout-img${i === 0 ? ' ch6-active' : ''}`} />
        ))}
      </div>
    </div>
  )
}
