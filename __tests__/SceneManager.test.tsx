import { render, screen } from '@testing-library/react'
import SceneManager from '../components/SceneManager'

test('renders chapter-1 scene on initial load', () => {
  render(<SceneManager />)
  expect(screen.getByTestId('chapter-1')).toBeInTheDocument()
})

test('does not render chapter-2 stub initially', () => {
  render(<SceneManager />)
  expect(screen.queryByTestId('chapter-stub-2')).not.toBeInTheDocument()
})
