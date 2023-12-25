import { Prisma } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma, requestHandler } from '@/lib'

type Follow = '0' | '1'

function getFollowData(
  follow: Follow,
  id: string
): Prisma.UserUpdateArgs['data'] {
  if (follow === '0') {
    return {
      following: {
        disconnect: {
          id,
        },
      },
    }
  } else {
    return {
      following: {
        connect: {
          id,
        },
      },
    }
  }
}

function getFollowedData(
  follow: Follow,
  id: string
): Prisma.UserUpdateArgs['data'] {
  if (follow === '0') {
    return {
      followedBy: {
        disconnect: {
          id,
        },
      },
    }
  } else {
    return {
      followedBy: {
        connect: {
          id,
        },
      },
    }
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await requestHandler(req, res, {
    allowedRoles: {
      POST: ['USER'],
    },

    POST: async (session) => {
      const userToFollowId = req.query.username as string
      const userId = session?.user.id as string
      const follow = req.query.follow as Follow

      const user = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          ...getFollowData(follow, userToFollowId),
        },
      })

      await prisma.user.update({
        where: {
          id: userToFollowId,
        },
        data: {
          ...getFollowedData(follow, userToFollowId),
        },
      })

      res.status(200).json(user)
    },
  })
}
