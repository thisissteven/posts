import { GetUserNotificationsResponse } from '@/pages/api/notifications'

export type NotificationProps = {
  notification: GetUserNotificationsResponse[number]
  onClick: () => void
}
export * from './FollowNotification'
export * from './LikeNotification'
export * from './ReplyNotification'
export * from './RepostNotification'
