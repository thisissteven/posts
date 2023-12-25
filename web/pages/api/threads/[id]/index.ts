// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { getPaginatedThreads, prisma, requestHandler } from '@/lib'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await requestHandler(req, res, {
    allowedRoles: {
      GET: ['PUBLIC', 'USER'],
      DELETE: ['USER'],
    },
    GET: async (session) => {
      const previousCursor = req.query.cursor as string

      const username = req.query.id as string

      const threads = await getPaginatedThreads({
        session,
        category: 'posts',
        previousCursor,
        params: {
          where: {
            owner: {
              username,
            },
          },
        },
      })

      res.status(200).json(threads)
    },
    DELETE: async (session) => {
      const id = req.query.id as string

      const thread = await prisma.thread.delete({
        where: {
          id,
          ownerId: session?.user.id,
        },
      })

      res.status(200).json(thread)
    },
  })
}
