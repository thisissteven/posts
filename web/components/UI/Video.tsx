import * as React from 'react'

import { useHasAudio } from '@/hooks'

import { Muted, Unmuted } from '@/components/Icons'

export function Video({
  shouldMuteOnDialogClose,
  shouldMuteOnDialogOpen,
  ...props
}: React.ComponentPropsWithoutRef<'video'> & {
  shouldMuteOnDialogOpen?: boolean
  shouldMuteOnDialogClose?: boolean
}) {
  const { muted, setMuted, hasAudio, videoRef } = useHasAudio()

  React.useEffect(() => {
    const videoElement = videoRef.current

    if (!videoElement) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          videoElement.pause()
        } else {
          videoElement.play()
        }
      },
      {
        rootMargin: '0px',
      }
    )

    observer.observe(videoElement)

    return () => {
      observer.unobserve(videoElement)
      observer.disconnect()
    }
  }, [videoRef])

  return (
    <>
      <video
        {...props}
        ref={videoRef}
        muted={muted}
        autoPlay
        playsInline
        loop
      />
      <button
        type="button"
        disabled={!hasAudio}
        onClick={(e) => {
          e.stopPropagation()
          setMuted((prev) => !prev)
        }}
        className="absolute disabled:opacity-80 disabled:active:bg-black/50 active:bg-black/60 duration-200 bottom-0 right-0 mx-3 my-4 p-0.5 rounded-full bg-black/50"
      >
        {muted ? <Muted /> : <Unmuted />}
      </button>
    </>
  )
}
