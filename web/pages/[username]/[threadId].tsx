import clsx from 'clsx'
import Head from 'next/head'
import { useParams } from 'next/navigation'
import React from 'react'

import { useDelayedSWR } from '@/hooks'

import { Header } from '@/modules/Thread'
import { ThreadDetail } from '@/modules/ThreadDetail'

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
      className={clsx(
        'duration-300 mt-1',
        isLoading ? 'opacity-0' : 'opacity-100'
      )}
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
    }
  )

  const thread = data?.thread

  const pageTitle = data
    ? `${thread?.owner?.displayName} posted: ${thread?.textContent}`
    : 'Posts'

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Header />
      {withLoader({ isLoading, data: data?.thread }, (thread) => (
        <>
          <ThreadDetail thread={thread} />
          {/* <ThreadDetailListTemplate
            threadId={thread.id}
            threadLevel={thread.level}
            url="/threads"
          /> */}
        </>
      ))}
    </>
  )
}
