import * as React from 'react'
import useSWRImmutable from 'swr/immutable'

import { CHAT_EVENT, supabaseClient } from '@/lib'
import { useUser } from '@/hooks'

import { UserNotificationStatus } from '@/pages/api/notifications/status'

export function NotificationStatus() {
  const { data, mutate } = useSWRImmutable<UserNotificationStatus>(
    '/notifications/status'
  )

  const { user } = useUser()

  const isUnread = data?.status === 'UNREAD'

  React.useEffect(() => {
    const channel = supabaseClient.channel(user.id)

    function messageReceived() {
      if (data)
        mutate({
          ...data,
          status: 'UNREAD',
        })
    }

    const realtimeChannel = channel
      .on('broadcast', { event: CHAT_EVENT }, messageReceived)
      .subscribe()

    return () => {
      realtimeChannel.unsubscribe()
    }
  }, [data, mutate, user.id])

  if (isUnread) {
    return (
      <div className="absolute top-0 right-0 w-1 h-1 rounded-full bg-danger-soft"></div>
    )
  }

  return null
}
