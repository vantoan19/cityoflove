'use client'
import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import Background from './Background'
import SpriteAnimation from '../Chapter1/SpriteAnimation'
import SpeechBubble from '../Chapter1/SpeechBubble'
import './chapter3.css'

const mk = (char: string, pose: string, count: number) =>
  Array.from({ length: count }, (_, i) => `/chapter1/characters/${char}/${pose}/frame${i + 1}.png`)

const NICK_POSES: Record<string, { frames: string[]; frameInterval: number }> = {
  pose1_neutral_idle:         { frames: mk('nick', 'pose1_neutral_idle',        3), frameInterval: 350 },
  pose3_shrug:                { frames: mk('nick', 'pose3_shrug',               3), frameInterval: 300 },
  pose4_pointing_up:          { frames: mk('nick', 'pose4_pointing_up',         2), frameInterval: 300 },
  pose6_finger_guns:          { frames: mk('nick', 'pose6_finger_guns',         2), frameInterval: 250 },
}

const JUDY_POSES: Record<string, { frames: string[]; frameInterval: number }> = {
  pose1_neutral_idle:         { frames: mk('judy', 'pose1_neutral_idle',        3), frameInterval: 350 },
  pose3_curious_pointing:     { frames: mk('judy', 'pose3_curious_pointing',    2), frameInterval: 500 },
  pose4_surprised:            { frames: mk('judy', 'pose4_surprised',           3), frameInterval: 350 },
  pose5_amused:               { frames: mk('judy', 'pose5_amused',              2), frameInterval: 550 },
  pose6_warm_happy:           { frames: mk('judy', 'pose6_warm_happy',          2), frameInterval: 550 },
}

interface Props { onComplete: () => void }

