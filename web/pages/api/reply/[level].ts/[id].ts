import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma, requestHandler } from '@/lib'

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

      const newThread = await prisma.thread.create({
        data: {
          ...req.body,
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
        await allowError(async () => {
          await prisma.notification.upsert({
            where: {
              id: `${thread.ownerId}-${newThread.id}-REPLY`,
            },
            update: {
              repliedByNotification: {
                create: {
                  id: `${newThread.id}-${currentUser.id}-REPLY`,
                  repliedById: currentUser.id,
                },
              },
            },
            create: {
              id: `${thread.ownerId}-${newThread.id}-REPLY`,
              type: 'REPLY',
              thread: {
                connect: {
                  id: newThread.id,
                },
              },
              recipient: {
                connect: {
                  id: thread.ownerId,
                },
              },
              repliedByNotification: {
                create: {
                  id: `${newThread.id}-${currentUser.id}-REPLY`,
                  repliedById: currentUser.id,
                },
              },
            },
          })
        })

      res.status(200).json(thread)
    },
  })
}

const allowError = async (fn: () => Promise<void>) => {
  try {
    await fn()
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('An error occurred.')
  }
}
