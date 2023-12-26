import React from 'react'

import { Overlay } from '.'

export function FadeOut({ duration = 300 }: { duration?: number }) {
  const [isLoading, toggleLoading] = React.useReducer((state) => !state, true)

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      toggleLoading()
    }, duration)

    return () => {
      clearTimeout(timeout)
    }
  }, [duration])

  return <Overlay visible={isLoading} noRemove />
}
