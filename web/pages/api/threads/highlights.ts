import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma, requestHandler } from '@/lib'

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
      const threads = await prisma.thread.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        where: {
          likeCount: {
            gt: 1,
          },
          repostCount: {
            gt: 1,
          },
        },
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
      })

      res.status(200).json(threads)
    },
    POST: async (session) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const user = await prisma.thread.create({
        data: {
          ...req.body,
          owner: {
            connect: {
              id: session?.user.id,
            },
          },
        },
      })

      res.status(200).json(user)
    },
  })
}
