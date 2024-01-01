import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma, requestHandler } from '@/lib'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const threadId = req.query.id as string

  await requestHandler(req, res, {
    allowedRoles: {
      POST: ['USER'],
    },

    POST: async (currentUser) => {
      const embed = req.body.embed

      const user = await prisma.thread.update({
        where: {
          id: threadId,
        },
        data: {
          repliesCount: {
            increment: 1,
          },
          replies: {
            create: {
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
          },
        },
      })

      res.status(200).json(user)
    },
  })
}
