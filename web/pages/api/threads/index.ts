import { Prisma } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

import { CurrentUser, getPaginatedThreads, prisma, requestHandler } from '@/lib'

type Category = 'everyone' | 'highlights' | 'following'

export function getWhereParams(
  currentUser: CurrentUser,
  category: Category
): Prisma.ThreadFindManyArgs | undefined {
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
                    id: currentUser.id,
                  },
                },
              },
              {
                id: currentUser.id,
              },
              {
                reposts: {
                  some: {
                    userId: currentUser.id,
                  },
                },
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
    GET: async (currentUser) => {
      const previousCursor = req.query.cursor as string
      const category = req.query.category as Category

      const threads = await getPaginatedThreads({
        currentUser,
        category,
        previousCursor,
        params: {
          ...getWhereParams(currentUser, category),
        },
      })

      res.status(200).json(threads)
    },
    POST: async (currentUser) => {
      const embed = req.body.embed

      const user = await prisma.thread.create({
        data: {
          ...req.body,
          embed: embed
            ? {
                create: {
                  ...embed,
                },
              }
            : undefined,
          ownerId: currentUser.id,
        },
      })

      res.status(200).json(user)
    },
  })
}
