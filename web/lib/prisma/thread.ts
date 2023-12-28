import { Prisma } from '@prisma/client'

import { prisma } from '.'
import { CurrentUser } from '..'

export type Category =
  | 'media'
  | 'posts'
  | 'replies'
  | 'highlights'
  | 'following'
  | 'everyone'

export function getThreadIncludeParams(
  user: CurrentUser,
  category: Category
): Prisma.ThreadFindManyArgs | undefined {
  switch (category) {
    case 'posts':
    case 'replies':
    case 'highlights':
    case 'following':
    case 'everyone':
    case undefined:
      return {
        include: {
          owner: {
            select: {
              id: true,
              avatarUrl: true,
              isSupporter: true,
              username: true,
              displayName: true,
              blockedBy: !user
                ? false
                : {
                    where: {
                      id: user.id,
                    },
                    select: {
                      id: true,
                    },
                  },
            },
          },
          likes: !user
            ? false
            : {
                where: {
                  user: {
                    id: user.id,
                  },
                },
                select: {
                  user: {
                    select: {
                      username: true,
                    },
                  },
                },
              },
          reposts: !user
            ? false
            : {
                where: {
                  user: {
                    id: user.id,
                  },
                },
                select: {
                  user: {
                    select: {
                      username: true,
                    },
                  },
                },
              },
        },
      }
    default:
      return undefined
  }
}

export function getReplyIncludeParams(user: CurrentUser, category: Category) {
  switch (category) {
    case 'posts':
    case 'replies':
    case 'highlights':
    case 'following':
    case 'everyone':
      return {
        include: {
          owner: {
            select: {
              id: true,
              avatarUrl: true,
              isSupporter: true,
              username: true,
              displayName: true,
            },
          },
          parent: {
            select: {
              owner: {
                select: {
                  username: true,
                },
              },
            },
          },
          likes: !user
            ? false
            : {
                where: {
                  user: {
                    id: user.id,
                  },
                },
                select: {
                  user: {
                    select: {
                      username: true,
                    },
                  },
                },
              },
          reposts: !user
            ? false
            : {
                where: {
                  user: {
                    id: user.id,
                  },
                },
                select: {
                  user: {
                    select: {
                      username: true,
                    },
                  },
                },
              },
        },
      }
    default:
      return undefined
  }
}

export function getCursor(previousCursor?: string | null) {
  const cursor = previousCursor
    ? {
        id: previousCursor,
      }
    : undefined

  return cursor
}

const TAKE = 10

export async function getPaginatedThreads({
  currentUser,
  category,
  previousCursor,
  params,
}: {
  currentUser: CurrentUser
  category: Category
  previousCursor: string
  params?: Prisma.ThreadFindManyArgs
}) {
  const skip = previousCursor ? 1 : 0
  const cursor = getCursor(previousCursor)

  const threads = await prisma.thread.findMany({
    ...params,
    ...getThreadIncludeParams(currentUser, category),
    skip,
    cursor,
    take: TAKE,
    orderBy: {
      createdAt: 'desc',
    },
  })

  const lastThread = threads.length === TAKE ? threads[TAKE - 1] : null
  const lastCursor = lastThread ? lastThread.id : null

  return {
    data: threads,
    cursor: lastCursor,
  }
}

export async function getPaginatedThreadReplies({
  currentUser,
  category,
  previousCursor,
  params,
}: {
  currentUser: CurrentUser
  category: Category
  previousCursor: string
  params?: Prisma.ReplyFindManyArgs
}) {
  const skip = previousCursor ? 1 : 0
  const cursor = getCursor(previousCursor)

  const replies = await prisma.reply.findMany({
    ...params,
    ...getReplyIncludeParams(currentUser, category),
    skip,
    cursor,
    take: TAKE,
    orderBy: {
      createdAt: 'desc',
    },
  })

  const lastReply = replies.length === TAKE ? replies[TAKE - 1] : null
  const lastCursor = lastReply ? lastReply.id : null

  return {
    data: replies,
    cursor: lastCursor,
  }
}
