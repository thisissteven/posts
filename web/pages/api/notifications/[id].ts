import { Prisma } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

import {
  CurrentUser,
  getCursor,
  getThreadBaseIncludeParams,
  prisma,
  requestHandler,
} from '@/lib'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await requestHandler(req, res, {
    allowedRoles: {
      GET: ['USER'],
    },

    GET: async (currentUser) => {
      const previousCursor = req.query.cursor as string

      const notifications = await getUserNotifications(
        currentUser,
        previousCursor
      )

      res.status(200).json(notifications)
    },
  })
}

const TAKE = 30

async function getUserNotifications(
  currentUser: CurrentUser,
  previousCursor: string
) {
  const skip = previousCursor ? 1 : 0
  const cursor = getCursor(previousCursor)

  const recipientId = currentUser.id

  const notifications = await prisma.notification.findMany({
    where: {
      recipientId,
    },
    skip,
    cursor,
    take: TAKE,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      followedByNotification: {
        select: {
          followedBy: {
            select: {
              id: true,
              avatarUrl: true,
              username: true,
              profession: true,
              location: true,
              followedBy: {
                where: {
                  id: recipientId,
                },
                select: {
                  id: true,
                },
              },
            },
          },
        },
      },
      recipient: {
        select: {
          username: true,
        },
      },
      thread: {
        include: {
          ...getThreadBaseIncludeParams(currentUser),
          replyTo: {
            select: {
              owner: {
                select: {
                  username: true,
                },
              },
            },
          },
        },
      },
      likedByNotification: {
        take: 4,
        include: {
          likedBy: {
            select: {
              avatarUrl: true,
              username: true,
            },
          },
        },
      },
      repostedByNotification: {
        take: 4,
        include: {
          repostedBy: {
            select: {
              avatarUrl: true,
              username: true,
            },
          },
        },
      },
      repliedByNotification: {
        select: {
          repliedBy: {
            select: {
              username: true,
              displayName: true,
            },
          },
        },
      },
    },
  })

  await prisma.userNotificationStatus.upsert({
    create: {
      id: recipientId,
      status: 'READ',
    },
    where: {
      id: recipientId,
    },
    update: {
      status: 'READ',
    },
  })

  const lastThread =
    notifications.length === TAKE ? notifications[TAKE - 1] : null
  const lastCursor = lastThread ? lastThread.id : null

  return {
    data: notifications,
    cursor: lastCursor,
  }
}

export type GetUserNotificationsResponse = Prisma.PromiseReturnType<
  typeof getUserNotifications
>
