import { useRouter } from 'next/navigation'
import React from 'react'

import { useDelayedInfiniteSWR } from '@/hooks'

import { LoadMore, TabLoader, VirtualizedList } from '@/components/UI'

import { Thread } from '..'

import { ThreadItem } from '@/types'

export function HomeThreadListTemplate({ url }: { url: string }) {
  const router = useRouter()

  const {
    data: threadItems,
    hasData,
    isEnd,
    loadMore,
    isLoading,
  } = useDelayedInfiniteSWR<ThreadItem[]>(url, {
    duration: 300,
  })

  return (
    <div className="relative">
      <TabLoader visible={isLoading} overlayOnly={hasData} />

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
      <LoadMore isEnd={isEnd} whenInView={loadMore} />
    </div>
  )
}
