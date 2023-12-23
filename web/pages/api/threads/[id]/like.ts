// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma, requestHandler } from '@/lib'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string

  await requestHandler(req, res, {
    allowedRoles: {
      PUT: ['USER'],
    },
    PUT: async (session) => {
      const userId = session?.user?.id as string

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
          },
        })

        await prisma.threadLike.delete({
          where: {
            threadId_userId: {
              threadId: id,
              userId: userId,
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
          },
        })

        await prisma.threadLike.create({
          data: {
            userId,
            threadId: id,
          },
        })
      }

      res.status(200).json({ message: 'Like count updated successfully' })
    },
  })
}