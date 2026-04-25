'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './chapter2.css'

interface Props { onComplete: () => void }

export default function Chapter2({ onComplete }: Props) {
  const letterRef = useRef<HTMLDivElement>(null)
  // Stable ref so the effect closure always calls the latest onComplete
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    const letter   = letterRef.current!
    const hintEl   = document.getElementById('ch2-hint')!
    const nextBtn  = document.getElementById('ch2-next-btn')!
    const messages = Array.from(document.querySelectorAll('[data-ch2-msg]')) as HTMLElement[]

    // Snapshot HTML for clean re-type on revisit
    const originals = messages.map(m => m.innerHTML)

    let current   = -1
    let animating = false
    let letterH   = 0
    let imgRatio  = 2
    let pendingTimers: ReturnType<typeof setTimeout>[] = []
    let openTl: gsap.core.Timeline | null = null

    gsap.set(messages, { opacity: 0 })
    gsap.set(letter,   { opacity: 0 })

    const openingEl    = document.getElementById('ch2-opening')!            as HTMLElement
    const openingSub   = openingEl.querySelector('.ch2-opening-sub')!   as HTMLElement
    const openingTitle = openingEl.querySelector('.ch2-opening-title')! as HTMLElement
    gsap.set(openingSub,   { opacity: 0, y: 16 })
    gsap.set(openingTitle, { opacity: 0, y: 16 })

    const onOpeningTap = () => {
      if (!openTl) return
      openTl.kill(); openTl = null
      gsap.set(openingEl, { opacity: 0, display: 'none' })
      gsap.to(letter, { opacity: 1, duration: 0.5, ease: 'power2.out' })
    }
    openingEl.addEventListener('click', onOpeningTap)

    /* ── Layout ──────────────────────────────────────────────── */
    function layout() {
      const W = window.innerWidth
      letterH = W * imgRatio
      letter.style.height = `${letterH}px`
      const yTop = letterH * 0.13
      const yBot = letterH * 0.84
      const step = (yBot - yTop) / messages.length
      messages.forEach((el, i) => {
        const slotMid = yTop + i * step + step / 2
        el.style.top = `${slotMid - el.offsetHeight / 2}px`
      })
      if (current >= 0) gsap.set(letter, { y: panTarget(current) })
    }

    function panTarget(index: number): number {
      const el  = messages[index]
      const mid = parseFloat(el.style.top) + el.offsetHeight / 2
      const vh  = window.innerHeight
      const raw = mid - vh * 0.42
      return -Math.min(Math.max(raw, 0), Math.max(letterH - vh, 0))
    }

    /* ── Typing engine ───────────────────────────────────────── */
    function cancelTyping() {
      pendingTimers.forEach(clearTimeout)
      pendingTimers = []
    }

    function typeMessage(index: number) {
      cancelTyping()
      const msg = messages[index]
      msg.innerHTML = originals[index]   // reset to clean state

      if (msg.id === 'ch2-m14') {
        gsap.to(msg, { opacity: 1, duration: 0.4 })
        pendingTimers.push(setTimeout(startTyping, 500))
        return
      }

      const paras = Array.from(msg.querySelectorAll('p:not(.ch2-reply)')) as HTMLElement[]
      const items = paras.map(p => {
        if (p.children.length === 0) {
          const text = p.textContent ?? ''
          p.textContent = ''
          return { p, text, plain: true }
        }
        gsap.set(p, { opacity: 0 })
        return { p, text: '', plain: false }
      })

      gsap.to(msg, { opacity: 1, duration: 0.25 })

      let delay = 80
      items.forEach(({ p, text, plain }) => {
        if (!plain) {
          const d = delay
          pendingTimers.push(setTimeout(() => {
            gsap.to(p, { opacity: 1, duration: 0.5 })
            if (msg.id === 'ch2-m2')
              setTimeout(() => (p.querySelector('.ch2-eyes') as HTMLElement | null)?.classList.add('active'), 300)
          }, d))
          delay += 700
          return
        }
        for (let i = 0; i < text.length; i++) {
          const c = text[i], fire = delay
          pendingTimers.push(setTimeout(() => { p.textContent += c }, fire))
          delay += 20 + Math.random() * 20
        }
        delay += 220
      })
    }

    /* ── Core transition ─────────────────────────────────────── */
    function goTo(index: number) {
      if (animating || index === current) return
      if (index < -1 || index >= messages.length) return
      animating = true
      cancelTyping()

      const tl = gsap.timeline({ onComplete: () => { animating = false } })

      if (current === -1) {
        tl.to(hintEl, { opacity: 0, duration: 0.25, ease: 'power1.in' }, 0)
      } else {
        tl.to(messages[current], { opacity: 0, duration: 0.3, ease: 'power1.in' }, 0)
      }

      const targetY = index === -1 ? 0 : panTarget(index)
      tl.to(letter, { y: targetY, duration: 0.75, ease: 'power2.inOut' }, 0.15)

      if (index === -1) {
        tl.to(hintEl, { opacity: 1, duration: 0.4 }, 0.65)
      } else {
        tl.call(() => typeMessage(index), undefined, 0.6)
      }

      const isLast = index === messages.length - 1
      tl.call(() => nextBtn.classList.toggle('ch2-visible', isLast), undefined, isLast ? 1.8 : 0)

      current = index
    }

    /* ── Boot: probe image ratio ─────────────────────────────── */
    const probe = new Image()
    probe.onload = function () {
      const img = this as HTMLImageElement
      imgRatio = img.naturalHeight / img.naturalWidth
      layout()
      window.addEventListener('resize', layout)
      openTl = gsap.timeline()
      openTl.to(openingSub,   { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0.4)
      openTl.to(openingTitle, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, 1.0)
      openTl.to(openingEl,    { opacity: 0, duration: 0.8, ease: 'power1.inOut' }, 3.8)
      openTl.call(() => {
        gsap.set(openingEl, { display: 'none' })
        gsap.to(letter, { opacity: 1, duration: 1.0, ease: 'power2.out' })
      }, undefined, 4.7)
    }
    probe.src = '/chapter2/letter_long.png'

    /* ── Input handlers ──────────────────────────────────────── */
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (animating) return
      const dir = e.deltaY > 0 ? 1 : -1
      goTo(Math.min(Math.max(current + dir, -1), messages.length - 1))
    }
    window.addEventListener('wheel', onWheel, { passive: false })

    let touchY0: number | null = null
    const onTouchStart = (e: TouchEvent) => { touchY0 = e.touches[0].clientY }
    const onTouchEnd   = (e: TouchEvent) => {
      if (touchY0 === null) return
      const dy = touchY0 - e.changedTouches[0].clientY
      touchY0 = null
      if (Math.abs(dy) < 40 || animating) return
      goTo(Math.min(Math.max(current + (dy > 0 ? 1 : -1), -1), messages.length - 1))
    }
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend',   onTouchEnd,   { passive: true })

    const onKeyDown = (e: KeyboardEvent) => {
      if (animating) return
      if (e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault()
        goTo(Math.min(current + 1, messages.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        goTo(Math.max(current - 1, -1))
      }
    }
    window.addEventListener('keydown', onKeyDown)

    /* ── Audio player ────────────────────────────────────────── */
    const audio    = document.getElementById('ch2-audio')    as HTMLAudioElement | null
    const spBtn    = document.getElementById('ch2-sp-btn')   as HTMLButtonElement | null
    const spFill   = document.getElementById('ch2-sp-fill')  as HTMLElement | null
    const spTrack  = document.getElementById('ch2-sp-track') as HTMLElement | null
    let playing    = false

    const onSpClick = () => {
      if (!audio || !spBtn) return
      if (playing) { audio.pause(); spBtn.textContent = '▶'; playing = false }
      else         { audio.play().catch(() => {}); spBtn.textContent = '⏸'; playing = true }
    }
    const onTimeUpdate = () => {
      if (audio?.duration && spFill)
        spFill.style.width = `${(audio.currentTime / audio.duration) * 100}%`
    }
    const onAudioEnded = () => {
      playing = false
      if (spBtn)  spBtn.textContent = '▶'
      if (spFill) spFill.style.width = '0%'
    }
    const onTrackClick = (e: Event) => {
      if (!audio?.duration || !spTrack) return
      const r = spTrack.getBoundingClientRect()
      audio.currentTime = (((e as MouseEvent).clientX - r.left) / r.width) * audio.duration
    }
    spBtn?.addEventListener('click', onSpClick)
    audio?.addEventListener('timeupdate', onTimeUpdate)
    audio?.addEventListener('ended', onAudioEnded)
    spTrack?.addEventListener('click', onTrackClick)

    /* ── m14 cursor typing ───────────────────────────────────── */
    function startTyping() {
      const typedEl  = document.getElementById('ch2-typed')! as HTMLElement
      const cursorEl = document.getElementById('ch2-csr')!   as HTMLElement
      const replyEl  = document.getElementById('ch2-reply')! as HTMLElement
      const text = 'I texted you.'
      let i = 0
      typedEl.textContent = ''
      cursorEl.style.display = ''
      replyEl.classList.remove('shown')
      const tick = () => {
        if (i < text.length) {
          typedEl.textContent += text[i++]
          pendingTimers.push(setTimeout(tick, 55 + Math.random() * 65))
        } else {
          pendingTimers.push(setTimeout(() => {
            cursorEl.style.display = 'none'
            replyEl.classList.add('shown')
          }, 900))
        }
      }
      tick()
    }

    /* ── Cleanup ─────────────────────────────────────────────── */
    return () => {
      openTl?.kill()
      openingEl.removeEventListener('click', onOpeningTap)
      cancelTyping()
      window.removeEventListener('resize',     layout)
      window.removeEventListener('wheel',      onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend',   onTouchEnd)
      window.removeEventListener('keydown',    onKeyDown)
      spBtn?.removeEventListener('click',      onSpClick)
      audio?.removeEventListener('timeupdate', onTimeUpdate)
      audio?.removeEventListener('ended',      onAudioEnded)
      spTrack?.removeEventListener('click',    onTrackClick)
      gsap.killTweensOf(letter)
      gsap.killTweensOf(hintEl)
      messages.forEach(m => gsap.killTweensOf(m))
    }
  }, [])

  return (
    <div className="ch2-root">
      <div className="ch2-opening" id="ch2-opening">
        <p className="ch2-opening-sub">Chapter 2</p>
        <p className="ch2-opening-title">How this even started?</p>
      </div>

      <div className="ch2-hint" id="ch2-hint">
        scroll to begin
        <span className="ch2-hint-arrow">↓</span>
      </div>

      <button
        className="ch2-next-btn"
        id="ch2-next-btn"
        onClick={() => onCompleteRef.current()}
      >
        next chapter →
      </button>

      <div className="ch2-letter-wrap">
        <div className="ch2-letter" ref={letterRef}>

          <div data-ch2-msg className="ch2-message" id="ch2-m1">
            <p>It didn't start with a conversation.</p>
            <p>It started with curiosity.</p>
          </div>

          <div data-ch2-msg className="ch2-message" id="ch2-m2">
            <p>We knew each other through a friend.</p>
            <p>Did a little stalking. <span className="ch2-eyes">👀</span></p>
            <p>Said nothing. Too shy.</p>
          </div>

          <div data-ch2-msg className="ch2-message" id="ch2-m3">
            <p>Then one day,</p>
            <p>you appeared near my world.</p>
          </div>

          <div data-ch2-msg className="ch2-message" id="ch2-m4">
            <p>We saw each other.</p>
            <p>Just for a moment.</p>
            <p>From a distance.</p>
          </div>

          <div data-ch2-msg className="ch2-message" id="ch2-m5">
            <p className="ch2-big">And then you left.</p>
          </div>

          <div data-ch2-msg className="ch2-message" id="ch2-m6">
            <p className="ch2-big">That could&apos;ve been it.</p>
          </div>

          <div data-ch2-msg className="ch2-message" id="ch2-m7">
            <p>But a week later,</p>
            <p>I found an excuse:</p>
            <p className="ch2-emph">&quot;Let&apos;s have lunch.&quot;</p>
          </div>

          <div data-ch2-msg className="ch2-message" id="ch2-m8">
            <p>You were…</p>
            <p className="ch2-emph">warm. Easy. Bright.</p>
          </div>

          <div data-ch2-msg className="ch2-message" id="ch2-m9">
            <p>And after that—</p>
            <p>I couldn&apos;t focus on anything.</p>
          </div>

          <div data-ch2-msg className="ch2-message" id="ch2-m10">
            <p>Because texting you</p>
            <p>felt like the hardest thing in the world.</p>
          </div>

          <div data-ch2-msg className="ch2-message" id="ch2-m11">
            <p>Then a song played.</p>
            <p className="ch2-song-title">&quot;Hey Jude…&quot;</p>
            <div className="ch2-sketch-player">
              <span className="ch2-sp-note">♪</span>
              <div className="ch2-sp-info">
                <div className="ch2-sp-label">Hey Jude — The Beatles</div>
                <div className="ch2-sp-track" id="ch2-sp-track">
                  <div className="ch2-sp-fill" id="ch2-sp-fill" />
                </div>
              </div>
              <button className="ch2-sp-btn" id="ch2-sp-btn">▶</button>
            </div>
            <audio id="ch2-audio" preload="none">
              <source src="/chapter2/hey_jude.mp3" type="audio/mpeg" />
            </audio>
          </div>

          <div data-ch2-msg className="ch2-message" id="ch2-m12">
            <p>And somehow it said:</p>
            <p className="ch2-emph">You found her.</p>
            <p className="ch2-emph">Now go get her.</p>
          </div>

          <div data-ch2-msg className="ch2-message" id="ch2-m13">
            <p>So after way too much overthinking—</p>
            <p>I did something brave.</p>
          </div>

          <div data-ch2-msg className="ch2-message" id="ch2-m14">
            <p><span id="ch2-typed" /><span className="ch2-cursor" id="ch2-csr" /></p>
            <p className="ch2-reply" id="ch2-reply">You replied.</p>
          </div>

          <div data-ch2-msg className="ch2-message" id="ch2-m15">
            <p>And then—</p>
            <p>we had our first real lunch.</p>
          </div>

          <div data-ch2-msg className="ch2-message" id="ch2-m16">
            <p>That&apos;s when I saw more of you.</p>
          </div>

          <div data-ch2-msg className="ch2-message" id="ch2-m17">
            <p className="ch2-emph">Not just fun.</p>
            <p className="ch2-emph">Not just cute.</p>
          </div>

          <div data-ch2-msg className="ch2-message" id="ch2-m18">
            <p>But…</p>
            <p className="ch2-emph">someone who becomes what she does.</p>
          </div>

          <div data-ch2-msg className="ch2-message" id="ch2-m19">
            <p className="ch2-morning">Morning:</p>
            <p className="ch2-morning">a mom, raising kids in her mind.</p>
          </div>

          <div data-ch2-msg className="ch2-message" id="ch2-m20">
            <p className="ch2-afternoon">Afternoon:</p>
            <p className="ch2-afternoon">someone else entirely.</p>
            <p className="ch2-afternoon">Just to understand.</p>
            <p className="ch2-afternoon">Just to make things real.</p>
          </div>

          <div data-ch2-msg className="ch2-message" id="ch2-m21">
            <p>That&apos;s when I knew—</p>
            <p className="ch2-big">you don&apos;t just do things.</p>
            <p className="ch2-big">You become them.</p>
          </div>

          <div data-ch2-msg className="ch2-message" id="ch2-m22">
            <p className="ch2-big">From that moment,</p>
            <p className="ch2-big">I know I&apos;ve fallen in love with you.</p>
          </div>

        </div>
      </div>
    </div>
  )
}
