import { Prisma } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

import { CurrentUser, prisma, requestHandler, updateUser } from '@/lib'

import { getDescription } from '@/modules/Profile/Me'

export const findUser = async (currentUser: CurrentUser, username: string) => {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
      avatarUrl: true,
      displayName: true,
      username: true,
      website: true,
      profession: true,
      location: true,
      pronouns: true,
      createdAt: true,
      following: !currentUser
        ? false
        : {
            where: {
              id: currentUser.id,
            },
            select: {
              id: true,
            },
          },
      followedBy: !currentUser
        ? false
        : {
            where: {
              id: currentUser.id,
            },
            select: {
              id: true,
            },
          },
      blockedBy: !currentUser
        ? false
        : {
            where: {
              id: currentUser.id,
            },
            select: {
              id: true,
            },
          },
      blocking:
        username !== currentUser.username
          ? false
          : {
              select: {
                id: true,
                displayName: true,
                username: true,
                avatarUrl: true,
              },
            },
    },
  })

  return user
}

export type FindUserResponse = Prisma.PromiseReturnType<typeof findUser>

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const username = req.query.username as string

  await requestHandler(req, res, {
    allowedRoles: {
      GET: ['PUBLIC', 'USER'],
      PUT: ['USER'],
    },
    GET: async (currentUser) => {
      const user = await findUser(currentUser, username)

      res.status(200).json(user)
    },
    PUT: async (currentUser) => {
      const userId = currentUser.id

      if (username !== currentUser.username) {
        res.status(400).json("Cannot update another user's profile")
      }

      const { displayName, profession, location, pronouns, website } = req.body

      const user = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          username: req.body.username as string,
          displayName,
          profession,
          location,
          pronouns,
          website,
        },
      })

      await updateUser({
        id: currentUser.id,
        username,
        displayName,
        bio: getDescription(user as unknown as FindUserResponse),
      })

      res.status(200).json(user)
    },
  })
}
