'use client'
import { useState, useEffect } from 'react'
import styles from './SpeechBubble.module.css'

const CHAR_INTERVAL_MS = 35

interface Props {
  text: string
  side: 'left' | 'right'
  variant: 'speech' | 'reaction'
}

export default function SpeechBubble({ text, side, variant }: Props) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    setDisplayed('')
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, CHAR_INTERVAL_MS)
    return () => clearInterval(id)
  }, [text])

  return (
    <div key={text} className={`${styles.bubble} ${styles[variant]} ${styles[side]}`}>
      {displayed}
      {displayed.length < text.length && (
        <span className={styles.cursor}>▍</span>
      )}
    </div>
  )
}
