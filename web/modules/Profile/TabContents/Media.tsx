import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/router'
import React from 'react'

import { useDelayedInfiniteSWR } from '@/hooks'

import { LoadMore, TabLoader, Video } from '@/components/UI'

import { EmptyPlaceholder } from './EmptyPlaceholder'
import { useHasBlock } from './useHasBlock'

type Media = {
  id: string
  mediaType: 'video' | 'image'
  source: string
  highResSource: string
  width: number
  height: number
}

export function Media() {
  const pathname = usePathname()

  const username = pathname?.split('/')[1]

  const {
    data: medias,
    hasData,
    isLoading,
    isEmpty,
    isEnd,
    loadMore,
  } = useDelayedInfiniteSWR<Media[]>(`/profile/${username}/threads/media`, {
    duration: 300,
    swrInfiniteConfig: {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      revalidateFirstPage: false,
    },
  })

  return useHasBlock(() => (
    <div className="relative">
      <EmptyPlaceholder visible={isEmpty} />

      <MediaGrid medias={medias} />

      <LoadMore isEnd={isEnd} whenInView={loadMore} />

      <TabLoader visible={isLoading} overlayOnly={hasData} />
    </div>
  ))
}

function MediaGrid({ medias }: { medias?: Media[] }) {
  const pathname = usePathname()

  const username = pathname?.split('/')[1]

  const router = useRouter()

  if (!medias) return null
  return (
    <ul className="p-2 columns-2 gap-2 space-y-2">
      {medias?.map((media) => {
        const { mediaType, source, width, height } = media
        return (
          <li
            onClick={() => router.push(`/${username}/${media.id}`)}
            key={media.id}
            className="cursor-pointer relative rounded-lg overflow-hidden"
          >
            {mediaType === 'image' && (
              <Image
                className="w-full"
                src={source}
                alt="thread"
                width={width}
                height={height}
              />
            )}

            {mediaType === 'video' && (
              <Video
                className="w-full"
                src={source}
                width={width}
                height={height}
              />
            )}
          </li>
        )
      })}
    </ul>
  )
}
