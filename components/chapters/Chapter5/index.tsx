'use client'
import { useRef, useEffect } from 'react'
import './chapter5.css'

interface Props { onComplete: () => void }

function spawnRain(
  container: HTMLDivElement,
  count: number, minDur: number, maxDur: number,
  minOp: number, maxOp: number, dxRange: number
) {
  container.innerHTML = ''
  for (let i = 0; i < count; i++) {
    const drop = document.createElement('div')
    drop.className = 'ch5-drop'
    const dur = minDur + Math.random() * (maxDur - minDur)
    const op  = minOp  + Math.random() * (maxOp  - minOp)
    const dx  = -(Math.random() * dxRange)
    const h   = 12 + Math.random() * 6
    drop.style.cssText = [
      `left:${Math.random() * 110 - 5}vw`,
      `height:${h}px`,
      `opacity:${op}`,
      `--dx:${dx}px`,
      `animation-duration:${dur.toFixed(2)}s`,
      `animation-delay:${(Math.random() * maxDur * -1).toFixed(2)}s`,
    ].join(';')
    container.appendChild(drop)
  }
}

function spawnFogPuffs(container: HTMLDivElement) {
  container.innerHTML = ''
  for (let i = 0; i < 16; i++) {
    const puff  = document.createElement('div')
    puff.className = 'ch5-fog-puff'
    const w     = 200 + Math.random() * 320
    const h     = w * (0.45 + Math.random() * 0.35)
    const top   = Math.random() * 90
    const left  = -15 + Math.random() * 115
    const dur   = 10 + Math.random() * 12
    const delay = -(Math.random() * 12)
    const blur  = 6 + Math.random() * 12
    const op    = 0.38 + Math.random() * 0.28
    const drift = (Math.random() > 0.5 ? 1 : -1) * (20 + Math.random() * 35)
    const bob   = (Math.random() > 0.5 ? 1 : -1) * (4 + Math.random() * 10)
    puff.style.cssText = [
      `width:${w.toFixed(0)}px`, `height:${h.toFixed(0)}px`,
      `top:${top.toFixed(1)}%`, `left:${left.toFixed(1)}vw`,
      `filter:blur(${blur.toFixed(0)}px)`, `opacity:${op.toFixed(2)}`,
      `--drift:${drift.toFixed(1)}vw`, `--bob:${bob.toFixed(1)}vh`,
      `animation-duration:${dur.toFixed(1)}s`,
      `animation-delay:${delay.toFixed(1)}s`,
    ].join(';')
    container.appendChild(puff)
  }
}

const BEATS = [
  'ch5-b1', 'ch5-b2', 'ch5-b3', 'ch5-b4',
  'ch5-b7', 'ch5-b8', 'ch5-b9',
  'ch5-b10', 'ch5-b11', 'ch5-b12', 'ch5-b13', 'ch5-b14', 'ch5-b15', 'ch5-b16',
] as const

const M2_IDX = 7 // index of ch5-b10 in BEATS

