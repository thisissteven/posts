import { Prisma } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma, requestHandler } from '@/lib'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await requestHandler(req, res, {
    allowedRoles: {
      GET: ['USER'],
    },

    GET: async (currentUser) => {
      const id = currentUser.id

      const notificationStatus = await getUserNotificationStatus(id)

      res.status(200).json(notificationStatus)
    },
  })
}

async function getUserNotificationStatus(id: string) {
  return await prisma.userNotificationStatus.findUnique({
    where: {
      id,
    },
  })
}

export type UserNotificationStatus = Prisma.PromiseReturnType<
  typeof getUserNotificationStatus
>
