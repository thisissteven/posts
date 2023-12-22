import Image from 'next/image'
import React from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

import { hasVideoGotAudio } from '@/lib'

import { Close, Muted, Unmuted } from '@/components/Icons'

export const MediaPreview = () => {
  const { control, setValue } = useFormContext()

  const input = useWatch({
    control,
    name: 'media',
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
          setValue('media', null)
        }}
        className="absolute active:bg-black/60 duration-200 left-0 top-0 mx-3 my-4 p-1.5 rounded-full bg-black/50"
      >
        <Close />
      </button>
    </div>
  )
}

const Media = React.memo(
  ({ src, type }: { src: string; type: 'video' | 'image' }) => {
    const [muted, setMuted] = React.useState(true)
    const [hasAudio, setHasAudio] = React.useState(false)

    React.useEffect(() => {
      if (type === 'video') {
        hasVideoGotAudio(src).then(setHasAudio)
      }
    }, [src, type])
    return (
      <div className="relative my-1 rounded-lg overflow-hidden">
        {type === 'video' && (
          <>
            <video
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
