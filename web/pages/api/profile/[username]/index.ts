import { Prisma } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

import { CurrentUser, prisma, requestHandler } from '@/lib'

const findUser = async (currentUser: CurrentUser, username: string) => {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
      avatarUrl: true,
      displayName: true,
      username: true,
      website: true,
      followedBy: !currentUser
        ? false
        : {
            where: {
              id: currentUser.id,
            },
            select: {
              id: true,
            },
          },
    },
  })

  return user
}

export type FindUserResponse = Prisma.PromiseReturnType<typeof findUser>

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const username = req.query.username as string
  await requestHandler(req, res, {
    allowedRoles: {
      GET: ['PUBLIC', 'USER'],
    },
    GET: async (currentUser) => {
      const user = await findUser(currentUser, username)

      res.status(200).json(user)
    },
  })
}
