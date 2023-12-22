import styles from './loader.module.css'

const bars = Array(12).fill(0)

export const LoadingBar = ({ visible }: { visible: boolean }) => {
  return (
    <div className={styles.sonnerLoadingWrapper} data-visible={visible}>
      <div className={styles.sonnerSpinner}>
        {bars.map((_, i) => (
          <div className={styles.sonnerLoadingBar} key={`spinner-bar-${i}`} />
        ))}
      </div>
    </div>
  )
}
