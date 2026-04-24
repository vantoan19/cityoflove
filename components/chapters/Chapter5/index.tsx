'use client'
interface Props { onComplete: () => void }
export default function Chapter5({ onComplete }: Props) {
  return (
    <div style={{ width: '100%', height: '100%', background: '#0D1117', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#aaa', fontFamily: 'sans-serif' }}>Chapter 5 — coming soon</p>
    </div>
  )
}
