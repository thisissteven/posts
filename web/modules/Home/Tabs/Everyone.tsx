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

  const isLoading = loading || !threadItems

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
