// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma, requestHandler } from '@/lib'

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

      const alreadyLiked = await prisma.threadLike.findFirst({
        where: {
          threadId: id,
          userId,
        },
      })

      if (alreadyLiked) {
        await prisma.thread.update({
          where: {
            id,
          },
          data: {
            likeCount: {
              decrement: 1,
            },
            likes: {
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
            likeCount: {
              increment: 1,
            },
            likes: {
              create: {
                userId,
              },
            },
          },
        })

        if (userId !== recipientId)
          await allowError(async () => {
            await prisma.notification.upsert({
              where: {
                id: `${recipientId}-${id}-LIKE`,
              },
              update: {
                likedByNotification: {
                  create: {
                    id: `${id}-${userId}-LIKE`,
                    likedById: userId,
                  },
                },
              },
              create: {
                id: `${recipientId}-${id}-LIKE`,
                type: 'LIKE',
                thread: {
                  connect: {
                    id,
                  },
                },
                recipient: {
                  connect: {
                    id: recipientId,
                  },
                },
                likedByNotification: {
                  create: {
                    id: `${id}-${userId}-LIKE`,
                    likedById: userId,
                  },
                },
              },
            })
          })
      }

      res.status(200).json({ message: 'Like count updated successfully' })
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
