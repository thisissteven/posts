import React from 'react'
import useSWRImmutable from 'swr/immutable'

import { apiClient } from '@/lib'
import { useDebouncedCallback, useUser } from '@/hooks'

import { RegularButton } from '@/components/UI'

import { FindUserResponse } from '@/pages/api/profile/[username]'

function useFollow(user?: FindUserResponse) {
  const { user: currentUser } = useUser()

  const { data, mutate } = useSWRImmutable(
    `/profile/${user?.id}/follow/${currentUser.username}`,
    () => {
      return {
        status: user?.followedBy?.some((value) => value?.id === currentUser.id),
      }
    }
  )

  const state = data ?? {
    status: false,
  }

  const debounce = useDebouncedCallback()

  const onClick = () => {
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
      className="px-4"
      variant={isFollowing ? 'secondary' : 'primary'}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </RegularButton>
  )
}
