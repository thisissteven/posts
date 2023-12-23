import clsx from 'clsx'
import React from 'react'
import useSWRImmutable from 'swr/immutable'

import { apiClient } from '@/lib'
import { useDebouncedCallback } from '@/hooks'

import { RepostSmall, RepostSmallActive } from '@/components/Icons'

import { AuthButton } from '.'

import { ThreadItem } from '@/types'

export function RepostButton({ thread }: { thread: ThreadItem }) {
  const { data, mutate } = useSWRImmutable(
    `/threads/${thread.id}/repost`,
    () => {
      return {
        reposted: thread.reposts.length > 0,
        count: thread.repostCount,
      }
    }
  )

  const repostState = data ?? {
    reposted: false,
    count: 0,
  }

  const threadId = thread.id

  const debounce = useDebouncedCallback()

  return (
    <AuthButton
      className="flex items-center gap-2 group w-full justify-center -translate-x-[calc(50%-18.5px)]"
      onClick={() => {
        const currentState = {
          reposted: repostState.reposted,
          count: repostState.count,
        }
        mutate(
          {
            reposted: !repostState.reposted,
            count: repostState.reposted
              ? repostState.count - 1
              : repostState.count + 1,
          },
          {
            revalidate: false,
          }
        )
        try {
          debounce(() => apiClient.put(`/threads/${threadId}/repost`))()
        } catch (error) {
          mutate(currentState)
        }
      }}
    >
      <div className="group-active:scale-90">
        {repostState.reposted ? <RepostSmallActive /> : <RepostSmall />}
      </div>

      <span
        aria-hidden={!repostState.reposted}
        className={clsx(
          'text-xs font-light duration-75',
          repostState.count > 0 ? 'opacity-100' : 'opacity-0',
          repostState.reposted ? 'text-success' : 'text-span'
        )}
      >
        {repostState.count}
      </span>
    </AuthButton>
  )
}
