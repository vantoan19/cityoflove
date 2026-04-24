import styles from './SpeechBubble.module.css'

interface Props {
  text: string
  side: 'left' | 'right'
  variant: 'speech' | 'reaction'
}

export default function SpeechBubble({ text, side, variant }: Props) {
  return (
    <div key={text} className={`${styles.bubble} ${styles[variant]} ${styles[side]}`}>
      {text}
    </div>
  )
}
