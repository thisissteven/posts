import type { NextApiRequest, NextApiResponse } from 'next'

import { getPaginatedThreadReplies } from '@/lib'
import { requestHandler } from '@/lib'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await requestHandler(req, res, {
    allowedRoles: {
      GET: ['PUBLIC', 'USER'],
    },

    GET: async (currentUser) => {
      const threadId = req.query.threadId as string

      const previousCursor = req.query.cursor as string

      const threads = await getPaginatedThreadReplies({
        currentUser,
        category: 'replies',
        previousCursor,
        params: {
          where: {
            replyToId: threadId,
          },
        },
      })

      res.status(200).json(threads)
    },
  })
}
