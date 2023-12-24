import { useRouter } from 'next/router'
import React from 'react'
import useSWR from 'swr'

import { useFakeLoading } from '@/hooks'

import { TabLoader } from '@/components/UI'

import { Thread } from '@/modules/Home'

import { EmptyPlaceholder } from './EmptyPlaceholder'

import { ThreadItem } from '@/types'

export function Replies() {
  const { data: threadItems, isValidating } =
    useSWR<ThreadItem[]>('/threads/replies')

  const isEmpty = threadItems?.length === 0
  const loading = useFakeLoading() || !threadItems || isValidating

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
