import Link from 'next/link'

import { FollowedBy } from '@/components/Icons'
import { RegularButton, ThreadUserAvatar } from '@/components/UI'

import { getDescription } from '@/modules/Profile/Me'
import { useFollow } from '@/modules/Profile/Others/ProfileInformation/FollowButton'
import { FindUserResponse } from '@/pages/api/profile/[username]'

import { NotificationProps } from '.'

export function FollowNotification({
  notification,
  onClick,
}: NotificationProps) {
  const followedBy = notification.followedByNotification?.followedBy

  if (!followedBy) return null

  return (
    <div
      onClick={onClick}
      className="px-6 py-5 flex gap-3 border-b border-b-divider hover:bg-soft-black active:bg-soft-black cursor-pointer"
    >
      <div className="shrink-0 w-12 h-12 flex items-center justify-end">
        <FollowedBy />
      </div>

      <div className="mt-1">
        <Link
          onClick={(e) => {
            e.stopPropagation()
          }}
          href={`/${followedBy.username}`}
        >
          <ThreadUserAvatar
            medium
            style={{
              width: 40,
              height: 40,
            }}
            threadUser={{
              username: followedBy.username,
              avatarUrl: followedBy.avatarUrl,
            }}
          />
        </Link>

        <p className="mt-2 text-sm font-light">
          {followedBy.username} followed you
        </p>

        <p className="mt-0.5 text-sm font-light text-span">
          {getDescription(followedBy as FindUserResponse)}
        </p>
      </div>

      <div className="ml-auto flex items-center">
        <FollowButton user={followedBy as FindUserResponse} />
      </div>
    </div>
  )
}

function FollowButton({ user }: { user?: FindUserResponse }) {
  const { state, onClick } = useFollow(user)

  if (!user) return null

  const isFollowing = state.status

  return (
    <RegularButton
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className="h-fit"
      variant={isFollowing ? 'secondary' : 'primary'}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </RegularButton>
  )
}
