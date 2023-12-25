import { Prisma } from '@prisma/client'
import { Session } from 'next-auth'

import { prisma } from '.'

export type Category =
  | 'media'
  | 'posts'
  | 'replies'
  | 'highlights'
  | 'following'
  | 'everyone'

export function getThreadIncludeParams(
  session: Session | null,
  category: Category
) {
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
          likes: !session
            ? false
            : {
                where: {
                  user: {
                    id: session?.user?.id,
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
          reposts: !session
            ? false
            : {
                where: {
                  user: {
                    id: session?.user?.id,
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

export function getReplyIncludeParams(
  session: Session | null,
  category: Category
) {
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
          likes: !session
            ? false
            : {
                where: {
                  user: {
                    id: session?.user?.id,
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
          reposts: !session
            ? false
            : {
                where: {
                  user: {
                    id: session?.user?.id,
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
  session,
  category,
  previousCursor,
  params,
}: {
  session: Session | null
  category: Category
  previousCursor: string
  params?: Prisma.ThreadFindManyArgs
}) {
  const skip = previousCursor ? 1 : 0
  const cursor = getCursor(previousCursor)

  const threads = await prisma.thread.findMany({
    ...params,
    ...getThreadIncludeParams(session, category),
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
  session,
  category,
  previousCursor,
  params,
}: {
  session: Session | null
  category: Category
  previousCursor: string
  params?: Prisma.ReplyFindManyArgs
}) {
  const skip = previousCursor ? 1 : 0
  const cursor = getCursor(previousCursor)

  const replies = await prisma.reply.findMany({
    ...params,
    ...getReplyIncludeParams(session, category),
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
