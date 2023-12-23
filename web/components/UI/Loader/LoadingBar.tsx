import styles from './loader.module.css'

const bars = Array(12).fill(0)

export const LoadingBar = ({
  visible,
  color = '#eeeeee',
}: {
  visible: boolean
  color?: string
}) => {
  return (
    <div className={styles.sonnerLoadingWrapper} data-visible={visible}>
      <div className={styles.sonnerSpinner}>
        {bars.map((_, i) => (
          <div
            className={styles.sonnerLoadingBar}
            style={
              {
                '--white': color,
              } as React.CSSProperties
            }
            key={`spinner-bar-${i}`}
          />
        ))}
      </div>
    </div>
  )
}
