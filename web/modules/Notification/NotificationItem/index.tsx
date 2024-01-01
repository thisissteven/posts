import { GetUserNotificationsResponse } from '@/pages/api/notifications/[id]'

export type NotificationProps = {
  notification: GetUserNotificationsResponse['data'][number]
  onClick: () => void
}
export * from './FollowNotification'
export * from './LikeNotification'
export * from './ReplyNotification'
export * from './RepostNotification'
