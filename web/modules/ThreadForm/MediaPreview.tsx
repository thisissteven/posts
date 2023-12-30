import Image from 'next/image'
import React from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

import { useHasAudio } from '@/hooks/useHasAudio'

import { Close, Muted, Unmuted } from '@/components/Icons'
import { Popover } from '@/components/UI'

import { DescriptiveText } from './DescriptiveText'
import { NewThreadFormValues } from './Form'

export const MediaPreview = () => {
  const { control, setValue } = useFormContext<NewThreadFormValues>()

  const input = useWatch({
    control,
    name: 'source',
  })

  const hasMedia = Boolean(input && input.length > 0)
  const mediaUrl = React.useMemo(
    () => input && URL.createObjectURL(input[0]),
    [input]
  )

  if (!hasMedia) return null

  const mediaType = input && input[0]?.type.split('/')[0]

  return (
    <div className="relative">
      <Media src={mediaUrl} type={mediaType} />

      <button
        type="button"
        onClick={() => {
          setValue('source', null)
        }}
        className="absolute active:bg-black/60 duration-200 left-0 top-0 mx-3 my-4 p-1.5 rounded-full bg-black/50"
      >
        <Close />
      </button>
      {mediaType === 'image' && (
        <Popover>
          <Popover.Trigger asChild>
            <button
              onClick={(e) => {
                e.stopPropagation()
              }}
              className="absolute active:bg-black/60 duration-200 right-0 top-0 mx-3 my-4 w-7 h-7 rounded-full bg-black/50 text-[10px]"
            >
              ALT
            </button>
          </Popover.Trigger>
          <Popover.Content
            sideOffset={8}
            align="center"
            customContent
            className="w-[calc(100vw-1rem)] xs:w-[320px]"
          >
            <DescriptiveText />
          </Popover.Content>
        </Popover>
      )}
    </div>
  )
}

const Media = React.memo(
  ({ src, type }: { src: string; type: 'video' | 'image' }) => {
    const { muted, setMuted, hasAudio, videoRef } = useHasAudio()
    return (
      <div className="relative my-1 rounded-lg overflow-hidden">
        {type === 'video' && (
          <>
            <video
              ref={videoRef}
              src={src}
              className="object-cover w-full h-full"
              autoPlay
              playsInline
              muted={muted}
              loop
            />
            <button
              type="button"
              disabled={!hasAudio}
              onClick={() => setMuted((prev) => !prev)}
              className="absolute disabled:opacity-80 disabled:active:bg-black/50 active:bg-black/60 duration-200 bottom-0 right-0 mx-3 my-4 p-0.5 rounded-full bg-black/50"
            >
              {muted ? <Muted /> : <Unmuted />}
            </button>
          </>
        )}

        {type === 'image' && (
          <Image
            src={src}
            width={300}
            height={200}
            alt="image"
            className="object-cover w-full h-full"
          />
        )}
      </div>
    )
  },
  (prevProps, nextProps) =>
    prevProps.src === nextProps.src && prevProps.type === nextProps.type
)
