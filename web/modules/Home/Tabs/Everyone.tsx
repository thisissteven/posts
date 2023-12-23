import { useRouter } from 'next/navigation'
import React from 'react'
import useSWR from 'swr'

import { useFakeLoading } from '@/hooks'

import { TabLoader } from '@/components/UI'

import { Thread } from '..'

import { ThreadItem } from '@/types'

export function Everyone() {
  const loading = useFakeLoading(300)

  const router = useRouter()

  const { data: threadItems } = useSWR<ThreadItem[]>('/threads')

  return (
    <div className="relative">
      <TabLoader visible={loading} />
      <div className="divide-y divide-divider">
        {threadItems?.map((thread, i) => (
          <Thread
            key={i}
            onClick={() => router.push(`${thread.owner.username}/${thread.id}`)}
            thread={thread}
          />
        ))}
      </div>
    </div>
  )
}
