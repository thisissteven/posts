import clsx from 'clsx'
import { useSession } from 'next-auth/react'
import React from 'react'
import useSWRImmutable from 'swr/immutable'

import { apiClient } from '@/lib'
import { useDebouncedCallback } from '@/hooks'

import { LikeActiveSmall, LikeSmall } from '@/components/Icons'

import { AuthButton } from '.'

import { ThreadItem } from '@/types'

export function LikeButton({ thread }: { thread: ThreadItem }) {
  const { data: session } = useSession()
  const { data, mutate } = useSWRImmutable(`/threads/${thread.id}/like`, () => {
    return {
      liked: thread.likes?.some(
        (value) => value?.user?.username === session?.user?.username
      ),
      count: thread.likeCount,
    }
  })

  React.useEffect(() => {
    mutate({
      liked: thread.likes?.some(
        (value) => value?.user?.username === session?.user?.username
      ),
      count: thread.likeCount,
    })
  }, [mutate, session?.user?.username, thread])

  const likeState = data ?? {
    liked: false,
    count: 0,
  }

  const threadId = thread.id

  const debounce = useDebouncedCallback()

  return (
    <AuthButton
      className="flex items-center gap-2 group w-full justify-center -translate-x-[calc(50%-18.5px)]"
      onClick={() => {
        const currentState = {
          liked: likeState.liked,
          count: likeState.count,
        }
        mutate(
          {
            liked: !likeState.liked,
            count: likeState.liked ? likeState.count - 1 : likeState.count + 1,
          },
          {
            revalidate: false,
          }
        )
        try {
          debounce(() => apiClient.put(`/threads/${threadId}/like`))()
        } catch (error) {
          mutate(currentState)
        }
      }}
    >
      <div className="group-active:scale-90">
        {likeState.liked ? <LikeActiveSmall /> : <LikeSmall />}
      </div>

      <span
        className={clsx(
          'text-xs font-light',
          likeState.count > 0 ? 'opacity-100' : 'opacity-0',
          likeState.liked ? 'text-danger-soft' : 'text-span'
        )}
      >
        {likeState.count}
      </span>
    </AuthButton>
  )
}
