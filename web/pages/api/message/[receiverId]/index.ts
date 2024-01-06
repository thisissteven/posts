import { Prisma } from '@prisma/client'
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

export function getReceiverId(roomId: string, currentUserId: string) {
  const [firstId, secondId] = roomId.split('-')

  return secondId === currentUserId ? firstId : secondId
}

async function getRoomMessages(roomIdentifier: string) {
  return await prisma.message.findMany({
    where: {
      roomIdentifier,
    },
    take: 200,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      sender: {
        select: {
          username: true,
          avatarUrl: true,
        },
      },
    },
  })
}

async function getRoomDetails(roomIdentifier: string) {
  return await prisma.room.findFirst({
    where: {
      identifier: roomIdentifier,
    },
    include: {
      sender: {
        select: {
          username: true,
          id: true,
        },
      },
      receiver: {
        select: {
          username: true,
          id: true,
        },
      },
    },
  })
}

export type GetRoomMessagesResponse = {
  messages: Prisma.PromiseReturnType<typeof getRoomMessages>
  roomDetails: Prisma.PromiseReturnType<typeof getRoomDetails>
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

      const messages = await getRoomMessages(roomIdentifier)
      const roomDetails = await getRoomDetails(roomIdentifier)

      res.status(200).json({
        messages: messages.reverse(),
        roomDetails,
      })
    },
    POST: async (currentUser) => {
      const { content } = req.body

      const roomId = getRoomId(currentUser.id, receiverId)

      const message = await prisma.message.create({
        include: {
          sender: {
            select: {
              username: true,
              avatarUrl: true,
            },
          },
        },
        data: {
          sender: {
            connect: {
              id: currentUser.id,
            },
          },
          room: {
            connectOrCreate: {
              create: {
                identifier: roomId,
                senderId: currentUser.id,
                receiverId: receiverId,
              },
              where: {
                identifier: roomId,
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
