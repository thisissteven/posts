// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { getPaginatedThreads, requestHandler } from '@/lib'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await requestHandler(req, res, {
    allowedRoles: {
      GET: ['PUBLIC', 'USER'],
    },
    GET: async (currentUser) => {
      const previousCursor = req.query.cursor as string

      const username = req.query.username as string

      const threads = await getPaginatedThreads({
        currentUser,
        category: 'posts',
        previousCursor,
        params: {
          where: {
            replyTo: null,
            OR: [
              {
                owner: {
                  username,
                },
              },
              {
                reposts: {
                  some: {
                    user: {
                      username,
                    },
                  },
                },
              },
            ],
          },
          include: {
            embed: {
              select: {
                url: true,
                secureUrl: true,
                title: true,
                description: true,
                image: true,
              },
            },
            replyTo: {
              select: {
                owner: {
                  select: {
                    username: true,
                  },
                },
              },
            },
            owner: {
              select: {
                id: true,
                avatarUrl: true,
                isSupporter: true,
                username: true,
                displayName: true,
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
              },
            },
            likes: !currentUser
              ? false
              : {
                  where: {
                    user: {
                      id: currentUser.id,
                    },
                  },
                  select: {
                    user: {
                      select: {
                        username: true,
                      },
                    },
                  },
                },
            reposts: {
              where: {
                OR: [
                  {
                    user: {
                      username,
                    },
                  },
                  {
                    user: {
                      username: currentUser.username,
                    },
                  },
                ],
              },
              select: {
                user: {
                  select: {
                    username: true,
                  },
                },
              },
            },
          },
        },
      })

      res.status(200).json(threads)
    },
  })
}
