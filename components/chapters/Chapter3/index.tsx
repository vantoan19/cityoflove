'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './chapter3.css'

interface Props { onComplete: () => void }

export default function Chapter3({ onComplete }: Props) {
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    // ── Data ──────────────────────────────────────────────────────
    const BEATS = [
      { text: "There was a night that almost didn’t exist.", nick: 'pose1_neutral_idle',  judy: 'pose1_neutral_idle'     },
      { text: "A badminton session.",                              nick: 'pose4_pointing_up',   judy: 'pose5_amused'           },
      { text: "A message.",                                        nick: 'pose6_finger_guns',   judy: 'pose3_curious_pointing' },
      { text: "A low battery.",                                    nick: 'pose3_shrug',         judy: 'pose4_surprised'        },
      { text: "And somehow…",                                 nick: 'pose1_neutral_idle',  judy: 'pose6_warm_happy'       },
      { text: null, nick: null, judy: null },
    ]

    const BAR_DATA = [
      { message: "you should stay a bit longer"                                       },
      { message: "i missed you more than i said"                                      },
      { message: "this night almost didn’t happen"                               },
      { message: "i almost didn’t see it"                                        },
      { message: "the hours we stayed up talking"                                     },
      { message: "the smallest kind of brave"                                         },
      { message: "a second first night"                                               },
      { message: "if one notification didn’t arrive…\nthis night wouldn’t exist" },
    ]

    const BAR_GRID = { cols: 4, rows: 2, left: 0.08, top: 0.38, width: 0.84, height: 0.50 }

    // ── Phase elements ────────────────────────────────────────────
    const phase1 = document.getElementById('ch3-phase1')!
    const phase2 = document.getElementById('ch3-phase2')!

    // ── Background loops ──────────────────────────────────────────
    let skyFrame = 1
    const skyInterval = setInterval(() => {
      skyFrame = (skyFrame % 4) + 1
      const el = document.getElementById('ch3-skyOverlay') as HTMLImageElement | null
      if (el) el.src = `/chapter3/backgrounds/sky_overlays/frame${skyFrame}.png`
    }, 700)

    let cityFrame = 1
    const cityInterval = setInterval(() => {
      cityFrame = (cityFrame % 8) + 1
      const el = document.getElementById('ch3-cityOverlay') as HTMLImageElement | null
      if (el) el.src = `/chapter3/backgrounds/city_overlays/frame${cityFrame}.png`
    }, 220)

    // ── Sprite animation ──────────────────────────────────────────
    let nickTimer: ReturnType<typeof setInterval> | null = null
    let judyTimer: ReturnType<typeof setInterval> | null = null

    function setPose(character: 'nick' | 'judy', poseName: string) {
      const imgEl = document.getElementById(
        character === 'nick' ? 'ch3-foxImg' : 'ch3-bunnyImg'
      ) as HTMLImageElement | null
      if (!imgEl) return
      const base = `/chapter1/characters/${character}/${poseName}/frame`

      gsap.to(imgEl, { opacity: 0, duration: 0.15, onComplete: () => {
        if (character === 'nick') { if (nickTimer) { clearInterval(nickTimer); nickTimer = null } }
        else                      { if (judyTimer) { clearInterval(judyTimer); judyTimer = null } }

        let frame = 1
        imgEl.src = base + '1.png'
        gsap.to(imgEl, { opacity: 1, duration: 0.15 })

        const t = setInterval(() => {
          frame = (frame % 5) + 1
          imgEl.src = base + frame + '.png'
        }, 200)

        if (character === 'nick') nickTimer = t
        else                      judyTimer = t
      }})
    }

    setPose('nick', 'pose1_neutral_idle')
    setPose('judy', 'pose1_neutral_idle')

    // ── Narration ─────────────────────────────────────────────────
    function showText(text: string) {
      const el = document.getElementById('ch3-narration')
      if (!el) return
      gsap.to(el, { opacity: 0, duration: 0.3, onComplete: () => {
        el.textContent = text
        gsap.to(el, { opacity: 1, duration: 0.5 })
      }})
    }

    function hideText() {
      const el = document.getElementById('ch3-narration')
      if (el) gsap.to(el, { opacity: 0, duration: 0.4 })
    }

    // ── Beat sequencer ────────────────────────────────────────────
    let currentBeat = -1
    let beatTimer: ReturnType<typeof setTimeout> | null = null
    let phase1Done = false

    function advanceBeat() {
      if (phase1Done) return
      currentBeat++
      if (currentBeat >= BEATS.length) return

      const beat = BEATS[currentBeat]

      if (beat.text === null) {
        hideText()
        if (beatTimer) clearTimeout(beatTimer)
        setTimeout(startPhase2, 1500)
        return
      }

      showText(beat.text)
      if (beat.nick) setPose('nick', beat.nick)
      if (beat.judy) setPose('judy', beat.judy)

      if (beatTimer) clearTimeout(beatTimer)
      beatTimer = setTimeout(advanceBeat, 2500)
    }

    const onClick = () => { if (beatTimer) clearTimeout(beatTimer); advanceBeat() }
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (beatTimer) clearTimeout(beatTimer)
      advanceBeat()
    }
    let touchStartY = 0
    const onTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY }
    const onTouchEnd   = (e: TouchEvent) => {
      if (touchStartY - e.changedTouches[0].clientY > 30) {
        if (beatTimer) clearTimeout(beatTimer)
        advanceBeat()
      }
    }

    document.addEventListener('click',      onClick)
    document.addEventListener('wheel',      onWheel, { passive: false })
    document.addEventListener('touchstart', onTouchStart, { passive: true })
    document.addEventListener('touchend',   onTouchEnd,   { passive: true })

    const kickoffTimer = setTimeout(advanceBeat, 600)

    // ── Bar game state ────────────────────────────────────────────
    const openedBars = new Set<number>()
    let activeMessageEl: HTMLElement | null = null
    let resizeCleanup: (() => void) | null = null

    // ── Grid helpers ──────────────────────────────────────────────
    function getRenderedRect(img: HTMLImageElement) {
      const iw = img.naturalWidth,  ih = img.naturalHeight
      const cw = img.clientWidth,   ch = img.clientHeight
      const ir = iw / ih, cr = cw / ch
      let rw: number, rh: number, rx: number, ry: number
      if (ir > cr) { rw = cw; rh = cw / ir; rx = 0; ry = (ch - rh) / 2 }
      else         { rh = ch; rw = ch * ir; ry = 0; rx = (cw - rw) / 2 }
      return { x: rx, y: ry, w: rw, h: rh }
    }

    function computeBarRect(index: number, r: { x: number; y: number; w: number; h: number }) {
      const col = index % BAR_GRID.cols
      const row = Math.floor(index / BAR_GRID.cols)
      const bw  = (BAR_GRID.width  / BAR_GRID.cols) * r.w
      const bh  = (BAR_GRID.height / BAR_GRID.rows) * r.h
      return { x: r.x + BAR_GRID.left * r.w + col * bw, y: r.y + BAR_GRID.top * r.h + row * bh, w: bw, h: bh }
    }

    // ── Bar hover ─────────────────────────────────────────────────
    function onBarHover(index: number, entering: boolean) {
      if (openedBars.has(index)) return
      const cell = document.getElementById(`ch3-bar-cell-${index}`)
      if (!cell) return
      if (entering) {
        gsap.to(cell, { y: -8, duration: 0.28, ease: 'power2.out' })
        gsap.fromTo(`.ch3-shimmer-${index}`, { x: '-150%' }, { x: '150%', duration: 0.55, ease: 'none' })
      } else {
        gsap.to(cell, { y: 0, duration: 0.28, ease: 'power2.inOut' })
      }
    }

    // ── Unwrap animation ──────────────────────────────────────────
    const UNWRAP_SUFFIXES = [
      'wrapped', 'unwrap_2_cornerlift', 'unwrap_3_topflap45',
      'unwrap_4_topflap90', 'unwrap_5_fullyopen', 'unwrap_6_tucked',
    ]
    const UNWRAP_DELAYS_MS = [0, 120, 180, 220, 240, 200]

    function runUnwrap(index: number, onDone: () => void) {
      const cell   = document.getElementById(`ch3-bar-cell-${index}`)
      const barImg = document.getElementById(`ch3-bar-img-${index}`) as HTMLImageElement | null
      const btn    = document.getElementById(`ch3-bar-btn-${index}`)
      if (!cell || !barImg || !btn) return

      btn.style.display = 'none'
      barImg.style.display = 'block'
      barImg.src = `/chapter3/bars/bar_${index + 1}_wrapped.png`

      gsap.timeline()
        .to(cell, { y: -12, rotation: -2, duration: 0.48, ease: 'power2.out' })
        .to(cell, { rotation: 1,          duration: 0.24, ease: 'power1.inOut' })
        .to(cell, { y: 0, rotation: 0,    duration: 0.24, ease: 'power1.in'   })

      const safeBarImg = barImg
      let fi = 0
      function nextFrame() {
        safeBarImg.src = `/chapter3/bars/bar_${index + 1}_${UNWRAP_SUFFIXES[fi]}.png`
        fi++
        if (fi < UNWRAP_SUFFIXES.length) setTimeout(nextFrame, UNWRAP_DELAYS_MS[fi])
        else                              setTimeout(onDone, 250)
      }
      nextFrame()
    }

    // ── Message reveal ────────────────────────────────────────────
    function showBarMessage(index: number) {
      const cell = document.getElementById(`ch3-bar-cell-${index}`)
      if (!cell) return
      const cr  = cell.getBoundingClientRect()
      const rot = parseFloat((Math.random() * 3 - 1.5).toFixed(1))

      const msg = document.createElement('div')
      msg.className = 'ch3-bar-message'
      msg.textContent = BAR_DATA[index].message
      msg.style.left = `${Math.round(cr.left + cr.width / 2)}px`
      msg.style.top  = `${Math.round(cr.top - 12)}px`
      document.body.appendChild(msg)
      activeMessageEl = msg

      gsap.fromTo(msg,
        { opacity: 0, y: 10, xPercent: -50, yPercent: -100, rotation: rot },
        { opacity: 1, y: 0,  xPercent: -50, yPercent: -100, rotation: rot, duration: 0.4, ease: 'power2.out' }
      )
    }

    // ── Lock mechanics ────────────────────────────────────────────
    function jigglePadlock() {
      const btn  = document.getElementById('ch3-bar-btn-7')
      const hint = document.getElementById('ch3-lockHint')
      if (!btn) return
      gsap.to(btn, { rotation: -8, duration: 0.07, repeat: 5, yoyo: true, ease: 'power1.inOut',
        onComplete: () => gsap.set(btn, { rotation: 0 }) })
      if (hint) {
        hint.style.opacity = '1'
        setTimeout(() => { hint.style.opacity = '0' }, 1800)
      }
    }

    function triggerLockBreak() {
      const cell = document.getElementById('ch3-bar-cell-7')
      const btn  = document.getElementById('ch3-bar-btn-7')
      const hint = document.getElementById('ch3-lockHint')
      if (!cell || !btn) return
      if (hint) hint.style.opacity = '0'

      gsap.timeline()
        .to(cell, { scale: 1.06, duration: 0.4, ease: 'power2.inOut' })
        .to(cell, { scale: 1,    duration: 0.2, ease: 'power2.in'    })
        .to(btn,  { rotation: -14, duration: 0.06, repeat: 7, yoyo: true, ease: 'power1.inOut' }, '<')
        .call(() => { btn.textContent = '🔓' }, [], '>')
        .to(btn,  { y: -20, opacity: 0, duration: 0.3, ease: 'power2.in' })
        .call(() => {
          btn.textContent = 'open'
          btn.classList.remove('ch3-bar-btn--locked')
          gsap.to(btn, { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' })
        })
    }

    // ── Bar click ─────────────────────────────────────────────────
    function handleBarClick(index: number) {
      if (openedBars.has(index)) return
      if (index === 7 && openedBars.size < 7) { jigglePadlock(); return }

      openedBars.add(index)

      if (activeMessageEl) {
        const prev = activeMessageEl
        gsap.to(prev, { opacity: 0, duration: 0.3, onComplete: () => prev.remove() })
        activeMessageEl = null
      }

      runUnwrap(index, () => {
        showBarMessage(index)
        if (openedBars.size === 7 && !openedBars.has(7)) setTimeout(triggerLockBreak, 400)
        if (index === 7) {
          setTimeout(() => {
            const btn = document.getElementById('ch3-nextBtn')
            if (btn) {
              btn.style.display = 'block'
              gsap.fromTo(btn, { opacity: 0 }, { opacity: 1, duration: 0.6 })
            }
          }, 800)
        }
      })
    }

    // ── Bar grid rendering ────────────────────────────────────────
    function renderBars(container: HTMLElement, img: HTMLImageElement) {
      const r = getRenderedRect(img)
      container.innerHTML = ''
      container.style.pointerEvents = 'auto'

      for (let i = 0; i < 8; i++) {
        const br = computeBarRect(i, r)

        const cell = document.createElement('div')
        cell.id = `ch3-bar-cell-${i}`
        cell.style.cssText = `position:absolute;left:${br.x}px;top:${br.y}px;width:${br.w}px;height:${br.h}px;overflow:visible;`

        const barImg = document.createElement('img')
        barImg.id = `ch3-bar-img-${i}`
        barImg.style.cssText = 'display:none;position:absolute;inset:0;width:100%;height:100%;object-fit:contain;'
        cell.appendChild(barImg)

        const shimmerWrap = document.createElement('div')
        shimmerWrap.style.cssText = 'position:absolute;inset:0;overflow:hidden;pointer-events:none;border-radius:3px;'
        const shimmer = document.createElement('div')
        shimmer.className = `ch3-shimmer-${i}`
        shimmer.style.cssText = 'position:absolute;top:0;bottom:0;width:35%;background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.55) 50%,transparent 100%);transform:translateX(-150%) skewX(-20deg);pointer-events:none;'
        shimmerWrap.appendChild(shimmer)
        cell.appendChild(shimmerWrap)

        const btn = document.createElement('button')
        btn.id = `ch3-bar-btn-${i}`
        btn.className = 'ch3-bar-btn' + (i === 7 ? ' ch3-bar-btn--locked' : '')
        btn.textContent = i === 7 ? '🔒' : 'open'
        cell.appendChild(btn)

        cell.addEventListener('mouseenter', () => onBarHover(i, true))
        cell.addEventListener('mouseleave', () => onBarHover(i, false))
        btn.addEventListener('click', (e) => { e.stopPropagation(); handleBarClick(i) })

        container.appendChild(cell)
      }

      // Restore visual state for already-opened bars
      openedBars.forEach(i => {
        const b = document.getElementById(`ch3-bar-btn-${i}`)
        const bi = document.getElementById(`ch3-bar-img-${i}`) as HTMLImageElement | null
        if (b)  b.style.display = 'none'
        if (bi) { bi.src = `/chapter3/bars/bar_${i + 1}_unwrap_6_tucked.png`; bi.style.display = 'block' }
      })
      if (activeMessageEl) { activeMessageEl.remove(); activeMessageEl = null }
    }

    // ── Init chocolate game ───────────────────────────────────────
    function initChocGame() {
      const img       = document.getElementById('ch3-chocBox') as HTMLImageElement | null
      const container = document.getElementById('ch3-barContainer') as HTMLElement | null
      if (!img || !container) return

      const onResize = () => renderBars(container, img)
      renderBars(container, img)
      window.addEventListener('resize', onResize)
      resizeCleanup = () => window.removeEventListener('resize', onResize)
    }

    // ── Phase 1 → 2 transition ────────────────────────────────────
    function startPhase2() {
      phase1Done = true
      if (beatTimer)  clearTimeout(beatTimer)
      if (nickTimer)  { clearInterval(nickTimer); nickTimer = null }
      if (judyTimer)  { clearInterval(judyTimer); judyTimer = null }

      gsap.to(phase1, { opacity: 0, duration: 0.6, onComplete: () => { phase1.style.display = 'none' } })
      gsap.fromTo(phase2,
        { opacity: 0, y: '30vh' },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
          onStart:    () => { phase2.classList.add('ch3-active') },
          onComplete: () => { initChocGame() },
        }
      )
    }

    // ── Cleanup ───────────────────────────────────────────────────
    return () => {
      clearTimeout(kickoffTimer)
      if (beatTimer) clearTimeout(beatTimer)
      clearInterval(skyInterval)
      clearInterval(cityInterval)
      if (nickTimer) clearInterval(nickTimer)
      if (judyTimer) clearInterval(judyTimer)

      document.removeEventListener('click',      onClick)
      document.removeEventListener('wheel',      onWheel)
      document.removeEventListener('touchstart', onTouchStart)
      document.removeEventListener('touchend',   onTouchEnd)

      if (resizeCleanup) resizeCleanup()
      if (activeMessageEl) activeMessageEl.remove()

      gsap.killTweensOf(phase1)
      gsap.killTweensOf(phase2)
      const narration = document.getElementById('ch3-narration')
      if (narration) gsap.killTweensOf(narration)
    }
  }, [])

  return (
    <div className="ch3-root">
      {/* Phase 1 — cinematic narration */}
      <div id="ch3-phase1">
        <div id="ch3-sky" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <img id="ch3-skyBase"    src="/chapter3/backgrounds/sky.png"                    alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <img id="ch3-skyOverlay" src="/chapter3/backgrounds/sky_overlays/frame1.png"    alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'screen' }} />
        </div>
        <div id="ch3-city" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <img id="ch3-cityBase"    src="/chapter3/backgrounds/city.png"                   alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <img id="ch3-cityOverlay" src="/chapter3/backgrounds/city_overlays/frame1.png"   alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'screen' }} />
        </div>
        <div className="ch3-char" id="ch3-fox">
          <img id="ch3-foxImg" src="/chapter1/characters/nick/pose1_neutral_idle/frame1.png" alt="" />
        </div>
        <div className="ch3-char" id="ch3-bunny">
          <img id="ch3-bunnyImg" src="/chapter1/characters/judy/pose1_neutral_idle/frame1.png" alt="" />
        </div>
        <div id="ch3-narration" />
      </div>

      {/* Phase 2 — chocolate box game */}
      <div id="ch3-phase2">
        <div id="ch3-chocScene" style={{ position: 'relative', width: '100%', height: '100%' }}>
          <img
            id="ch3-chocBox"
            src="/chapter3/chocolate_box_open.png"
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
          />
          <div id="ch3-barContainer" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
        </div>
        <div id="ch3-lockHint" className="ch3-lock-hint">open the others first</div>
        <button
          id="ch3-nextBtn"
          className="ch3-next-btn"
          onClick={() => onCompleteRef.current()}
        >
          next chapter →
        </button>
      </div>
    </div>
  )
}
