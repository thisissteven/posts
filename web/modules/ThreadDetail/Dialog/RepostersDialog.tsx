import React from 'react'
import useSWRImmutable from 'swr/immutable'

import { Dialog, Overlay, RegularButton } from '@/components/UI'

import { useButtonCount } from '@/modules/Thread'

import { UserListContent, UserListContentData } from './UserList'

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
      <Dialog.Content className="max-w-[540px] rounded-2xl">
        <RepostersDialogContent thread={thread} />
      </Dialog.Content>
    </Dialog>
  )
}

function RepostersDialogContent({ thread }: { thread: ThreadItem }) {
  const { data, isLoading } = useSWRImmutable<UserListContentData>(
    `/thread/${thread.owner.username}/${thread.id}/reposts`
  )

  const { state } = useButtonCount({
    thread,
    countType: 'repost',
  })

  return (
    <div className="max-h-[1181px] max-w-[540px] h-[87vh] rounded-2xl">
      <div className="bg-background h-full w-full flex flex-col justify-between pb-4">
        <div className="px-8 pt-6 scrollbar overflow-y-auto">
          <h2 className="text-lg font-medium">Reposted by</h2>
          <div className="relative">
            <Overlay visible={isLoading} />
            {!!data && <UserListContent data={data} hasMe={!!state.status} />}
          </div>
        </div>
        <div className="pt-4 mx-4 xs:mx-8 border-t border-divider flex justify-end">
          <Dialog.Close type="button" asChild>
            <RegularButton type="button" variant="secondary">
              Done
            </RegularButton>
          </Dialog.Close>
        </div>
      </div>
    </div>
  )
}
