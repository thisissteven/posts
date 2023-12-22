export const HOME_TABS = ['Highlights', 'Following', 'Everyone'] as const
export type HomeTab = (typeof HOME_TABS)[number]

export const NOTIFICATION_TABS = ['All', 'Mentions'] as const
export type NotificationTab = (typeof NOTIFICATION_TABS)[number]

export const PROFILE_TABS = ['Posts', 'Replies', 'Media'] as const
export type ProfileTab = (typeof PROFILE_TABS)[number]

export const SOCIAL_TABS = ['Following', 'Followers'] as const
export type SocialTab = (typeof SOCIAL_TABS)[number]
