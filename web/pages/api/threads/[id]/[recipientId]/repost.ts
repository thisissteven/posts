// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { handleNotificationUpdate, prisma, requestHandler } from '@/lib'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string
  const recipientId = req.query.recipientId as string

  await requestHandler(req, res, {
    allowedRoles: {
      PUT: ['USER'],
    },
    PUT: async (currentUser) => {
      const userId = currentUser.id as string

      const alreadyReposted = await prisma.threadRepost.findFirst({
        where: {
          threadId: id,
          userId,
        },
      })

      if (alreadyReposted) {
        await prisma.thread.update({
          where: {
            id,
          },
          data: {
            repostCount: {
              decrement: 1,
            },
            reposts: {
              delete: {
                threadId_userId: {
                  threadId: id,
                  userId: userId,
                },
              },
            },
          },
        })
      } else {
        await prisma.thread.update({
          where: {
            id,
          },
          data: {
            repostCount: {
              increment: 1,
            },
            reposts: {
              create: {
                userId,
              },
            },
          },
        })

        if (userId !== recipientId)
          await handleNotificationUpdate({
            payload: {
              recipientId,
              userId,
              id,
            },
            type: 'REPOST',
          })
      }

      res.status(200).json({ message: 'Repost count updated successfully' })
    },
  })
}
