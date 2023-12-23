import * as React from 'react'

export function useDebouncedCallback() {
  const timeoutId = React.useRef<NodeJS.Timeout>()

  const debounce = React.useCallback(
    (fn: (...args: unknown[]) => unknown, ms = 300) => {
      return function (this: unknown, ...args: unknown[]) {
        clearTimeout(timeoutId.current)
        timeoutId.current = setTimeout(() => fn.apply(this, args), ms)
      }
    },
    []
  )

  return debounce
}
