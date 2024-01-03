import clsx from 'clsx'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'

import { useDelayedSWR } from '@/hooks'

import { Seo } from '@/components/Seo'

import { Header } from '@/modules/Thread'
import { Thread } from '@/modules/Thread/Thread'
import { ThreadDetail, ThreadDetailListTemplate } from '@/modules/ThreadDetail'

import { ThreadItem } from '@/types'

function withLoader<T>(
  response: {
    data: T | undefined
    isLoading: boolean
  },
  renderChild: (data: T) => React.ReactNode
) {
  const { data, isLoading } = response

  return (
    <div
      className={clsx('duration-300', isLoading ? 'opacity-0' : 'opacity-100')}
    >
      {!!data && renderChild(data)}
    </div>
  )
}

type ThreadResponse = {
  thread: ThreadItem
  parentThread: ThreadItem | null
}

export default function ThreadPage() {
  const params = useParams()
  const username = params?.username
  const threadId = params?.threadId

  const { data, isLoading } = useDelayedSWR<ThreadResponse>(
    `/thread/${username}/${threadId}`,
    {
      duration: 300,
      swrConfig: {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale: false,
      },
    }
  )

  const thread = data?.thread

  const pageTitle = data
    ? `${thread?.owner?.displayName} posted: ${thread?.textContent}`
    : 'Posts'

  const router = useRouter()

  return (
    <>
      <Seo title={pageTitle} />
      <Header />
      {withLoader({ isLoading, data: data }, ({ thread, parentThread }) => {
        if (!thread) return null

        return (
          <div className="min-h-screen pb-16">
            <div className="flex flex-col">
              {getParentThreads(parentThread).map((thread, index) => (
                <Thread
                  key={thread.id}
                  onClick={() =>
                    router.push(`/${thread.owner.username}/${thread.id}`)
                  }
                  thread={thread}
                  isReply={index > 0}
                  hasReplyTo={index > 0}
                  isOnlyThread={false}
                  isThreadDetail={true}
                  isRootThread={index === 0}
                />
              ))}
            </div>
            <ThreadDetail thread={thread} />
            <ThreadDetailListTemplate
              threadId={thread.id}
              threadLevel={thread.level}
              url={`/thread/${thread.owner.username}/${thread.id}/replies`}
            />
          </div>
        )
      })}
    </>
  )
}

function getParentThreads(thread: ThreadItem | null) {
  if (!thread) return []

  const parentThreads = []

  let parent = thread.replyTo

  while (parent) {
    parentThreads.push(parent)
    parent = parent.replyTo
  }

  return [thread, ...parentThreads].reverse()
}
