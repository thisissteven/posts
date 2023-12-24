import { usePathname } from 'next/navigation'
import { useRouter } from 'next/router'
import React from 'react'

import { useDelayedSWR } from '@/hooks'

import { TabLoader } from '@/components/UI'

import { Thread } from '@/modules/Home'

import { EmptyPlaceholder } from './EmptyPlaceholder'
import { ErrorPlaceholder } from './ErrorPlaceholder'

import { ThreadItem } from '@/types'

export function Replies() {
  const pathname = usePathname()

  const username = pathname?.split('/')[1]

  const {
    data: threadItems,
    hasData,
    isLoading,
    isEmpty,
    isError,
  } = useDelayedSWR<ThreadItem[]>(`/threads/${username}/replies`)

  const router = useRouter()

  return (
    <div className="relative">
      <TabLoader visible={isLoading} overlayOnly={hasData} />

      <EmptyPlaceholder visible={isEmpty} />
      <ErrorPlaceholder visible={isError} />

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