export default function Chapter3({ onComplete }: Props) {
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const [nickPose, setNickPose] = useState('pose1_neutral_idle')
  const [judyPose, setJudyPose] = useState('pose1_neutral_idle')
  const [narrationText, setNarrationText] = useState<string | null>(null)
  const [hintLabel, setHintLabel] = useState<string | null>(null)

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

    const BAR_GRID = { cols: 4, rows: 2, left: 0.08, top: 0.10, width: 0.84, height: 0.80 }

    // ── Phase elements ────────────────────────────────────────────
    const phase1 = document.getElementById('ch3-phase1')!
    const phase2 = document.getElementById('ch3-phase2')!

    // ── Opening splash ────────────────────────────────────────────
    const openingEl    = document.getElementById('ch3-opening')! as HTMLElement
    const openingSub   = openingEl.querySelector('.ch3-opening-sub')!   as HTMLElement
    const openingTitle = openingEl.querySelector('.ch3-opening-title')! as HTMLElement
    gsap.set(openingSub,   { opacity: 0, y: 16 })
    gsap.set(openingTitle, { opacity: 0, y: 16 })

    let openTl: gsap.core.Timeline | null = gsap.timeline()
    openTl.to(openingSub,   { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0.4)
    openTl.to(openingTitle, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, 1.0)
    openTl.to(openingEl,    { opacity: 0, duration: 0.8, ease: 'power1.inOut' }, 3.8)
    openTl.call(() => {
      gsap.set(openingEl, { display: 'none' })
      setHintLabel('Tap anywhere to begin')
    }, undefined, 4.7)

    const onOpeningTap = () => {
      if (!openTl) return
      openTl.kill(); openTl = null
      gsap.set(openingEl, { opacity: 0, display: 'none' })
      setHintLabel('Tap anywhere to begin')
    }
    openingEl.addEventListener('click', onOpeningTap)

    // ── Narration ─────────────────────────────────────────────────
    function showText(text: string) { setNarrationText(text) }
    function hideText()             { setNarrationText(null) }

    // ── Beat sequencer ────────────────────────────────────────────
    let currentBeat = -1
    let phase1Done = false

    function advanceBeat() {
      if (phase1Done) return
      currentBeat++
      if (currentBeat >= BEATS.length) return

      const beat = BEATS[currentBeat]

      if (beat.text === null) {
        hideText()
        setHintLabel(null)
        setTimeout(startPhase2, 1500)
        return
      }

      showText(beat.text)
      setHintLabel('Tap to continue →')
    }

    const onClick = () => { advanceBeat() }
    const onWheel = (e: WheelEvent) => { e.preventDefault(); advanceBeat() }
    let touchStartY = 0
    const onTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY }
    const onTouchEnd   = (e: TouchEvent) => {
      if (touchStartY - e.changedTouches[0].clientY > 30) advanceBeat()
    }

    document.addEventListener('click',      onClick)
    document.addEventListener('wheel',      onWheel, { passive: false })
    document.addEventListener('touchstart', onTouchStart, { passive: true })
    document.addEventListener('touchend',   onTouchEnd,   { passive: true })

    // ── Bar game state ────────────────────────────────────────────
    const openedBars = new Set<number>()
    let resizeCleanup: (() => void) | null = null

    // ── Grid helpers ──────────────────────────────────────────────
    function getRenderedRect(img: HTMLImageElement) {
      return { x: 0, y: 0, w: img.clientWidth, h: img.clientHeight }
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
      } else {
        gsap.to(cell, { y: 0, duration: 0.28, ease: 'power2.inOut' })
      }
    }

    // ── Unwrap animation ──────────────────────────────────────────
    const UNWRAP_SUFFIXES = [
      'wrapped', 'unwrap_2_topedge', 'unwrap_3_topopen',
      'unwrap_4_wings', 'unwrap_5_flat', 'unwrap_6_revealed',
    ]
    const UNWRAP_DELAYS_MS = [0, 300, 450, 550, 600, 500]

    function markChecked(index: number) {
      const cell = document.getElementById(`ch3-bar-cell-${index}`)
      if (!cell) return
      const check = document.createElement('div')
      check.className = 'ch3-bar-checked'
      check.textContent = '✓'
      cell.appendChild(check)
      gsap.fromTo(check, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' })
    }

    function runUnwrap(index: number, onDone: () => void) {
      const btn = document.getElementById(`ch3-bar-btn-${index}`)
      if (btn) btn.style.display = 'none'

      const overlay = document.createElement('div')
      overlay.style.cssText = 'position:fixed;inset:0;z-index:200;cursor:pointer;'

      const img = document.createElement('img')
      img.style.cssText = 'width:100%;height:100%;object-fit:cover;position:absolute;inset:0;'
      img.src = `/chapter3/bars/bar_${index + 1}_wrapped.png`
      overlay.appendChild(img)

      const msg = document.createElement('div')
      msg.className = 'ch3-overlay-message'
      msg.textContent = BAR_DATA[index].message
      msg.style.opacity = '0'
      overlay.appendChild(msg)

      const tapHint = document.createElement('div')
      tapHint.className = 'ch3-overlay-hint'
      tapHint.textContent = 'Tap to continue →'
      tapHint.style.opacity = '0'
      overlay.appendChild(tapHint)

      document.body.appendChild(overlay)
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.25 })

      let unwrapped = false
      let dismissed = false
      const dismiss = () => {
        if (!unwrapped || dismissed) return
        dismissed = true
        gsap.to(overlay, { opacity: 0, duration: 0.4, onComplete: () => {
          overlay.remove()
          markChecked(index)
          onDone()
        }})
      }
      overlay.addEventListener('click', dismiss)

      let fi = 0
      function nextFrame() {
        img.src = `/chapter3/bars/bar_${index + 1}_${UNWRAP_SUFFIXES[fi]}.png`
        fi++
        if (fi < UNWRAP_SUFFIXES.length) {
          setTimeout(nextFrame, UNWRAP_DELAYS_MS[fi])
        } else {
          unwrapped = true
          gsap.to(msg,     { opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.4 })
          gsap.to(tapHint, { opacity: 1, duration: 0.6, ease: 'power2.out', delay: 1.2 })
        }
      }
      nextFrame()
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

      // Fade the entry hint once the user discovers the interaction
      const entryHint = document.getElementById('ch3-phase2Hint')
      if (entryHint && entryHint.style.opacity !== '0') {
        gsap.to(entryHint, { opacity: 0, duration: 0.4, ease: 'power1.out' })
      }

      openedBars.add(index)

      runUnwrap(index, () => {
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
        if (b) b.style.display = 'none'
        markChecked(i)
      })
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

      gsap.to(phase1, { opacity: 0, duration: 0.6, onComplete: () => { phase1.style.display = 'none' } })
      gsap.fromTo(phase2,
        { opacity: 0, y: '30vh' },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
          onStart:    () => { phase2.classList.add('ch3-active') },
          onComplete: () => {
            initChocGame()
            const entryHint = document.getElementById('ch3-phase2Hint')
            if (entryHint) {
              gsap.fromTo(entryHint, { opacity: 0 }, { opacity: 1, duration: 0.6, delay: 0.3 })
            }
          },
        }
      )
    }

    // ── Cleanup ───────────────────────────────────────────────────
    return () => {
      openTl?.kill()
      openingEl.removeEventListener('click', onOpeningTap)
      document.removeEventListener('click',      onClick)
      document.removeEventListener('wheel',      onWheel)
      document.removeEventListener('touchstart', onTouchStart)
      document.removeEventListener('touchend',   onTouchEnd)
      if (resizeCleanup) resizeCleanup()
      gsap.killTweensOf(phase1)
      gsap.killTweensOf(phase2)
    }
  }, [])

  return (
    <div className="ch3-root">
      {/* Opening splash */}
      <div className="ch3-opening" id="ch3-opening">
        <p className="ch3-opening-sub">Chapter 3</p>
        <p className="ch3-opening-title">The night that almost didn&apos;t happen</p>
      </div>

      {/* Phase 1 — cinematic narration */}
      <div id="ch3-phase1">
        <Background />
        <div className="ch3-char ch3-nick">
          <div key={`nick-${nickPose}`} className="ch3-char-inner">
            {NICK_POSES[nickPose] && (
              <SpriteAnimation
                frames={NICK_POSES[nickPose].frames}
                frameInterval={NICK_POSES[nickPose].frameInterval}
                alt="Nick"
              />
            )}
          </div>
          {narrationText && (
            <SpeechBubble key={narrationText} text={narrationText} side="left" variant="speech" />
          )}
        </div>
        <div className="ch3-char ch3-judy">
          <div key={`judy-${judyPose}`} className="ch3-char-inner">
            {JUDY_POSES[judyPose] && (
              <SpriteAnimation
                frames={JUDY_POSES[judyPose].frames}
                frameInterval={JUDY_POSES[judyPose].frameInterval}
                alt="Judy"
              />
            )}
          </div>
        </div>
        {hintLabel && (
          <p key={hintLabel} className="ch3-hint">{hintLabel}</p>
        )}
      </div>

      {/* Phase 2 — chocolate box game */}
      <div id="ch3-phase2">
        <div id="ch3-chocScene" style={{ position: 'absolute', inset: 0 }}>
          <img
            id="ch3-chocBox"
            src="/chapter3/chocolate_box_open.png"
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div id="ch3-barContainer" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
        </div>
        <div id="ch3-phase2Hint" className="ch3-phase2-hint">tap a chocolate to unwrap ♡</div>
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
