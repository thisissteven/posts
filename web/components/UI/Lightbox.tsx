import Image from 'next/image'
import * as React from 'react'

import { useHasAudio } from '@/hooks'

import { useDialogActions } from '@/store'

import { Dialog, useDialog } from './LightboxDialog'
import { Muted, Unmuted } from '../Icons'

function Video({
  shouldMuteOnDialogClose,
  shouldMuteOnDialogOpen,
  ...props
}: React.ComponentPropsWithoutRef<'video'> & {
  shouldMuteOnDialogOpen?: boolean
  shouldMuteOnDialogClose?: boolean
}) {
  const { isOpen } = useDialog()

  const { muted, setMuted, hasAudio, videoRef } = useHasAudio()

  React.useEffect(() => {
    if (isOpen && shouldMuteOnDialogOpen) {
      setMuted(true)
    }
  }, [isOpen, shouldMuteOnDialogOpen, setMuted])

  React.useEffect(() => {
    if (!isOpen && shouldMuteOnDialogClose) {
      setMuted(true)
    }
  }, [isOpen, shouldMuteOnDialogClose, setMuted])

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

export function Lightbox({
  mediaType,
  source,
  highResSource,
  width,
  height,
  alt,
}: {
  mediaType: 'image' | 'video'
  source: string
  highResSource?: string
  width?: number
  height?: number
  alt?: string
}) {
  const { openDialog } = useDialogActions()

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
          className="mt-3 relative bg-soft-background rounded-lg overflow-hidden"
        >
          {mediaType === 'image' && (
            <>
              <Image
                className="w-full"
                src={source}
                alt="thread"
                width={width}
                height={height}
              />
              {alt && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    openDialog('ALT', alt)
                  }}
                  className="absolute active:bg-black/60 duration-200 right-0 bottom-0 mx-3 my-4 w-7 h-7 rounded-full bg-black/50 text-[10px]"
                >
                  ALT
                </button>
              )}
            </>
          )}

          {mediaType === 'video' && (
            <Video
              shouldMuteOnDialogOpen
              className="w-full"
              src={source}
              width={width}
              height={height}
            />
          )}
        </div>
      </Dialog.Trigger>
      <Dialog.Content
        overlayClassName="bg-background brightness-100 data-[dialog-state=exit]:duration-300 data-[dialog-state=exit]:delay-300"
        className="grid place-items-center data-[dialog-state=animate]:delay-500 data-[dialog-state=animate]:duration-500 data-[dialog-state=exit]:duration-500"
      >
        {mediaType === 'image' && highResSource && (
          <Image
            width={2048}
            height={2048}
            src={highResSource}
            alt="image"
            className="object-contain w-full h-full"
          />
        )}

        {mediaType === 'video' && (
          <Video
            shouldMuteOnDialogClose
            className="w-full h-full"
            src={highResSource}
            width={width}
            height={height}
          />
        )}
      </Dialog.Content>
    </Dialog>
  )
}
