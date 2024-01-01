import { Prisma } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma, requestHandler } from '@/lib'

type Follow = '0' | '1'

function getFollowingData(
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

function getFollowedByData(
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

    POST: async (currentUser) => {
      const userToFollowId = req.query.username as string
      const follow = req.query.follow as Follow
      const userId = currentUser.id as string

      if (userId === userToFollowId) {
        res.status(400).json('Cannot follow or unfollow self.')
      }

      const user = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          ...getFollowingData(follow, userToFollowId),
        },
      })

      await prisma.user.update({
        where: {
          id: userToFollowId,
        },
        data: {
          ...getFollowedByData(follow, userId),
        },
      })

      if (userId !== userToFollowId)
        await allowError(async () => {
          await prisma.notification.create({
            data: {
              id: `${userToFollowId}-${userId}-FOLLOW`,
              type: 'FOLLOW',
              recipient: {
                connect: {
                  id: userToFollowId,
                },
              },
              followedByNotification: {
                create: {
                  followedById: userId,
                },
              },
            },
          })
        })

      res.status(200).json(user)
    },
  })
}

const allowError = async (fn: () => Promise<void>) => {
  try {
    await fn()
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('An error occurred.')
  }
}
