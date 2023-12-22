import React from 'react'

import { hasAudio as doesVideoHaveAudio } from '@/lib'

export function useHasAudio() {
  const [hasAudio, setHasAudio] = React.useState(false)
  const [muted, setMuted] = React.useState(true)

  const videoRef = React.useRef<HTMLVideoElement>(null)

  React.useEffect(() => {
    async function setAudio() {
      if (videoRef.current) {
        const videoHasAudio = await doesVideoHaveAudio(videoRef.current)
        setHasAudio(videoHasAudio)
      }
    }

    const timeout = setTimeout(() => {
      setAudio()
    }, 1000)

    return () => {
      clearTimeout(timeout)
    }
  }, [hasAudio])

  return {
    hasAudio,
    muted,
    setMuted,
    videoRef,
  }
}
