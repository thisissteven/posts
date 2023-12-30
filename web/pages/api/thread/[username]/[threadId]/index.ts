import type { NextApiRequest, NextApiResponse } from 'next'

import { getThreadIncludeParams } from '@/lib'
import { prisma, requestHandler } from '@/lib'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await requestHandler(req, res, {
    allowedRoles: {
      GET: ['PUBLIC', 'USER'],
    },

    GET: async (currentUser) => {
      const username = req.query.username as string
      const threadId = req.query.threadId as string

      const thread = await prisma.thread.findUnique({
        where: {
          owner: {
            username,
          },
          id: threadId,
        },
        ...getThreadIncludeParams(currentUser, 'everyone'),
      })

      await new Promise((resolve) => setTimeout(resolve, 500))

      res.status(200).json(thread)
    },
  })
}
