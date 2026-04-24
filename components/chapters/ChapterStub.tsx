interface Props {
  chapterNumber: number
  onBack: () => void
}

const chapterTitles: Record<number, string> = {
  2: 'How This Even Started',
  3: 'The Night That Almost Didn\'t Happen',
  4: 'The Fun Part',
  5: 'The Speedrun',
  6: 'The Glitch',
  7: 'What I Learned',
  8: 'Explore the City',
  9: 'No Script',
}

const stubGradients: Record<number, string> = {
  2: 'linear-gradient(135deg, #FFD3B6 0%, #CFFFE5 100%)',
  3: 'linear-gradient(135deg, #1A1A2E 0%, #2D1B4E 100%)',
  4: 'linear-gradient(135deg, #FFD3B6 0%, #FFE4B6 100%)',
  5: 'linear-gradient(135deg, #4A4A4A 0%, #1A1A1A 100%)',
  6: 'linear-gradient(135deg, #A8A8C8 0%, #E6E6FA 100%)',
  7: 'linear-gradient(135deg, #FAFAFA 0%, #E0E0E0 100%)',
  8: 'linear-gradient(135deg, #A8D8EA 0%, #E6E6FA 100%)',
  9: 'linear-gradient(135deg, #1A1A2E 0%, #4A4A6A 100%)',
}

export default function ChapterStub({ chapterNumber, onBack }: Props) {
  const title = chapterTitles[chapterNumber] ?? `Chapter ${chapterNumber}`
  const bg = stubGradients[chapterNumber] ?? 'linear-gradient(135deg, #FAFAFA 0%, #E0E0E0 100%)'
  const dark = chapterNumber === 3 || chapterNumber === 5 || chapterNumber === 9

  return (
    <div
      data-testid={`chapter-stub-${chapterNumber}`}
      style={{
        width: '100%', height: '100%', background: bg,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '24px',
      }}
    >
      <p style={{ fontFamily: 'sans-serif', fontSize: '12px', letterSpacing: '0.15em',
        textTransform: 'uppercase', color: dark ? 'rgba(255,255,255,0.5)' : '#888' }}>
        Chapter {chapterNumber}
      </p>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
        color: dark ? '#FAFAFA' : '#1A1A1A', textAlign: 'center', maxWidth: '600px',
        lineHeight: 1.3, padding: '0 24px' }}>
        {title}
      </h2>
      <p style={{ fontFamily: 'sans-serif', fontSize: '13px',
        color: dark ? 'rgba(255,255,255,0.4)' : '#aaa' }}>
        coming soon
      </p>
      <button
        onClick={onBack}
        style={{
          marginTop: '16px', background: 'transparent', border: 'none', cursor: 'pointer',
          fontFamily: 'sans-serif', fontSize: '13px',
          color: dark ? 'rgba(255,255,255,0.6)' : '#666',
          textDecoration: 'underline', textUnderlineOffset: '3px',
        }}
      >
        ← Back to Chapter 1
      </button>
    </div>
  )
}
