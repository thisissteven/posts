import React from 'react'
import useSWRImmutable from 'swr/immutable'

import { useMutation, useUser } from '@/hooks'

import { RegularButton, SharedDialog } from '@/components/UI'

import { useDialogActions, useDialogArgs } from '@/store'

import { FindUserResponse } from '@/pages/api/profile/[username]'

export function BlockUserDialogContent() {
  const user = useDialogArgs() as FindUserResponse
  const { closeDialog } = useDialogActions()

  const { user: currentUser } = useUser()
  const { data: userData, mutate } = useSWRImmutable<FindUserResponse>(
    `/profile/${user?.username}`
  )

  const hasBlock = userData?.blockedBy?.some(
    (value) => value?.id === currentUser?.id
  )

  const { trigger, status } = useMutation(
    `/profile/${user?.id}/block?block=${hasBlock ? '0' : '1'}`
  )

  const title = hasBlock ? 'Unblock' : 'Block'

  return (
    <div className="bg-background px-6 py-4">
      <h2 className="mt-3 font-medium text-primary text-lg leading-6">
        {title} {user?.username}?
      </h2>

      <p className="mt-2 text-sm text-primary font-light leading-6">
        {user?.username} will {!hasBlock && 'not'} be able to send you messages
        or view your profile.
      </p>

      <div className="mt-2 flex justify-end gap-3">
        <SharedDialog.Trigger asChild>
          <RegularButton variant="underline">Cancel</RegularButton>
        </SharedDialog.Trigger>
        <RegularButton
          onClick={async () => {
            const response = await trigger()
            mutate(
              {
                ...userData,
                blockedBy: response.data?.blockedBy,
              } as FindUserResponse,
              {
                revalidate: false,
              }
            )

            closeDialog()
          }}
          isLoading={status.state === 'loading'}
          variant="secondary"
          loaderVariant="danger"
          className="text-danger disabled:bg-soft-background disabled:text-span"
        >
          {hasBlock ? 'Unblock' : 'Block'}
        </RegularButton>
      </div>
    </div>
  )
}
