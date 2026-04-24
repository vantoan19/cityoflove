import styles from './NavigationHint.module.css'

interface Props {
  label: string
}

export default function NavigationHint({ label }: Props) {
  return (
    <p className={styles.hint}>
      {label}
    </p>
  )
}
