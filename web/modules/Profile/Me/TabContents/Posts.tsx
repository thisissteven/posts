import { usePathname } from 'next/navigation'
import { useRouter } from 'next/router'
import React from 'react'
import useSWR from 'swr'

import { useFakeLoading } from '@/hooks'

import { TabLoader } from '@/components/UI'

import { Thread } from '@/modules/Home'

import { EmptyPlaceholder } from './EmptyPlaceholder'

import { ThreadItem } from '@/types'

export function Posts() {
  const pathname = usePathname()

  const { data: threadItems, isLoading } = useSWR<ThreadItem[]>(
    pathname && `/threads/${pathname.replace('/', '')}/posts`
  )

  const isEmpty = threadItems?.length === 0
  const loading = useFakeLoading() || !threadItems || isLoading

  const router = useRouter()

  return (
    <div className="relative">
      <TabLoader visible={loading} />

      {isEmpty && <EmptyPlaceholder />}

      {threadItems?.map((thread) => (
        <Thread
          key={thread.id}
          onClick={() => router.push(`${thread.owner.username}/${thread.id}`)}
          thread={thread}
        />
      ))}
    </div>
  )
}
