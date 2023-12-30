import { Prisma } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma, requestHandler } from '@/lib'

export async function getRooms(userId: string) {
  return await prisma.room.findMany({
    where: {
      OR: [
        {
          senderId: userId,
        },
        {
          receiverId: userId,
        },
      ],
    },
    include: {
      receiver: {
        select: {
          username: true,
          avatarUrl: true,
        },
      },
      sender: {
        select: {
          username: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })
}

export async function getLastMessages(roomIds: string[]) {
  return await prisma.message.findMany({
    where: {
      roomIdentifier: {
        in: roomIds,
      },
    },
    distinct: ['roomIdentifier'],
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      sender: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  })
}

export type GetMessagesResponse = {
  rooms: Prisma.PromiseReturnType<typeof getRooms>
  lastMessages: Prisma.PromiseReturnType<typeof getLastMessages>
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await requestHandler(req, res, {
    allowedRoles: {
      GET: ['USER'],
    },
    GET: async (currentUser) => {
      const rooms = await getRooms(currentUser.id)

      const lastMessages = await getLastMessages(
        rooms.map((room) => room.identifier)
      )

      res.status(200).json({
        rooms,
        lastMessages,
      })
    },
  })
}
