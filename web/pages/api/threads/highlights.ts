import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma, requestHandler } from '@/lib'

import { getThreadParams } from '.'

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
          OR: [
            {
              likeCount: {
                gt: 2,
              },
            },
            {
              repostCount: {
                gt: 2,
              },
            },
          ],
        },
        ...getThreadParams(session),
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
