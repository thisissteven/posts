import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma, requestHandler } from '@/lib'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const username = req.query.id as string
  await requestHandler(req, res, {
    allowedRoles: {
      GET: ['PUBLIC', 'USER'],
    },
    GET: async (session) => {
      const threads = await prisma.thread.findMany({
        where: {
          owner: {
            username,
          },
        },
        orderBy: {
          createdAt: 'desc',
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
  })
}
