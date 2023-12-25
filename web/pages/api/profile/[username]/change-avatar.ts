import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma, requestHandler } from '@/lib'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const username = req.query.username as string
  await requestHandler(req, res, {
    allowedRoles: {
      PUT: ['USER'],
    },

    PUT: async (session) => {
      const avatarUrl = req.body.avatarUrl as string

      if (session?.user.username !== username) {
        res.status(401).json({ message: 'Unauthorized' })
        return
      }

      const user = await prisma.user.update({
        where: {
          username,
        },
        data: {
          avatarUrl,
        },
      })

      res.status(200).json(user)
    },
  })
}
