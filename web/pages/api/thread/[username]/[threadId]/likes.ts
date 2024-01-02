import { Prisma } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

import { CurrentUser, prisma, requestHandler } from '@/lib'

async function getThreadLikes(payload: {
  threadId: string
  currentUser: CurrentUser
}) {
  const { threadId, currentUser } = payload

  return await prisma.threadLike.findMany({
    where: {
      threadId,
    },
    select: {
      user: {
        select: {
          displayName: true,
          username: true,
          avatarUrl: true,
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
      },
    },
  })
}

export type GetThreadLikesResponse = Prisma.PromiseReturnType<
  typeof getThreadLikes
>

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

      const likes = await getThreadLikes({
        threadId,
        currentUser,
      })

      res.status(200).json(likes)
    },
  })
}
