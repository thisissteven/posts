import { useRouter } from 'next/navigation'
import React from 'react'

import { useDelayedSWR } from '@/hooks'

import { TabLoader } from '@/components/UI'

import { Thread } from '..'

import { ThreadItem } from '@/types'

export function Following() {
  const router = useRouter()

  const { data: threadItems, isLoading } =
    useDelayedSWR<ThreadItem[]>('/threads/following')

  return (
    <div className="relative">
      <TabLoader visible={isLoading} />
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
