import { nickPoseConfigs, judyPoseConfigs } from '../components/chapters/Chapter1/chapter1-poses'

test('nickPoseConfigs has all 7 Nick poses', () => {
  const expected = ['neutral_idle','presenting','shrug','pointing_up','sunglasses','finger_guns','thumbs_up']
  expect(Object.keys(nickPoseConfigs)).toEqual(expect.arrayContaining(expected))
})

test('judyPoseConfigs has all 6 Judy poses', () => {
  const expected = ['neutral_idle','smug','curious_pointing','surprised','amused','warm_happy']
  expect(Object.keys(judyPoseConfigs)).toEqual(expect.arrayContaining(expected))
})

test('every nick pose has ≥1 frame and a positive frameInterval', () => {
  for (const cfg of Object.values(nickPoseConfigs)) {
    expect(cfg.frames.length).toBeGreaterThanOrEqual(1)
    expect(cfg.frameInterval).toBeGreaterThan(0)
  }
})

test('every judy pose has ≥1 frame and a positive frameInterval', () => {
  for (const cfg of Object.values(judyPoseConfigs)) {
    expect(cfg.frames.length).toBeGreaterThanOrEqual(1)
    expect(cfg.frameInterval).toBeGreaterThan(0)
  }
})
