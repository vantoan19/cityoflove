'use client'
import Background from './Background'
interface Props { onComplete: () => void }
export default function Chapter1({ onComplete }: Props) {
  return (
    <div data-testid="chapter-1" style={{ width: '100%', height: '100%', position: 'relative', background: '#A8D8EA' }}>
      <Background />
      <button onClick={onComplete} style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 10 }}>next</button>
    </div>
  )
}
