import { useRouter } from 'next/navigation'
import React from 'react'

import { useDelayedSWR } from '@/hooks'

import { TabLoader, VirtualizedList } from '@/components/UI'

import { Thread } from '..'

import { ThreadItem } from '@/types'

export function Everyone() {
  const router = useRouter()

  const { data: threadItems, isLoading } =
    useDelayedSWR<ThreadItem[]>('/threads')

  // useLastSeenFeed(listRef, '/everyone')

  return (
    <div className="relative">
      <TabLoader visible={isLoading} />
      <VirtualizedList data={threadItems} estimateSize={() => 600}>
        {(items, virtualizer) => {
          if (!threadItems) return null

          return items.map((item) => {
            const thread = threadItems[item.index]
            return (
              <VirtualizedList.Item
                key={item.key}
                virtualizer={virtualizer}
                item={item}
              >
                <Thread
                  key={thread.id}
                  onClick={() =>
                    router.push(`${thread.owner.username}/${thread.id}`)
                  }
                  thread={thread}
                />
              </VirtualizedList.Item>
            )
          })
        }}
      </VirtualizedList>
    </div>
  )
}
