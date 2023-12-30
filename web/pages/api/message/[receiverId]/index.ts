import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma, requestHandler } from '@/lib'

export function getRoomId(firstId: string, secondId: string) {
  const compareResult = firstId.localeCompare(secondId)

  if (compareResult < 0) {
    return `${firstId}-${secondId}`
  } else if (compareResult > 0) {
    return `${secondId}-${firstId}`
  } else {
    throw new Error('Cannot provide same id.')
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const receiverId = req.query.receiverId as string
  await requestHandler(req, res, {
    allowedRoles: {
      GET: ['USER'],
      POST: ['USER'],
    },
    GET: async (currentUser) => {
      const roomIdentifier = getRoomId(currentUser.id, receiverId)

      if (!roomIdentifier.includes(currentUser.id)) {
        return res.status(401).json('Cannot access message.')
      }

      const messages = await prisma.message.findMany({
        where: {
          roomIdentifier,
        },
      })

      res.status(200).json(messages)
    },
    POST: async (currentUser) => {
      const { content } = req.body

      const message = await prisma.message.create({
        data: {
          sender: {
            connect: {
              id: currentUser.id,
            },
          },
          room: {
            connectOrCreate: {
              create: {
                identifier: getRoomId(currentUser.id, receiverId),
                senderId: currentUser.id,
                receiverId: receiverId,
              },
              where: {
                identifier: getRoomId(currentUser.id, receiverId),
              },
            },
          },
          content,
        },
      })

      await prisma.room.update({
        where: {
          identifier: getRoomId(currentUser.id, receiverId),
        },
        data: {
          updatedAt: new Date(),
        },
      })

      res.status(200).json(message)
    },
  })
}
