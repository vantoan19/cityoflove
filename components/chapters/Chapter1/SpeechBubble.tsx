import styles from './SpeechBubble.module.css'

interface Props {
  text: string
  side: 'left' | 'right'
}

export default function SpeechBubble({ text, side }: Props) {
  return (
    <div key={text} className={`${styles.bubble} ${styles[side]}`}>
      {text}
    </div>
  )
}
