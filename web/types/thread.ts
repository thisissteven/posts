export type ThreadOwner = {
  id: string
  username: string
  displayName: string
  isSupporter: boolean
  avatarUrl: string | null
  blockedBy?: {
    id: string
  }[]
}

export type ThreadItem = {
  id: string
  createdAt: Date | string
  textContent?: string
  mediaType?: 'image' | 'video'
  source?: string
  alt?: string
  highResSource?: string
  width?: number
  height?: number
  urlEmbed?: string
  owner: ThreadOwner
  repliesCount: number
  likeCount: number
  repostCount: number

  embed?: {
    url: string
    secureUrl: string
    title?: string
    description?: string
    image?: string
  }

  recipient?: {
    username: string
  }

  level: number

  replies?: ThreadItem[]

  replyTo?: ThreadItem | null

  replyToId?: string | null

  likes?: {
    user?: {
      username: string
    }
  }[]
  reposts?: {
    user?: {
      username: string
    }
  }[]
}

export type PaginatedThreadResponse = {
  data: ThreadItem[]
  cursor?: string | null
}
