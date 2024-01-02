import React from 'react'
import useSWRImmutable from 'swr/immutable'

import { Dialog } from '@/components/UI'

import { GetThreadLikesResponse } from '@/pages/api/thread/[username]/[threadId]/likes'

import { ThreadItem } from '@/types'

export function LikersDialog({
  likeState,
  thread,
}: {
  likeState: {
    status: boolean | undefined
    count: number
  }
  thread: ThreadItem
}) {
  const hasLikes = likeState.count > 0

  if (!hasLikes) return null

  return (
    <Dialog>
      <Dialog.Trigger asChild>
        <button className="hover:underline underline-offset-[3px]">
          {likeState.count} {likeState.count === 1 ? 'Like' : 'Likes'}
        </button>
      </Dialog.Trigger>
      <Dialog.Content className="max-w-[480px]">
        <LikersDialogContent thread={thread} />
      </Dialog.Content>
    </Dialog>
  )
}

function LikersDialogContent({ thread }: { thread: ThreadItem }) {
  const { data } = useSWRImmutable<GetThreadLikesResponse>(
    `/thread/${thread.owner.username}/${thread.id}/likes`
  )

  return null
}
