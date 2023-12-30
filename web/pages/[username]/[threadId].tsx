import clsx from 'clsx'
import Head from 'next/head'
import { useParams } from 'next/navigation'
import React from 'react'

import { useDelayedSWR } from '@/hooks'

import { Header } from '@/modules/Thread'
import { ThreadDetail } from '@/modules/ThreadDetail'

import { ThreadItem } from '@/types'

export default function ThreadPage() {
  const params = useParams()
  const username = params?.username
  const threadId = params?.threadId

  const { data, isLoading } = useDelayedSWR<ThreadItem>(
    `/thread/${username}/${threadId}`,
    {
      duration: 300,
    }
  )

  const pageTitle = `${data?.owner?.displayName} posted: ${data?.textContent}`

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Header />

      <div
        className={clsx(
          'duration-300 mt-1',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
      >
        {data && <ThreadDetail thread={data} />}
      </div>
    </>
  )
}
