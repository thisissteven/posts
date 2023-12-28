import clsx from 'clsx'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

import { useDelayedInfiniteSWR, useMutation } from '@/hooks'

import { LoadMore, VirtualizedList } from '@/components/UI'

import { Thread } from '@/modules/Home'

import { EmptyPlaceholder } from './EmptyPlaceholder'

import { ThreadItem } from '@/types'

export function ThreadListTemplate({ url }: { url: string }) {
  const router = useRouter()

  const {
    data: threadItems,
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

  const pathname = usePathname()
  const username = pathname?.split('/')[1]
  const showRepost =
    url === `/profile/${username}/threads` || url.includes('following')

  return (
    <div className="relative">
      <EmptyPlaceholder visible={isEmpty} />

      <div
        className={clsx(
          'duration-300',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
      >
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
                    showRepost={showRepost}
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
