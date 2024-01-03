import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma, requestHandler } from '@/lib'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await requestHandler(req, res, {
    allowedRoles: {
      GET: ['PUBLIC', 'USER'],
    },

    GET: async (currentUser) => {
      const threadId = req.query.threadId as string

      const reposts = await prisma.threadRepost.findMany({
        where: {
          threadId,
          userId: {
            not: currentUser.id,
          },
        },
        select: {
          user: {
            select: {
              id: true,
              displayName: true,
              username: true,
              avatarUrl: true,
              followedBy: !currentUser
                ? false
                : {
                    where: {
                      id: currentUser.id,
                    },
                    select: {
                      id: true,
                    },
                  },
            },
          },
        },
      })

      res.status(200).json(reposts)
    },
  })
}
