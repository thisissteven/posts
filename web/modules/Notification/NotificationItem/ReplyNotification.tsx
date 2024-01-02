import { Thread } from '@/modules/Thread/Thread'

import { NotificationProps } from '.'

import { ThreadItem } from '@/types'

export function ReplyNotification({
  notification,
  onClick,
}: NotificationProps) {
  if (!notification.repliedByNotification) return null

  const thread = notification.thread

  return (
    <Thread
      onClick={onClick}
      thread={thread as unknown as ThreadItem}
      hasReplyTo={false}
      isReply={false}
      isOnlyThread={true}
    />
  )
}
