import { usePathname } from 'next/navigation'
import { useRouter } from 'next/router'
import React from 'react'
import useSWR from 'swr'

import { useFakeLoading } from '@/hooks'

import { TabLoader } from '@/components/UI'

import { EmptyPlaceholder } from './EmptyPlaceholder'

type Media = {
  id: string
  mediaType: 'video' | 'image'
  source: string
  highResSource: string
  width: string
  height: string
}

export function Media() {
  const pathname = usePathname()

  const { data: medias, isValidating } = useSWR<Media[]>(
    pathname && `/threads/${pathname.replace('/', '')}/posts`
  )

  const isEmpty = medias?.length === 0
  const loading = useFakeLoading() || !medias || isValidating

  const router = useRouter()

  return (
    <div className="relative">
      <TabLoader visible={loading} />

      {isEmpty && <EmptyPlaceholder />}

      {medias?.map((media) => <div key={media.id}>hi</div>)}
    </div>
  )
}
