import { Prisma } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma, requestHandler } from '@/lib'

type Block = '0' | '1'

function getBlockingData(
  block: Block,
  id: string
): Prisma.UserUpdateArgs['data'] {
  if (block === '0') {
    return {
      blocking: {
        disconnect: {
          id,
        },
      },
    }
  } else {
    return {
      blocking: {
        connect: {
          id,
        },
      },
      following: {
        disconnect: {
          id,
        },
      },
    }
  }
}

function getBlockedByData(
  block: Block,
  id: string
): Prisma.UserUpdateArgs['data'] {
  if (block === '0') {
    return {
      blockedBy: {
        disconnect: {
          id,
        },
      },
    }
  } else {
    return {
      blockedBy: {
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
      const userToBlockId = req.query.username as string
      const block = req.query.block as Block
      const userId = currentUser.id as string

      if (userId === userToBlockId) {
        res.status(400).json('Cannot block or unblock self.')
      }

      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          ...getBlockingData(block, userToBlockId),
        },
      })

      const user = await prisma.user.update({
        where: {
          id: userToBlockId,
        },
        data: {
          ...getBlockedByData(block, userId),
          followedBy:
            block === '1'
              ? undefined
              : {
                  disconnect: {
                    id: userToBlockId,
                  },
                },
        },
        select: {
          blockedBy: true,
        },
      })

      res.status(200).json(user)
    },
  })
}
