import useSWRImmutable from 'swr/immutable'

import { useMutation, useUser } from '@/hooks'

import {
  Dialog,
  RegularButton,
  SharedDialog,
  ThreadUserAvatar,
} from '@/components/UI'

import { FindUserResponse } from '@/pages/api/profile/[username]'

import { SettingGroup } from './SettingGroup'

function UnblockButton({ userId }: { userId: string }) {
  const {
    user: { username },
  } = useUser()

  const { data: userData, mutate } = useSWRImmutable<FindUserResponse>(
    `/profile/${username}`
  )

  const { trigger, status } = useMutation(`/profile/${userId}/block?block=0`)

  return (
    <RegularButton
      isLoading={status.state === 'loading'}
      variant="secondary"
      onClick={async () => {
        await trigger()
        mutate(
          {
            ...userData,
            blocking: userData?.blocking?.filter(
              (value) => value?.id !== userId
            ),
          } as FindUserResponse,
          false
        )
      }}
    >
      Unblock
    </RegularButton>
  )
}

export function BlockedAccounts() {
  const {
    user: { username },
  } = useUser()
  const { data: userData } = useSWRImmutable<FindUserResponse>(
    `/profile/${username}`
  )

  const blockedUsers = userData?.blocking

  const subtitle = blockedUsers?.length
    ? `${blockedUsers?.length} blocked accounts`
    : 'No blocked accounts'

  return (
    <SettingGroup title="Blocked accounts" subtitle={subtitle}>
      <Dialog>
        <Dialog.Trigger asChild>
          <RegularButton
            disabled={blockedUsers?.length === 0}
            className="disabled:bg-soft-background disabled:opacity-60"
            variant="secondary"
            style={{ width: '104px' }}
          >
            See all
          </RegularButton>
        </Dialog.Trigger>
        <Dialog.Content className="max-h-[1181px] max-w-[540px] h-[87vh] rounded-2xl overflow-hidden">
          <div className="bg-background h-full w-full flex flex-col justify-between pt-6 pb-4">
            <div className="px-8">
              <h2 className="text-lg font-medium">Blocked accounts</h2>
              <ul className="space-y-4 mt-6">
                {blockedUsers?.map((user) => {
                  return (
                    <li
                      key={user.id}
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center gap-2">
                        <div className="scale-90 origin-left">
                          <ThreadUserAvatar
                            threadUser={{
                              avatarUrl: user.avatarUrl,
                              username: user.username!,
                            }}
                          />
                        </div>

                        <div className="text-sm font-light">
                          {user.displayName}
                        </div>
                      </div>

                      <UnblockButton userId={user.id} />
                    </li>
                  )
                })}
              </ul>
            </div>
            <div className="pt-4 mx-4 xs:mx-8 border-t border-divider flex justify-end">
              <SharedDialog.Close type="button" asChild>
                <RegularButton type="button" variant="secondary">
                  Done
                </RegularButton>
              </SharedDialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog>
    </SettingGroup>
  )
}
