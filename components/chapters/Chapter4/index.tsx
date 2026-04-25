'use client'
import { useRef, useEffect } from 'react'
import './chapter4.css'

interface Props { onComplete: () => void }

export default function Chapter4({ onComplete }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    const root = rootRef.current!

    const BEATS = [
      'ch4-b1',  'ch4-b2',  'ch4-b3',  'ch4-b4',  'ch4-b5',
      'ch4-b6',  'ch4-b7',  'ch4-b8',  'ch4-b9',  'ch4-b10',
      'ch4-b11', 'ch4-b12', 'ch4-b13', 'ch4-b14', 'ch4-b15',
      'ch4-b16', 'ch4-b17', 'ch4-b18',
    ] as const

    // CSS-reveal beats: skip typing engine, the keyframe animation IS the reveal
    const CSS_BEATS = new Set<string>(['ch4-b2', 'ch4-b6', 'ch4-b12', 'ch4-b13', 'ch4-b14', 'ch4-b18'])

    const SLOW_FROM = 13 // BEATS index of ch4-b14 — Scene C starts here

    const ZONES: Array<{ idx: number; zone: string; videoId: string | null; glow: boolean }> = [
      { idx: 0,  zone: '0', videoId: 'ch4-vi-night',   glow: true  },
      { idx: 3,  zone: '1', videoId: null,              glow: true  },
      { idx: 5,  zone: '2', videoId: 'ch4-vi-tree',    glow: false },
      { idx: 7,  zone: '2', videoId: null,              glow: false },
      { idx: 10, zone: '3', videoId: 'ch4-vi-shelter',  glow: false },
      { idx: 11, zone: '4', videoId: 'ch4-vi-food',    glow: false },
      { idx: 13, zone: '5', videoId: null,              glow: false },
      { idx: 17, zone: '6', videoId: null,              glow: false },
    ]

    const gid = (id: string) => document.getElementById(id) as HTMLElement | null

    function setZone(zone: string, videoId: string | null, glow: boolean) {
      root.dataset.zone = zone
      root.querySelectorAll<HTMLVideoElement>('.ch4-bg-video').forEach(v => {
        v.classList.remove('ch4-on')
        v.pause()
      })
      if (videoId) {
        const v = gid(videoId) as HTMLVideoElement | null
        if (v) { v.classList.add('ch4-on'); v.play().catch(() => {}) }
      }
      const pg = gid('ch4-phone-glow')
      if (glow) pg?.classList.add('ch4-on')
      else      pg?.classList.remove('ch4-on')
    }

    function moreStars(win: HTMLElement) {
      const extra: [number, number, number, number][] = [
        [1.5,10,45,3.1],[2,50,70,2.5],[1,65,28,4.2],[2,30,10,2.9],
        [1.5,85,90,3.7],[1,5,60,2.2],[2,55,50,3.5],[1.5,75,35,2.7],
        [1,92,18,4.4],[2,18,82,2.0],[1.5,42,95,3.3],
      ]
      extra.forEach(([w, t, l, tw], i) => {
        setTimeout(() => {
          const d = document.createElement('div')
          d.className = 'ch4-star-dot'
          d.style.cssText = `width:${w}px;height:${w}px;top:${t}%;left:${l}%;--tw:${tw}s;opacity:0;transition:opacity 1s`
          win.appendChild(d)
          requestAnimationFrame(() => requestAnimationFrame(() => { d.style.opacity = '1' }))
        }, i * 160)
      })
    }

    function launchSparkles(
      anchor: HTMLElement,
      colors: string[], chars: string[],
      distMin: number, distMax: number
    ) {
      const rect = anchor.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top  + rect.height / 2
      chars.forEach((ch, i) => {
        const s    = document.createElement('span')
        const ang  = (i / chars.length) * 360 + Math.random() * 28
        const dist = distMin + Math.random() * (distMax - distMin)
        const rad  = ang * Math.PI / 180
        s.textContent = ch
        s.style.cssText = `
          position:fixed;left:${cx}px;top:${cy}px;pointer-events:none;z-index:999;
          font-size:${[10,14,18,14,10,18,12][i] ?? 12}px;
          color:${colors[i % colors.length]};
          --sx:${+(Math.cos(rad) * dist).toFixed(1)}px;
          --sy:${+(Math.sin(rad) * dist).toFixed(1)}px;
          --sx2:${+(Math.cos(rad) * dist * 1.4).toFixed(1)}px;
          --sy2:${+(Math.sin(rad) * dist * 1.4 + 10).toFixed(1)}px;
          --sr:${~~(Math.random() * 360)}deg;
          --sr2:${~~(Math.random() * 720)}deg;
          animation:ch4SparkleFly ${(.9 + Math.random() * .5).toFixed(2)}s ${i * 75}ms forwards;
        `
        document.body.appendChild(s)
        s.addEventListener('animationend', () => s.remove())
      })
    }

    /* ── Typing engine ── */
    type BeatPara = { p: HTMLElement; text: string }
    const beatParas = new Map<string, BeatPara[]>()

    BEATS.forEach(id => {
      if (CSS_BEATS.has(id)) return
      const el = document.getElementById(id)
      if (!el) return
      const paras: BeatPara[] = []
      el.querySelectorAll<HTMLElement>('p').forEach(p => {
        paras.push({ p, text: p.textContent ?? '' })
      })
      beatParas.set(id, paras)
    })

    const typingTimers = new Map<string, ReturnType<typeof setTimeout>[]>()

    function cancelTyping(id: string) {
      ;(typingTimers.get(id) ?? []).forEach(clearTimeout)
      typingTimers.set(id, [])
    }

    function typeBeat(id: string, slow: boolean) {
      cancelTyping(id)
      const paras = beatParas.get(id)
      if (!paras) return
      paras.forEach(({ p }) => { p.textContent = '' })

      const charMs  = slow ? 35 : 12
      const paraGap = 280
      let   time    = 80
      const timers: ReturnType<typeof setTimeout>[] = []

      paras.forEach(({ p, text }) => {
        if (p.dataset.d !== undefined) {
          const t = time
          timers.push(setTimeout(() => p.classList.add('ch4-on'), t))
        }
        for (let i = 0; i < text.length; i++) {
          const c    = text[i]
          const fire = time
          time += charMs + Math.floor(Math.random() * Math.ceil(charMs * 0.4))
          timers.push(setTimeout(() => { p.textContent += c }, fire))
        }
        time += paraGap
      })

      typingTimers.set(id, timers)
    }

    /* ── Beat lifecycle ── */
    let endShown = false

    function showBeat(idx: number) {
      const id = BEATS[idx]
      const el = gid(id)
      if (!el) return

      el.classList.add('ch4-on')

      if (CSS_BEATS.has(id)) {
        el.querySelectorAll<HTMLElement>('[data-d]').forEach(c => {
          const delay = parseInt(c.dataset.d ?? '0', 10) || 200
          setTimeout(() => c.classList.add('ch4-on'), delay)
        })
      } else {
        typeBeat(id, idx >= SLOW_FROM)
      }

      const zoneEntry = ZONES.find(z => z.idx === idx)
      if (zoneEntry) setZone(zoneEntry.zone, zoneEntry.videoId, zoneEntry.glow)

      if (id === 'ch4-b1') {
        setTimeout(() => {
          root.querySelectorAll<HTMLElement>('.ch4-dk').forEach((d, j) =>
            setTimeout(() => d.classList.add('ch4-on'), j * 400)
          )
        }, 700)
      }

      if (id === 'ch4-b4') {
        const win = el.querySelector<HTMLElement>('.ch4-stars-win')
        if (win) setTimeout(() => moreStars(win), 900)
      }

      if (id === 'ch4-b14') {
        gid('ch4-dk-heart')?.classList.add('ch4-on')
        gid('ch4-warm-glow')?.classList.add('ch4-on')
        setTimeout(() => {
          const laugh = el.querySelector<HTMLElement>('.ch4-t-laugh')
          if (laugh) launchSparkles(laugh,
            ['#D4756B','#FFD3B6','#FFBFA0','#FFB347'],
            ['✦','✧','·','✦','✧','·','✦'], 40, 75)
        }, 600)
      }

      if (id === 'ch4-b18') {
        const sw = el.querySelector<HTMLElement>('.ch4-spark-w')
        if (sw) setTimeout(() => launchSparkles(sw,
          ['#FFD3B6','#E6E6FA','#A8D8EA'],
          ['✦','✧','✦','✧','✦','✧','✦'], 35, 72), 400)

        if (!endShown) {
          endShown = true
          setTimeout(() => {
            const endEl = gid('ch4-end')
            if (endEl) endEl.classList.add('ch4-on')
            const btn = gid('ch4-next-btn')
            if (btn) btn.onclick = () => onCompleteRef.current()
          }, 2200)
        }
      }
    }

    function hideBeat(idx: number, cb: () => void) {
      const id = BEATS[idx]
      const el = gid(id)
      if (!el) { cb(); return }
      cancelTyping(id)
      el.classList.remove('ch4-on')
      el.querySelectorAll<HTMLElement>('[data-d]').forEach(c => c.classList.remove('ch4-on'))
      setTimeout(cb, idx >= SLOW_FROM ? 600 : 280)
    }

    /* ── Step navigation ── */
    let current   = -1
    let animating = false
    const hintEl  = gid('ch4-hint')

    function goTo(next: number) {
      if (animating) return
      if (next === current) return
      if (next < -1 || next >= BEATS.length) return

      animating = true
      const prev = current
      current    = next

      function doShow() {
        if (next === -1) {
          hintEl?.classList.add('ch4-on')
          animating = false
          return
        }
        showBeat(next)
        const lockMs = next >= SLOW_FROM ? 1200 : 600
        setTimeout(() => { animating = false }, lockMs)
      }

      if (prev === -1) {
        hintEl?.classList.remove('ch4-on')
        setTimeout(doShow, 280)
      } else {
        hideBeat(prev, doShow)
      }
    }

    /* ── Input handlers ── */
    const hintTimer = setTimeout(() => hintEl?.classList.add('ch4-on'), 800)

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
      if (e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); goTo(current + 1) }
      else if (e.key === 'ArrowUp')               { e.preventDefault(); goTo(current - 1) }
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      clearTimeout(hintTimer)
      BEATS.forEach(id => cancelTyping(id))
      window.removeEventListener('wheel',      onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend',   onTouchEnd)
      window.removeEventListener('keydown',    onKeyDown)
    }
  }, [])

  return (
    <div className="ch4-root" ref={rootRef} data-zone="0">
      <div className="ch4-bg-wash" />

      <video className="ch4-bg-video" id="ch4-vi-night" autoPlay muted loop playsInline>
        <source src="/chapter4/bg_night_room.mp4" type="video/mp4" />
      </video>
      <video className="ch4-bg-video" id="ch4-vi-tree" autoPlay muted loop playsInline>
        <source src="/chapter4/bg_tree_path.mp4" type="video/mp4" />
      </video>
      <video className="ch4-bg-video" id="ch4-vi-shelter" autoPlay muted loop playsInline>
        <source src="/chapter4/bg_shelter.mp4" type="video/mp4" />
      </video>
      <video className="ch4-bg-video" id="ch4-vi-food" autoPlay muted loop playsInline>
        <source src="/chapter4/bg_restaurant_table.mp4" type="video/mp4" />
      </video>

      <div className="ch4-phone-glow ch4-on" id="ch4-phone-glow" />
      <div className="ch4-warm-glow" id="ch4-warm-glow" />

      <div className="ch4-doodle-layer">
        <span className="ch4-dk ch4-dk-arr">→ ←</span>
        <span className="ch4-dk ch4-dk-sp">✦</span>
        <span className="ch4-dk ch4-dk-leaf">🍃</span>
        <span className="ch4-dk ch4-dk-heart" id="ch4-dk-heart">♡</span>
        <span className="ch4-dk ch4-dk-ramen">🍜</span>
      </div>

      <div className="ch4-hint" id="ch4-hint">
        scroll to begin
        <span className="ch4-hint-arrow">↓</span>
      </div>

      <div className="ch4-scroll">

        <div className="ch4-beat" id="ch4-b1">
          <p className="ch4-t-main">We started simple.</p>
        </div>

        <div className="ch4-beat" id="ch4-b2">
          <div className="ch4-chat-wrap">
            <div className="ch4-bbl ch4-bbl-l">Jokes.</div>
            <div className="ch4-bbl ch4-bbl-r">Teasing.</div>
          </div>
        </div>

        <div className="ch4-beat" id="ch4-b3">
          <p className="ch4-t-aside">A suspicious amount of jokes.</p>
        </div>

        <div className="ch4-beat" id="ch4-b4">
          <p className="ch4-t-main">There were nights that just didn&rsquo;t end.</p>
          <div className="ch4-stars-win" id="ch4-stars-win">
            <div className="ch4-star-dot" style={{ width: '2px',   height: '2px',   top: '20%', left: '24%', ['--tw' as never]: '2.8s' }} />
            <div className="ch4-star-dot" style={{ width: '1.5px', height: '1.5px', top: '36%', left: '54%', ['--tw' as never]: '3.4s' }} />
            <div className="ch4-star-dot" style={{ width: '2px',   height: '2px',   top: '58%', left: '40%', ['--tw' as never]: '2.1s' }} />
            <div className="ch4-star-dot" style={{ width: '1px',   height: '1px',   top: '16%', left: '74%', ['--tw' as never]: '4.0s' }} />
            <div className="ch4-star-dot" style={{ width: '2px',   height: '2px',   top: '72%', left: '80%', ['--tw' as never]: '3.2s' }} />
            <div className="ch4-star-dot" style={{ width: '1.5px', height: '1.5px', top: '44%', left: '16%', ['--tw' as never]: '2.6s' }} />
            <div className="ch4-star-dot" style={{ width: '1px',   height: '1px',   top: '82%', left: '62%', ['--tw' as never]: '3.8s' }} />
            <div className="ch4-star-dot" style={{ width: '2px',   height: '2px',   top: '26%', left: '88%', ['--tw' as never]: '2.3s' }} />
          </div>
        </div>

        <div className="ch4-beat" id="ch4-b5">
          <p className="ch4-t-line">Not because of insomnia.</p>
          <p className="ch4-t-line" data-d="1">Because of you.</p>
        </div>

        <div className="ch4-beat" id="ch4-b6">
          <div className="ch4-leaves-box">
            <span className="ch4-leaf-float">🍃</span>
            <p className="ch4-t-line">We smelled tree leaves</p>
            <p className="ch4-t-aside" data-d="200">like we were doing something illegal.</p>
          </div>
        </div>

        <div className="ch4-beat" id="ch4-b7">
          <p className="ch4-t-tiny">(We were not.)</p>
        </div>

        <div className="ch4-beat" id="ch4-b8">
          <p className="ch4-t-med">The small talks.</p>
        </div>

        <div className="ch4-beat" id="ch4-b9">
          <p className="ch4-t-line">The &ldquo;how was your day&rdquo;</p>
          <p className="ch4-t-line" data-d="1">that somehow unpacked everything.</p>
        </div>

        <div className="ch4-beat" id="ch4-b10">
          <p className="ch4-t-line">The kind that makes a long day</p>
          <p className="ch4-t-line" data-d="1">feel like it was worth it.</p>
        </div>

        <div className="ch4-beat" id="ch4-b11">
          <div className="ch4-shelter-box">
            <p className="ch4-t-shelt">You&rsquo;re my little ritual shelter.</p>
          </div>
        </div>

        <div className="ch4-beat" id="ch4-b12">
          <div className="ch4-food-table">
            <span className="ch4-food-em">🍜</span>
            <span className="ch4-food-em">🍜</span>
            <span className="ch4-food-em">🥟</span>
            <span className="ch4-food-em">🧋</span>
          </div>
        </div>

        <div className="ch4-beat" id="ch4-b13">
          <div className="ch4-arrow-pair">
            <span className="ch4-arr-l">→</span>
            <span className="ch4-arr-r">←</span>
          </div>
          <p className="ch4-t-emoji ch4-lt">👉👈</p>
          <p className="ch4-t-aside ch4-lt">(you know what I mean)</p>
        </div>

        <div className="ch4-beat ch4-beat-rel" id="ch4-b14">
          <div className="ch4-laugh-bg" />
          <p className="ch4-t-laugh">You laughed.</p>
        </div>

        <div className="ch4-beat" id="ch4-b15">
          <p className="ch4-t-smile">You smiled.</p>
        </div>

        <div className="ch4-beat" id="ch4-b16">
          <p className="ch4-t-coddl">You coddled.</p>
        </div>

        <div className="ch4-beat" id="ch4-b17">
          <p className="ch4-t-eyes">And your eyes did that thing&hellip;</p>
        </div>

        <div className="ch4-beat ch4-beat-rel" id="ch4-b18">
          <p className="ch4-t-line">where they <span className="ch4-spark-w">✦spark✦</span></p>
          <p className="ch4-t-small ch4-t-aside" data-d="250">a little more than necessary.</p>
          <span className="ch4-amb ch4-amb-1">✦</span>
          <span className="ch4-amb ch4-amb-2">✧</span>
        </div>

      </div>

      <div className="ch4-end" id="ch4-end">
        <span className="ch4-end-label">Chapter 4</span>
        <button className="ch4-next-btn" id="ch4-next-btn">Continue →</button>
      </div>

    </div>
  )
}
