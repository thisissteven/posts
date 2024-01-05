import clsx from 'clsx'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'

import { useDelayedInfiniteSWR, useDelayedSWR } from '@/hooks'

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
    username && threadId ? `/thread/${username}/${threadId}` : null,
    {
      duration: 300,
      swrConfig: {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale: false,
      },
    }
  )

  const { data: threadReplies } = useDelayedInfiniteSWR<ThreadItem[]>(
    data
      ? `/thread/${data.thread.owner.username}/${data.thread.id}/replies`
      : null,
    {
      duration: 300,
      swrInfiniteConfig: {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
      },
    }
  )

  const thread = data?.thread

  const pageTitle = data
    ? `${thread?.owner?.displayName} posted: ${thread?.textContent}`
    : 'Posts'

  const [scrollbarReady, setScrollbarReady] = React.useState(false)

  return (
    <>
      <Seo title={pageTitle} />
      <Header />
      {withLoader(
        { isLoading: isLoading || !threadReplies, data: data },
        ({ thread, parentThread }) => {
          if (!thread) return null

          return (
            <div className="min-h-[200vh] pb-16 mt-1">
              <MainThread
                onScrollFinish={() => setScrollbarReady(true)}
                thread={thread}
                parentThread={parentThread}
              />
              {scrollbarReady && (
                <ThreadDetailListTemplate
                  threadId={thread.id}
                  threadLevel={thread.level}
                  url={`/thread/${thread.owner.username}/${thread.id}/replies`}
                />
              )}
            </div>
          )
        }
      )}
    </>
  )
}

const MainThread = React.memo(function MainThread({
  thread,
  parentThread,
  onScrollFinish,
}: {
  thread: ThreadItem
  parentThread: ThreadItem | null
  onScrollFinish: () => void
}) {
  const router = useRouter()

  const ref = React.useRef<HTMLDivElement>(null)

  const hasAlreadyScrolled = React.useRef(false)

  React.useEffect(() => {
    if (parentThread && !hasAlreadyScrolled.current) {
      ref.current?.scrollIntoView()
      onScrollFinish()
    } else {
      onScrollFinish()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentThread])

  return (
    <>
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
      <div ref={ref} className="scroll-mt-[60px]">
        <ThreadDetail thread={thread} />
      </div>
    </>
  )
})

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
