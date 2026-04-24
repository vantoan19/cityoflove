import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DialogueBox from '../components/chapters/Chapter1/DialogueBox'
import { beats } from '../components/chapters/Chapter1/chapter1-beats'

test('renders progress dots for a normal beat', () => {
  render(<DialogueBox beat={beats[1]} beatIndex={1} onAdvance={vi.fn()} onComplete={vi.fn()} />)
  expect(screen.getAllByTestId('beat-dot')).toHaveLength(7)
})

test('calls onAdvance when tapping scene wrapper', async () => {
  const onAdvance = vi.fn()
  render(<DialogueBox beat={beats[1]} beatIndex={1} onAdvance={onAdvance} onComplete={vi.fn()} />)
  await userEvent.click(screen.getByTestId('scene-tap-target'))
  expect(onAdvance).toHaveBeenCalledOnce()
})

test('does NOT call onAdvance when CTA beat — calls onComplete on button click', async () => {
  const onAdvance = vi.fn()
  const onComplete = vi.fn()
  render(<DialogueBox beat={beats[7]} beatIndex={7} onAdvance={onAdvance} onComplete={onComplete} />)
  await userEvent.click(screen.getByRole('button', { name: /explore/i }))
  expect(onAdvance).not.toHaveBeenCalled()
  expect(onComplete).toHaveBeenCalledOnce()
})

test('shows 7 progress dots for beats 1–7', () => {
  render(<DialogueBox beat={beats[3]} beatIndex={3} onAdvance={vi.fn()} onComplete={vi.fn()} />)
  expect(screen.getAllByTestId('beat-dot')).toHaveLength(7)
})
