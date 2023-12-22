export function getRelativeTimeString(
  date: Date | number,
  lang = navigator.language
) {
  const timeMs = typeof date === 'number' ? date : date.getTime()
  const deltaSeconds = Math.round((timeMs - Date.now()) / 1000)

  const cutoffs = [
    60,
    3600,
    86400,
    86400 * 7,
    86400 * 30,
    86400 * 365,
    Infinity,
  ]

  const unitIndex = cutoffs.findIndex(
    (cutoff) => cutoff > Math.abs(deltaSeconds)
  )

  const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1

  const relativeTime = Math.floor(deltaSeconds / divisor)

  if (unitIndex === 0) {
    // For seconds
    return `${Math.abs(relativeTime)}s`
  } else if (unitIndex === 1) {
    // For minutes
    return `${Math.abs(relativeTime)}m`
  } else if (unitIndex === 2) {
    // For hours
    return `${Math.abs(relativeTime)}h`
  } else if (unitIndex === 3) {
    // For days
    if (relativeTime === -1) {
      return 'yesterday'
    } else if (relativeTime === 1) {
      return 'tomorrow'
    } else if (relativeTime > 1 && relativeTime <= 7) {
      return `${Math.abs(relativeTime)}d`
    } else {
      return `${Math.abs(Math.floor(relativeTime / 7))}w`
    }
  } else if (unitIndex === 4) {
    // For weeks
    if (relativeTime === -1) {
      return 'next week'
    } else {
      return `${Math.abs(relativeTime)}w`
    }
  } else if (unitIndex === 5) {
    // For months
    return `${Math.abs(relativeTime)}mo`
  } else {
    // For years
    return `${Math.abs(relativeTime)}y`
  }
}
