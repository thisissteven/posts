import React from 'react'

import { useButtonCount } from '@/modules/Thread'

import { LikersDialog, RepostersDialog } from './Dialog'

import { ThreadItem } from '@/types'

export function LikesAndRepostsCount({ thread }: { thread: ThreadItem }) {
  const { state: repostState } = useButtonCount({
    thread,
    countType: 'repost',
  })

  const { state: likeState } = useButtonCount({
    thread,
    countType: 'like',
  })

  const hasLikes = likeState.count > 0
  const hasReposts = repostState.count > 0

  if (!hasLikes && !hasReposts) return null

  return (
    <div className="mt-4 pt-4 border-t border-t-divider">
      <div className="text-sm text-span font-light">
        <LikersDialog likeState={likeState} thread={thread} />

        {hasLikes && hasReposts && ', '}

        <RepostersDialog repostState={repostState} thread={thread} />
      </div>
    </div>
  )
}
