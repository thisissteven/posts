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
        select: {
          id: true,
          mediaType: true,
          source: true,
          highResSource: true,
          width: true,
          height: true,
        },
      })

      res.status(200).json(threads)
    },
  })
}