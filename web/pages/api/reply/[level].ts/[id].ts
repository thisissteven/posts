import type { NextApiRequest, NextApiResponse } from 'next'

import { handleNotificationUpdate, prisma, requestHandler } from '@/lib'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const threadId = req.query.id as string
  const level = req.query.level as string

  await requestHandler(req, res, {
    allowedRoles: {
      POST: ['USER'],
    },
    POST: async (currentUser) => {
      const embed = req.body.embed
      const source =
        typeof req.body.source === 'string' ? req.body.source : null

      const newThread = await prisma.thread.create({
        data: {
          ...req.body,
          source,
          level: parseInt(level) + 1,
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

      const thread = await prisma.thread.update({
        where: {
          id: threadId,
        },
        data: {
          updatedAt: new Date(),
          repliesCount: {
            increment: 1,
          },
          replies: {
            connect: {
              id: newThread.id,
            },
          },
        },
      })

      if (currentUser.id !== thread.ownerId)
        await handleNotificationUpdate({
          payload: {
            recipientId: thread.ownerId,
            userId: currentUser.id,
            id: newThread.id,
          },
          type: 'REPLY',
        })

      res.status(200).json(thread)
    },
  })
}
