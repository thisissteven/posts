import React from 'react'

import { hasVideoGotAudio } from '@/lib'

export function useHasAudio(src?: string) {
  const [hasAudio, setHasAudio] = React.useState(false)
  const [muted, setMuted] = React.useState(true)

  React.useEffect(() => {
    async function setAudio() {
      if (src) {
        const hasAudio = await hasVideoGotAudio(src)
        setHasAudio(hasAudio)
      }
    }

    const timeout = setTimeout(() => {
      setAudio()
    }, 1000)

    return () => {
      clearTimeout(timeout)
    }
  }, [src])

  return {
    hasAudio,
    muted,
    setMuted,
  }
}
