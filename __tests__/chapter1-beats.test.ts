import { beats, INTRO_BEAT, CTA_BEAT, MAX_BEAT } from '../components/chapters/Chapter1/chapter1-beats'

test('has exactly 8 beats (0=intro, 1-6=dialogue, 7=CTA)', () => {
  expect(beats).toHaveLength(8)
})

test('beat 0 has no text', () => {
  expect(beats[INTRO_BEAT].text).toBeNull()
  expect(beats[INTRO_BEAT].cta).toBeUndefined()
})

test('beats 1–6 have non-null text and no CTA', () => {
  for (let i = 1; i <= 6; i++) {
    expect(beats[i].text).not.toBeNull()
    expect(beats[i].cta).toBeUndefined()
  }
})

test('beat 7 has no text and has CTA', () => {
  expect(beats[CTA_BEAT].text).toBeNull()
  expect(beats[CTA_BEAT].cta).toBe("Let's explore →")
})

test('MAX_BEAT is 7', () => {
  expect(MAX_BEAT).toBe(7)
})
