// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma, requestHandler, saveUser } from '@/lib'

import { getDescription } from '@/modules/Profile/Me'

import { FindUserResponse } from '../profile/[username]'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username, displayName } = req.body

  await requestHandler(req, res, {
    allowedRoles: {
      PUT: ['USER'],
    },
    PUT: async (currentUser) => {
      const user = await prisma.user.update({
        where: {
          id: currentUser.id,
        },
        data: {
          username,
          displayName,
        },
      })

      await saveUser({
        id: user.id,
        avatarUrl: user.avatarUrl,
        bio: getDescription(user as unknown as FindUserResponse),
        createdAt: user.createdAt,
        username: username,
        displayName: displayName,
        timestamp: Math.floor(user.createdAt.getTime() / 1000),
      })

      res.status(200).json(user)
    },
  })
}
