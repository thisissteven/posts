// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { getPaginatedThreadReplies, requestHandler } from '@/lib'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await requestHandler(req, res, {
    allowedRoles: {
      GET: ['PUBLIC', 'USER'],
    },
    GET: async (session) => {
      const previousCursor = req.query.cursor as string

      const username = req.query.id as string

      const threads = await getPaginatedThreadReplies({
        session,
        category: 'replies',
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
  })
}
