import { useRouter } from 'next/navigation'
import React from 'react'

import { useDelayedSWR } from '@/hooks'

import { TabLoader } from '@/components/UI'

import { Thread } from '@/modules/Home'

import { ThreadItem } from '@/types'

export function Highlights() {
  const router = useRouter()

  const { data: threadItems, isLoading } = useDelayedSWR<ThreadItem[]>(
    '/threads/highlights'
  )

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
