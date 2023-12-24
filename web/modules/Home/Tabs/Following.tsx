import { useRouter } from 'next/navigation'
import React from 'react'
import useSWR from 'swr'

import { useFakeLoading } from '@/hooks'

import { TabLoader } from '@/components/UI'

import { Thread } from '..'

import { ThreadItem } from '@/types'

export function Following() {
  const router = useRouter()

  const { data: threadItems, isLoading } =
    useSWR<ThreadItem[]>('/threads/following')

  const loading = useFakeLoading() || !threadItems || isLoading

  return (
    <div className="relative">
      <TabLoader visible={loading} />
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
