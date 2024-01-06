import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { useRouter } from 'next/navigation'
import React from 'react'

import { useDelayedInfiniteSWR, useMutation } from '@/hooks'

import { LoadMore, VirtualizedList } from '@/components/UI'

import { Thread } from '../Thread/Thread'

import { ThreadItem } from '@/types'

export function ThreadDetailListTemplate({
  threadId,
  threadLevel,
  url,
}: {
  threadId: string
  threadLevel: number
  url: string
}) {
  const {
    data: threadItems,
    isEnd,
    mutate,
    loadMore,
  } = useDelayedInfiniteSWR<ThreadItem[]>(url, {
    duration: 300,
    swrInfiniteConfig: {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  })

  const { status } = useMutation(`/reply/${threadLevel}/${threadId}`)

  React.useEffect(() => {
    if (status.state === 'success') {
      mutate()
    }
  }, [mutate, status, url])

  const router = useRouter()

  const listLength = React.useRef<number>()

  if (!listLength.current) {
    if (threadItems && threadItems.length > 0) {
      listLength.current = threadItems.length
    }
  }

  if (listLength.current && listLength.current < 5) {
    return (
      <div className="relative">
        {threadItems?.map((thread) => {
          return (
            <ThreadDecider key={thread.id} thread={thread} router={router} />
          )
        })}

        <LoadMore isEnd={isEnd} whenInView={loadMore} />
      </div>
    )
  }

  return (
    <div className="relative">
      <VirtualizedList data={threadItems}>
        {(items, virtualizer) => {
          if (!threadItems) return null

          return items.map((item) => {
            const thread = threadItems[item.index]

            return (
              <VirtualizedList.Item
                key={thread.id}
                virtualizer={virtualizer}
                item={item}
              >
                <ThreadDecider thread={thread} router={router} />
              </VirtualizedList.Item>
            )
          })
        }}
      </VirtualizedList>

      <LoadMore isEnd={isEnd} whenInView={loadMore} />
    </div>
  )
}

function ThreadDecider({
  thread,
  router,
}: {
  thread: ThreadItem
  router: AppRouterInstance
}) {
  const replyLength = thread.replies?.length ?? 0

  if (replyLength > 0) {
    return (
      <div className="flex flex-col">
        <Thread
          key={thread.id}
          onClick={() => router.push(`/${thread.owner.username}/${thread.id}`)}
          isOnlyThread={false}
          thread={thread}
          isReply={false}
          hasReplyTo={true}
        />
        {thread.replies?.map((reply, index) => {
          return (
            <Thread
              key={reply.id}
              onClick={() =>
                router.push(`/${reply.owner.username}/${reply.id}`)
              }
              thread={reply}
              isReply={true}
              hasReplyTo={index > 0}
              isOnlyThread={false}
              isThreadDetail={index !== replyLength - 1}
            />
          )
        })}
      </div>
    )
  }

  return (
    <Thread
      key={thread.id}
      onClick={() => router.push(`/${thread.owner.username}/${thread.id}`)}
      isOnlyThread
      thread={thread}
    />
  )
}
