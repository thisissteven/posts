import { Prisma } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Session } from 'next-auth'

import { prisma, requestHandler } from '@/lib'

const findUser = async (session: Session | null, username: string) => {
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
      followedBy: !session
        ? false
        : {
            where: {
              id: session?.user.id,
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
    GET: async (session) => {
      const user = await findUser(session, username)

      res.status(200).json(user)
    },
  })
}
