import { prisma } from '.'

export type FollowList = {
  list: {
    id: string
    username: string
    displayName: string
    avatarUrl: string
  }[]
}

export const getFollowers = async (userId: string) => {
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      followedBy: {
        select: {
          username: true,
          id: true,
          displayName: true,
          avatarUrl: true,
        },
      },
    },
  })
}

export const getFollowing = async (userId: string) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      following: {
        select: {
          username: true,
          id: true,
          displayName: true,
          avatarUrl: true,
        },
      },
    },
  })
}
