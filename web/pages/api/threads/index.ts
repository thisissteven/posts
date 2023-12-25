import type { NextApiRequest, NextApiResponse } from 'next'
import { Session } from 'next-auth'

import { prisma, requestHandler } from '@/lib'

type Category = 'everyone' | 'highlights' | 'following'

export function getIncludeParams(session: Session | null) {
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
}

export function getCursor(previousCursor?: string | null) {
  const cursor = previousCursor
    ? {
        id: previousCursor,
      }
    : undefined

  return cursor
}

export function getWhereParams(session: Session | null, category: Category) {
  switch (category) {
    case 'everyone' || undefined:
      return {
        where: undefined,
      }
    case 'highlights':
      return {
        where: {
          OR: [
            {
              likeCount: {
                gte: 2,
              },
            },
            {
              repostCount: {
                gte: 2,
              },
            },
          ],
        },
      }
    case 'following':
      return {
        where: {
          owner: {
            OR: [
              {
                followedBy: {
                  some: {
                    id: session?.user.id,
                  },
                },
              },
              {
                id: session?.user.id,
              },
            ],
          },
        },
      }
    default:
      return undefined
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await requestHandler(req, res, {
    allowedRoles: {
      GET: ['PUBLIC', 'USER'],
      POST: ['USER'],
    },
    GET: async (session) => {
      const previousCursor = req.query.cursor as string
      const category = req.query.category as Category

      const skip = previousCursor ? 1 : 0
      const cursor = getCursor(previousCursor)

      const threads = await prisma.thread.findMany({
        ...getWhereParams(session, category),
        ...getIncludeParams(session),
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        cursor,
        take: 10,
      })

      const lastThread = threads.length === 10 ? threads[9] : null
      const lastCursor = lastThread ? lastThread.id : null

      res.status(200).json({
        data: threads,
        cursor: lastCursor,
      })
    },
    POST: async (session) => {
      const user = await prisma.thread.create({
        data: {
          ...req.body,
          ownerId: session?.user.id,
        },
      })

      res.status(200).json(user)
    },
  })
}
