import React from 'react'
import useSWRImmutable from 'swr/immutable'

import { apiClient, getTimeAgo } from '@/lib'
import { useMutation, useUser } from '@/hooks'

import { Input, RegularButton } from '@/components/UI'

import { useAuth } from '@/modules/Auth'
import { FindUserResponse } from '@/pages/api/profile/[username]'

import { SettingGroup } from './SettingGroup'

function DeleteAccountContent({ toggleDelete }: { toggleDelete: () => void }) {
  const [username, setUsername] = React.useState('')

  const { signOut } = useAuth()

  const { user } = useUser()

  const { trigger, status } = useMutation('/user', async (url) => {
    const { data } = await apiClient.delete(url)
    return data
  })

  return (
    <div className="border-t border-t-divider pt-5 mt-5">
      <p className="text-sm text-soft-primary">
        Deleting your account cannot be undone, your data will be permanently
        erased. To continue type your username.
      </p>
      <Input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="mt-3"
        placeholder="Your username"
      />

      <div className="flex items-center justify-end gap-4 mt-4">
        <RegularButton variant="underline" onClick={toggleDelete}>
          Cancel
        </RegularButton>
        <RegularButton
          disabled={username !== user.username}
          isLoading={status.state === 'loading'}
          variant="secondary"
          className="text-danger disabled:bg-soft-background disabled:opacity-60"
          loaderVariant="danger"
          onClick={async () => {
            await trigger()
            signOut()
          }}
        >
          Delete Account
        </RegularButton>
      </div>
    </div>
  )
}

export function DeleteAccount() {
  const {
    user: { username },
  } = useUser()
  const { data: user } = useSWRImmutable<FindUserResponse>(
    `/profile/${username}`
  )

  const createdAt = new Date(user?.createdAt ?? 0)

  const [deleteMode, toggleDeleteMode] = React.useReducer(
    (state) => !state,
    false
  )

  if (deleteMode) {
    return <DeleteAccountContent toggleDelete={toggleDeleteMode} />
  }

  return (
    <SettingGroup
      title="Account"
      subtitle={`Joined ${getTimeAgo(createdAt)} ago`}
    >
      <RegularButton
        className="text-danger"
        variant="secondary"
        loaderVariant="danger"
        style={{ width: '104px' }}
        onClick={toggleDeleteMode}
      >
        Delete
      </RegularButton>
    </SettingGroup>
  )
}
