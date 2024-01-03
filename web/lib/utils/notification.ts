import { prisma, supabaseClient } from '@/lib'

type NotificationType = 'LIKE' | 'REPOST' | 'REPLY' | 'FOLLOW'

type NotificationUpdateArgs = {
  payload: {
    recipientId: string
    userId: string
    id: string
  }
  type: NotificationType
}

export const CHAT_EVENT = 'chat-event'

export async function handleNotificationUpdate(args: NotificationUpdateArgs) {
  allowError(async () => {
    const { recipientId } = args.payload

    const promise1 = updateNotificationStatus(recipientId)
    const promise2 = getNotificationCreatePromise(args)
    const promise3 = sendNotificationToChannel(recipientId)

    await Promise.all([promise1, promise2, promise3])
  })
}

async function sendNotificationToChannel(recipientId: string) {
  const channel = supabaseClient.channel(recipientId)

  channel.subscribe(async (status) => {
    if (status !== 'SUBSCRIBED') {
      return null
    }

    await channel.send({
      type: 'broadcast',
      event: CHAT_EVENT,
    })
  })
}

function getNotificationCreatePromise(args: NotificationUpdateArgs) {
  switch (args.type) {
    case 'LIKE':
      return createLikeNotification(args.payload)
    case 'FOLLOW':
      return createFollowNotification(args.payload)
    case 'REPLY':
      return createReplyNotification(args.payload)
    case 'REPOST':
      return createRepostNotification(args.payload)
  }
}

const allowError = async (fn: () => Promise<void>) => {
  try {
    await fn()
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('An error occurred.')
  }
}

async function updateNotificationStatus(recipientId: string) {
  await prisma.userNotificationStatus.upsert({
    create: {
      id: recipientId,
      status: 'UNREAD',
    },
    where: {
      id: recipientId,
    },
    update: {
      status: 'UNREAD',
    },
  })
}

async function createLikeNotification(payload: {
  recipientId: string
  userId: string
  id: string
}) {
  const { recipientId, userId, id } = payload

  await prisma.notification.upsert({
    where: {
      id: `${recipientId}-${id}-LIKE`,
    },
    update: {
      likedByNotification: {
        create: {
          id: `${id}-${userId}-LIKE`,
          likedById: userId,
        },
      },
    },
    create: {
      id: `${recipientId}-${id}-LIKE`,
      type: 'LIKE',
      thread: {
        connect: {
          id,
        },
      },
      recipient: {
        connect: {
          id: recipientId,
        },
      },
      likedByNotification: {
        create: {
          id: `${id}-${userId}-LIKE`,
          likedById: userId,
        },
      },
    },
  })
}

async function createRepostNotification(payload: {
  recipientId: string
  userId: string
  id: string
}) {
  const { recipientId, userId, id } = payload

  await prisma.notification.upsert({
    where: {
      id: `${recipientId}-${id}-REPOST`,
    },
    update: {
      repostedByNotification: {
        create: {
          id: `${id}-${userId}-REPOST`,
          repostedById: userId,
        },
      },
    },
    create: {
      id: `${recipientId}-${id}-REPOST`,
      type: 'REPOST',
      thread: {
        connect: {
          id,
        },
      },
      recipient: {
        connect: {
          id: recipientId,
        },
      },
      repostedByNotification: {
        create: {
          id: `${id}-${userId}-REPOST`,
          repostedById: userId,
        },
      },
    },
  })
}

async function createReplyNotification(payload: {
  recipientId: string
  userId: string
  id: string
}) {
  const { recipientId, userId, id } = payload

  await prisma.notification.upsert({
    where: {
      id: `${recipientId}-${id}-REPLY`,
    },
    update: {
      repliedByNotification: {
        create: {
          id: `${id}-${userId}-REPLY`,
          repliedById: userId,
        },
      },
    },
    create: {
      id: `${recipientId}-${id}-REPLY`,
      type: 'REPLY',
      thread: {
        connect: {
          id,
        },
      },
      recipient: {
        connect: {
          id: recipientId,
        },
      },
      repliedByNotification: {
        create: {
          id: `${id}-${userId}-REPLY`,
          repliedById: userId,
        },
      },
    },
  })
}

async function createFollowNotification(payload: {
  recipientId: string
  userId: string
  id: string
}) {
  const { recipientId, userId } = payload

  await prisma.notification.create({
    data: {
      id: `${recipientId}-${userId}-FOLLOW`,
      type: 'FOLLOW',
      recipient: {
        connect: {
          id: recipientId,
        },
      },
      followedByNotification: {
        create: {
          id: `${recipientId}-${userId}-FOLLOW`,
          followedById: userId,
        },
      },
    },
  })
}
