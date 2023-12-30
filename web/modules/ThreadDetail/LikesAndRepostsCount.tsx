import React from 'react'

import { useButtonCount } from '@/modules/Thread'

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
        {hasLikes && (
          <button className="hover:underline underline-offset-[3px]">
            {likeState.count} {likeState.count === 1 ? 'Like' : 'Likes'}
          </button>
        )}
        {hasLikes && hasReposts && ', '}
        {hasReposts && (
          <button className="hover:underline underline-offset-[3px]">
            {repostState.count} {repostState.count === 1 ? 'Repost' : 'Reposts'}
          </button>
        )}
      </div>
    </div>
  )
}
