import React from 'react'
import useSWRImmutable from 'swr/immutable'

import { Dialog, Overlay, RegularButton } from '@/components/UI'

import { useButtonCount } from '@/modules/Thread'

import { UserListContent, UserListContentData } from './UserList'

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
      <Dialog.Content className="max-w-[540px]">
        <LikersDialogContent thread={thread} />
      </Dialog.Content>
    </Dialog>
  )
}

function LikersDialogContent({ thread }: { thread: ThreadItem }) {
  const { data, isLoading } = useSWRImmutable<UserListContentData>(
    `/thread/${thread.owner.username}/${thread.id}/likes`
  )

  const { state } = useButtonCount({
    thread,
    countType: 'like',
  })

  return (
    <div className="max-h-[1181px] max-w-[540px] h-[87vh] rounded-2xl">
      <div className="bg-background h-full w-full flex flex-col justify-between pb-4">
        <div className="px-8 pt-6 scrollbar overflow-y-auto">
          <h2 className="text-lg font-medium">Liked by</h2>
          <Overlay visible={isLoading} />
          {!!data && <UserListContent data={data} hasMe={!!state.status} />}
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
