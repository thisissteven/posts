export type ThreadUser = {
  username: string
  displayName: string
  isSupporter: boolean
  avatarUrl: string
}

export type ThreadContent = {
  textContent: string
  mediaType: 'image' | 'video'
  mediaSource: string
  highResMediaSource: string
}

export type ThreadItem = {
  id: string
  threadUser: ThreadUser
  lastActivity: Date | string
  isOwnThread: boolean
  threadContent: ThreadContent
  likesCount: number
  repostsCount: number
  repliesCount: number
  reply?: Omit<ThreadItem, 'reply'> | null
}
