import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma, requestHandler, updateUser } from '@/lib'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await requestHandler(req, res, {
    allowedRoles: {
      PUT: ['USER'],
    },

    PUT: async (currentUser) => {
      const { avatarUrl } = req.body
      const username = currentUser.username

      const user = await prisma.user.update({
        where: {
          username,
        },
        data: {
          avatarUrl,
        },
      })

      await updateUser({
        id: user.id,
        avatarUrl: user.avatarUrl,
      })

      res.status(200).json(user)
    },
  })
}