export default function Chapter5({ onComplete }: Props) {
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const rootRef      = useRef<HTMLDivElement>(null)
  const rainRef      = useRef<HTMLDivElement>(null)
  const fogPuffsRef  = useRef<HTMLDivElement>(null)
  const flashRef     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!rootRef.current || !rainRef.current || !fogPuffsRef.current || !flashRef.current) return
    const root      = rootRef.current
    const rain      = rainRef.current
    const fogPuffs  = fogPuffsRef.current
    const flash     = flashRef.current

    spawnRain(rain, 80, 1.0, 1.4, 0.4, 0.7, 20)

    /* ── Memory flash images ── */
    const FLASH_SRCS: (string | null)[] = [
      '/chapter3/backgrounds/city_night/city_base.png',
      '/chapter4/backgrounds/bg_night_room.png',
      '/chapter4/backgrounds/bg_restaurant_table.png',
      '/chapter4/backgrounds/bg_tree_path.png',
      '/chapter4/backgrounds/bg_shelter.png',
      null,
    ]

    let memFired = false

    function triggerMemoryFlash(onDone: () => void) {
      if (memFired) return
      memFired = true
      const origOverflow = root.style.overflow
      root.style.overflow = 'hidden'
      flash.style.display = 'block'
      let i = 0
      function next() {
        if (i >= FLASH_SRCS.length) {
          root.classList.add('ch5-glitch')
          setTimeout(() => {
            root.classList.remove('ch5-glitch')
            flash.style.display = 'none'
            root.style.overflow = origOverflow
            onDone()
          }, 80)
          return
        }
        const src = FLASH_SRCS[i++]
        if (src) {
          flash.style.backgroundColor = ''
          flash.style.backgroundImage = `url('${src}')`
        } else {
          flash.style.backgroundImage = 'none'
          flash.style.backgroundColor = '#ffffff'
        }
        setTimeout(next, 150)
      }
      next()
    }

    function activateM2() {
      root.classList.add('ch5-m2')
      spawnRain(rain, 30, 2.2, 2.8, 0.2, 0.35, 35)
      spawnFogPuffs(fogPuffs)
    }

    /* ── Step navigation ── */
    let current   = -1  // -1 = hint state
    let animating = false

    function gid(id: string) { return document.getElementById(id) as HTMLElement | null }

    const hintEl = gid('ch5-hint')

    function showBeat(i: number) {
      const el = gid(BEATS[i])
      if (!el) return
      el.classList.add('ch5-on')
      el.querySelectorAll<HTMLElement>('[data-d]').forEach(c =>
        setTimeout(() => c.classList.add('ch5-on'), +(c.dataset.d ?? 0))
      )
      if (i === BEATS.length - 1) {
        setTimeout(() => {
          const endEl = gid('ch5-end')
          if (endEl) endEl.classList.add('ch5-on')
          const btn = gid('ch5-next-btn')
          if (btn) btn.onclick = () => onCompleteRef.current()
        }, 1500)
      }
    }

    function hideBeat(i: number, cb: () => void) {
      const el = gid(BEATS[i])
      if (!el) { cb(); return }
      el.classList.remove('ch5-on')
      el.querySelectorAll<HTMLElement>('[data-d]').forEach(c => c.classList.remove('ch5-on'))
      setTimeout(cb, i >= M2_IDX ? 600 : 300)
    }

    function goTo(next: number) {
      if (animating) return
      if (next === current) return
      if (next < -1 || next >= BEATS.length) return
      if (next < M2_IDX && current >= M2_IDX) return  // no going back to M1 from M2

      animating = true
      const prev = current
      current = next

      function doShow() {
        if (next === -1) {
          hintEl?.classList.add('ch5-on')
          animating = false
          return
        }
        if (next === M2_IDX) {
          triggerMemoryFlash(() => {
            activateM2()
            setTimeout(() => {
              showBeat(next)
              setTimeout(() => { animating = false }, 1400)
            }, 300)
          })
        } else {
          showBeat(next)
          setTimeout(() => { animating = false }, next >= M2_IDX ? 1400 : 650)
        }
      }

      if (prev === -1) {
        hintEl?.classList.remove('ch5-on')
        setTimeout(doShow, 300)
      } else {
        hideBeat(prev, doShow)
      }
    }

    /* show hint after rain establishes */
    const hintTimer = setTimeout(() => hintEl?.classList.add('ch5-on'), 800)

    /* ── Input handlers (same pattern as Ch2) ── */
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (animating) return
      goTo(current + (e.deltaY > 0 ? 1 : -1))
    }
    window.addEventListener('wheel', onWheel, { passive: false })

    let touchY0: number | null = null
    const onTouchStart = (e: TouchEvent) => { touchY0 = e.touches[0].clientY }
    const onTouchEnd   = (e: TouchEvent) => {
      if (touchY0 === null) return
      const dy = touchY0 - e.changedTouches[0].clientY
      touchY0 = null
      if (Math.abs(dy) < 40 || animating) return
      goTo(current + (dy > 0 ? 1 : -1))
    }
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend',   onTouchEnd,   { passive: true })

    const onKeyDown = (e: KeyboardEvent) => {
      if (animating) return
      if (e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault()
        goTo(current + 1)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        goTo(current - 1)
      }
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      clearTimeout(hintTimer)
      rain.innerHTML = ''
      fogPuffs.innerHTML = ''
      window.removeEventListener('wheel',      onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend',   onTouchEnd)
      window.removeEventListener('keydown',    onKeyDown)
    }
  }, [])

  return (
    <div className="ch5-root" ref={rootRef}>
      <div className="ch5-bg" />
      <div className="ch5-rain" ref={rainRef} />
      <div className="ch5-fog" />
      <div className="ch5-fog-puffs" ref={fogPuffsRef} />
      <div className="ch5-flash" ref={flashRef} />

      <div className="ch5-hint" id="ch5-hint">
        scroll to begin
        <span className="ch5-hint-arrow">↓</span>
      </div>

      <div className="ch5-scroll">

        {/* M1 beats */}
        <div className="ch5-beat" id="ch5-b1">
          <p className="ch5-t-calm">Then…</p>
        </div>

        <div className="ch5-beat" id="ch5-b2">
          <p className="ch5-t-bold">we did something impressive.</p>
        </div>

        <div className="ch5-beat" id="ch5-b3">
          <p className="ch5-t-hero">We speedran a relationship.</p>
        </div>

        <div className="ch5-beat" id="ch5-b4">
          <p className="ch5-t-mono">Any% completion.</p>
          <p className="ch5-t-mono" data-d="150">No tutorials.</p>
          <p className="ch5-t-mono" data-d="300">No save points.</p>
        </div>

        <div className="ch5-beat" id="ch5-b7">
          <p className="ch5-t-bold">I might have pressed</p>
        </div>

        <div className="ch5-beat ch5-skew" id="ch5-b8">
          <p className="ch5-t-quote">&ldquo;fast forward&rdquo;</p>
        </div>

        <div className="ch5-beat" id="ch5-b9">
          <p className="ch5-t-conf">a bit too hard.</p>
        </div>

        {/* M2 beats */}
        <div className="ch5-beat-m2" id="ch5-b10">
          <p className="ch5-t-m2-soft">Somewhere in the middle…</p>
        </div>

        <div className="ch5-beat-m2" id="ch5-b11">
          <p className="ch5-t-m2-main">things got a little blurry.</p>
        </div>

        <div className="ch5-beat-m2" id="ch5-b12">
          <p className="ch5-t-m2-soft">Not wrong.</p>
        </div>

        <div className="ch5-beat-m2" id="ch5-b13">
          <p className="ch5-t-m2-soft">Just…</p>
        </div>

        <div className="ch5-beat-m2" id="ch5-b14">
          <p className="ch5-t-m2-key">too much, too fast.</p>
        </div>

        <div className="ch5-beat-m2 ch5-no-blur" id="ch5-b15">
          <p className="ch5-t-m2-main">You weren&rsquo;t pulling away.</p>
        </div>

        <div className="ch5-beat-m2 ch5-no-blur" id="ch5-b16">
          <p className="ch5-t-m2-core">You were just trying to breathe.</p>
        </div>

      </div>

      <div className="ch5-end" id="ch5-end">
        <span className="ch5-end-label">Chapter 5</span>
        <button className="ch5-next-btn" id="ch5-next-btn">Continue →</button>
      </div>
    </div>
  )
}
