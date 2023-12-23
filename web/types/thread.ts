export type ThreadOwner = {
  id: string
  username: string
  displayName: string
  isSupporter: boolean
  avatarUrl?: string
}

export type ThreadCount = {
  likes: number
  replies: number
  reposts: number
}

export type ThreadItem = {
  id: string
  createdAt: Date | string
  textContent?: string
  mediaType?: 'image' | 'video'
  source?: string
  highResSource?: string
  width?: number
  height?: number
  urlEmbed?: string
  owner: ThreadOwner
  _count: ThreadCount
}
