import { useSession } from 'next-auth/react'
import React from 'react'
import useSWRImmutable from 'swr/immutable'

import { apiClient } from '@/lib'
import { useDebouncedCallback } from '@/hooks'

import { RegularButton } from '@/components/UI'

import { useAuth } from '@/modules/Auth'
import { FindUserResponse } from '@/pages/api/profile/[username]'

function useFollow(user?: FindUserResponse) {
  const { data: session } = useSession()
  const { openAuthDialog } = useAuth()

  const { data, mutate } = useSWRImmutable(
    `/profile/${user?.id}/follow`,
    () => {
      return {
        status: user?.followedBy?.some(
          (value) => value?.id === session?.user.id
        ),
      }
    }
  )

  React.useEffect(() => {
    mutate({
      status: user?.followedBy?.some((value) => value?.id === session?.user.id),
    })
  }, [mutate, session?.user.id, user])

  const state = data ?? {
    status: false,
  }

  const debounce = useDebouncedCallback()

  const onClick = () => {
    if (!session) {
      openAuthDialog()
      return
    }
    const currentState = {
      status: state.status,
    }
    mutate(
      {
        status: !state.status,
      },
      {
        revalidate: false,
      }
    )
    const follow = state.status ? '0' : '1'
    try {
      debounce(() =>
        apiClient.post(`/profile/${user?.id}/follow?follow=${follow}`)
      )()
    } catch (error) {
      mutate(currentState)
    }
  }

  return {
    state,
    onClick,
  }
}

export function FollowButton({ user }: { user?: FindUserResponse }) {
  const { state, onClick } = useFollow(user)

  if (!user) return null

  const isFollowing = state.status

  return (
    <RegularButton
      onClick={onClick}
      className="flex-1 rounded-full font-medium"
      variant={isFollowing ? 'secondary' : 'primary'}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </RegularButton>
  )
}
