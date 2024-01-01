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
      const notifications = await getUserNotifications(currentUser.id)

      res.status(200).json(notifications)
    },
  })
}

async function getUserNotifications(recipientId: string) {
  return await prisma.notification.findMany({
    where: {
      recipientId,
    },
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
        select: {
          textContent: true,
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
      // repliedByNotification: {
      //   select: {
      //     repliedBy: {
      //       select: {
      //         username: true,
      //         displayName: true,
      //       },
      //     },
      //     thread: {
      //       select: {
      //         id: true,
      //         textContent: true,
      //       },
      //     },
      //   },
      // },
    },
  })
}

export type GetUserNotificationsResponse = Prisma.PromiseReturnType<
  typeof getUserNotifications
>
