'use client'
interface Props { onComplete: () => void }
export default function Chapter1({ onComplete }: Props) {
  return (
    <div data-testid="chapter-1" style={{ width: '100%', height: '100%', background: '#A8D8EA' }}>
      <button onClick={onComplete}>Chapter 1 stub</button>
    </div>
  )
}
