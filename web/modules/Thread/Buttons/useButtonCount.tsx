import React from 'react'
import useSWRImmutable from 'swr/immutable'

import { apiClient } from '@/lib'
import { useDebouncedCallback, useUser } from '@/hooks'

import { ThreadItem } from '@/types'

type CountType = 'like' | 'repost'

function getCountKey(countType: CountType) {
  switch (countType) {
    case 'like':
      return {
        count: 'likeCount',
        type: 'likes',
      } as const
    case 'repost':
      return {
        count: 'repostCount',
        type: 'reposts',
      } as const
  }
}

export function useButtonCount({
  thread,
  countType,
}: {
  thread: ThreadItem
  countType: CountType
}) {
  const countKey = React.useMemo(() => getCountKey(countType), [countType])

  const {
    user: { username },
  } = useUser()

  const { data, mutate } = useSWRImmutable(
    `/threads/${thread.id}/${countType}/${username}`,
    () => {
      return {
        status: thread[countKey.type]?.some(
          (value) => value?.user?.username === username
        ),
        count: thread[countKey.count],
      }
    }
  )

  const state = data ?? {
    status: false,
    count: 0,
  }

  const threadId = thread.id

  const debounce = useDebouncedCallback()

  const onClick = () => {
    const currentState = {
      status: state.status,
      count: state.count,
    }
    mutate(
      {
        status: !state.status,
        count: state.status ? state.count - 1 : state.count + 1,
      },
      {
        revalidate: false,
      }
    )
    try {
      debounce(() =>
        apiClient.put(`/threads/${threadId}/${thread.owner.id}/${countType}`)
      )()
    } catch (error) {
      mutate(currentState, {
        revalidate: false,
      })
    }
  }

  return {
    state,
    onClick,
  }
}
