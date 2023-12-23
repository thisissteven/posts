import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma, requestHandler } from '@/lib'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await requestHandler(req, res, {
    allowedRoles: {
      GET: ['PUBLIC'],
      POST: ['USER'],
    },
    GET: async (session) => {
      const threads = await prisma.thread.findMany({
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
          likes: {
            where: {
              userId: session?.user.id,
            },
            select: {
              id: true,
            },
          },
          reposts: {
            where: {
              userId: session?.user.id,
            },
            select: {
              id: true,
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
