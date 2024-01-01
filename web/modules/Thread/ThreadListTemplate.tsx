import clsx from 'clsx'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

import { useDelayedInfiniteSWR, useMutation } from '@/hooks'

import { LoadMore, VirtualizedList } from '@/components/UI'

import { EmptyPlaceholder } from './EmptyPlaceholder'
import { Thread } from './Thread'

import { ThreadItem } from '@/types'

export function ThreadListTemplate({ url }: { url: string }) {
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

  const router = useRouter()

  return (
    <div className="relative">
      <EmptyPlaceholder visible={isEmpty} />

      <div
        className={clsx(
          'duration-300',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
      >
        <VirtualizedList data={threadItems}>
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
                  <ThreadDecider
                    thread={thread}
                    showRepost={showRepost}
                    router={router}
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

function ThreadDecider({
  thread,
  showRepost,
  router,
}: {
  thread: ThreadItem
  showRepost: boolean
  router: AppRouterInstance
}) {
  const hasReplyTo = Boolean(thread.replyTo)
  const hasReply = Boolean(thread.replies && thread.replies?.length > 0)

  if (hasReply && thread.replies?.[0] && !hasReplyTo) {
    const threadReply = thread.replies[0]
    return (
      <div>
        <Thread
          key={thread.id}
          onClick={() => router.push(`${thread.owner.username}/${thread.id}`)}
          thread={thread}
        />
        <Thread
          key={threadReply.id}
          onClick={() =>
            router.push(`${threadReply.owner.username}/${threadReply.id}`)
          }
          thread={threadReply}
          isReply
        />
      </div>
    )
  }

  return (
    <Thread
      showRepost={showRepost}
      key={thread.id}
      onClick={() => router.push(`${thread.owner.username}/${thread.id}`)}
      isOnlyThread
      thread={thread}
      hasReplyTo={hasReplyTo}
    />
  )
}
