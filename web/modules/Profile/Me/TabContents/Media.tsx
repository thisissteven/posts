import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/router'
import React from 'react'
import useSWR from 'swr'

import { useFakeLoading } from '@/hooks'

import { TabLoader, Video } from '@/components/UI'

import { EmptyPlaceholder } from './EmptyPlaceholder'

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

  const { data: medias, isLoading } = useSWR<Media[]>(
    pathname && `/threads/${username}/posts`
  )

  const isEmpty = medias?.length === 0
  const loading = useFakeLoading() || !medias || isLoading

  const router = useRouter()

  return (
    <div className="relative">
      <TabLoader visible={loading} />

      {isEmpty && <EmptyPlaceholder />}

      <ul className="p-2 columns-2 gap-2 space-y-2">
        {medias?.map((media) => {
          const { mediaType, source, width, height } = media
          return (
            <li
              onClick={() => router.push(`/${username}/${media.id}`)}
              key={media.id}
              className="cursor-pointer bg-soft-background relative rounded-lg overflow-hidden"
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
                  shouldMuteOnDialogOpen
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
    </div>
  )
}
