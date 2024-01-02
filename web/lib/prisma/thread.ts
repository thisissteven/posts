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

export function getThreadBaseIncludeParams(user: CurrentUser) {
  return {
    embed: {
      select: {
        url: true,
        secureUrl: true,
        title: true,
        description: true,
        image: true,
      },
    },
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
  } satisfies Prisma.ThreadFindManyArgs['include']
}

export function getThreadIncludeParams(user: CurrentUser, category: Category) {
  switch (category) {
    case 'posts':
    case 'replies':
    case 'following':
    case 'everyone':
    case undefined:
      return {
        include: {
          replies: {
            take: 1,
            orderBy: {
              createdAt: 'desc',
            },
            include: {
              replyTo: {
                select: {
                  owner: {
                    select: {
                      username: true,
                    },
                  },
                },
              },
              ...getThreadBaseIncludeParams(user),
            },
          },
          replyTo: {
            select: {
              owner: {
                select: {
                  username: true,
                },
              },
            },
          },
          ...getThreadBaseIncludeParams(user),
        },
      } satisfies Prisma.ThreadFindManyArgs
    case 'highlights':
      return {
        include: {
          ...getThreadBaseIncludeParams(user),
        },
      } satisfies Prisma.ThreadFindManyArgs

    default:
      return undefined
  }
}

export function getReplyIncludeParams(user: CurrentUser, category: Category) {
  switch (category) {
    case 'replies':
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
          replyTo: {
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
      } satisfies Prisma.ThreadFindManyArgs
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
    ...getThreadIncludeParams(currentUser, category),
    ...params,
    skip,
    cursor,
    take: TAKE,
    orderBy: {
      updatedAt: 'desc',
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
  params?: Prisma.ThreadFindManyArgs
}) {
  const skip = previousCursor ? 1 : 0
  const cursor = getCursor(previousCursor)

  const replies = await prisma.thread.findMany({
    ...params,
    ...getReplyIncludeParams(currentUser, category),
    skip,
    cursor,
    take: TAKE,
    orderBy: {
      updatedAt: 'desc',
    },
  })

  const lastReply = replies.length === TAKE ? replies[TAKE - 1] : null
  const lastCursor = lastReply ? lastReply.id : null

  return {
    data: replies,
    cursor: lastCursor,
  }
}
