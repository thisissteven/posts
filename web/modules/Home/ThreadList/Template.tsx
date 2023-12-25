import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import React from 'react'

import { useDelayedInfiniteSWR, useMutation } from '@/hooks'

import { LoadMore, TabLoader, VirtualizedList } from '@/components/UI'

import { Thread } from '@/modules/Home'
import { EmptyPlaceholder } from '@/modules/Profile/Me/TabContents/EmptyPlaceholder'

import { ThreadItem } from '@/types'

export function HomeThreadListTemplate({ url }: { url: string }) {
  const router = useRouter()

  const {
    data: threadItems,
    hasData,
    isEnd,
    isEmpty,
    mutate,
    loadMore,
    isLoading,
  } = useDelayedInfiniteSWR<ThreadItem[]>(url, {
    duration: 300,
  })

  const { status } = useMutation('/threads')

  React.useEffect(() => {
    if (status.state === 'success' && url === '/threads') {
      mutate()
    }
  }, [mutate, status, url])

  return (
    <div className="relative">
      <TabLoader visible={isLoading} overlayOnly={hasData} />

      <EmptyPlaceholder visible={isEmpty} />

      <div className={clsx(isLoading ? 'opacity-0' : 'opacity-100')}>
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

      <LoadMore isEnd={isEnd} whenInView={loadMore} />
    </div>
  )
}
