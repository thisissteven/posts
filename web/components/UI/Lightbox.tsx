import Image from 'next/image'
import * as React from 'react'

import { Dialog } from './LightboxDialog'

function Video(props: React.ComponentPropsWithoutRef<'video'>) {
  const videoRef = React.useRef<HTMLVideoElement>(null)

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
  }, [])

  return <video {...props} ref={videoRef} muted autoPlay playsInline loop />
}

export function Lightbox({
  mediaType,
  source,
  highResSource,
}: {
  mediaType: 'image' | 'video'
  source: string
  highResSource: string
}) {
  return (
    <Dialog>
      <Dialog.Trigger
        asChild
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <div
          tabIndex={-1}
          className="mt-3 bg-soft-background relative rounded-lg overflow-hidden"
        >
          {mediaType === 'image' && (
            <Image
              className="w-full"
              src={source}
              alt="thread"
              width={430}
              height={263}
            />
          )}

          {mediaType === 'video' && <Video className="w-full" src={source} />}
        </div>
      </Dialog.Trigger>
      <Dialog.Content
        overlayClassName="bg-background brightness-100 data-[dialog-state=exit]:duration-300 data-[dialog-state=exit]:delay-300"
        className="grid place-items-center data-[dialog-state=animate]:delay-500 data-[dialog-state=animate]:duration-500 data-[dialog-state=exit]:duration-500"
      >
        {mediaType === 'image' && (
          <Image
            width={2048}
            height={2048}
            src={highResSource}
            alt="image"
            className="object-contain w-full h-full"
          />
        )}

        {mediaType === 'video' && (
          <Video className="w-full h-full" src={highResSource} />
        )}
      </Dialog.Content>
    </Dialog>
  )
}
