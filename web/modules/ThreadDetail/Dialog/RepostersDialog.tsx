import React from 'react'
import useSWRImmutable from 'swr/immutable'

import { Dialog } from '@/components/UI'

import { ThreadItem } from '@/types'

export function RepostersDialog({
  repostState,
  thread,
}: {
  repostState: {
    status: boolean | undefined
    count: number
  }
  thread: ThreadItem
}) {
  const hasReposts = repostState.count > 0

  if (!hasReposts) return null
  return (
    <Dialog>
      <Dialog.Trigger asChild>
        <button className="hover:underline underline-offset-[3px]">
          {repostState.count} {repostState.count === 1 ? 'Repost' : 'Reposts'}
        </button>
      </Dialog.Trigger>
      <Dialog.Content className="max-w-[480px]">
        <RepostersDialogContent thread={thread} />
      </Dialog.Content>
    </Dialog>
  )
}

function RepostersDialogContent({ thread }: { thread: ThreadItem }) {
  const { data } = useSWRImmutable(
    `/thread/${thread.owner.username}/${thread.id}/reposts`
  )

  return null
}
