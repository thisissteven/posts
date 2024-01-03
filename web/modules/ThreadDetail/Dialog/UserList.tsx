import Image from 'next/image'

import { useUser } from '@/hooks'

import { DefaultProfileLarge } from '@/components/Icons'

import { FollowButton } from '@/modules/Profile/Me/ProfileInformation/SocialsDialog/FollowButton'
import { FindUserResponse } from '@/pages/api/profile/[username]'

export type UserListContentData = {
  user: {
    id: string
    username: string
    displayName: string
    avatarUrl?: string | null
  }
}[]

export function UserListContent({
  data,
  hasMe,
}: {
  data: UserListContentData
  hasMe: boolean
}) {
  const { user: currentUser } = useUser()

  const users = hasMe
    ? [
        {
          user: currentUser,
        },
        ...data,
      ]
    : data

  return (
    <div className="space-y-3 py-4">
      {users?.map((userItem) => {
        const user = {
          ...userItem.user,
          followedBy: [
            {
              id: currentUser.id,
            },
          ],
        } as NonNullable<FindUserResponse>
        return (
          <div
            key={user.id}
            className="flex items-center justify-between gap-5"
          >
            <div className="flex items-center gap-3">
              <div className="shrink-0 relative w-12 h-12 bg-black rounded-full overflow-hidden">
                {user.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    width={48}
                    height={48}
                    alt={userItem.user.username}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-background">
                    <DefaultProfileLarge />
                  </div>
                )}
              </div>
              <div>
                <a
                  href={`/${user.username}`}
                  target="_blank"
                  className="text-sm font-light tracking-wide hover:underline underline-offset-[3px] line-clamp-1"
                >
                  {user.displayName}
                </a>
                <a
                  href={`/${user.username}`}
                  target="_blank"
                  className="text-xs font-light tracking-wide text-span hover:underline underline-offset-[3px] line-clamp-1"
                >
                  @{user.username}
                </a>
              </div>
            </div>

            {user.username !== currentUser.username && (
              <div className="shrink-0">
                <FollowButton user={user} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
