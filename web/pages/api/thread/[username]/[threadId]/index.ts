import { Prisma } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

import { CurrentUser, getThreadBaseIncludeParams } from '@/lib'
import { prisma, requestHandler } from '@/lib'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await requestHandler(req, res, {
    allowedRoles: {
      GET: ['PUBLIC', 'USER'],
    },

    GET: async (currentUser) => {
      const username = req.query.username as string
      const threadId = req.query.threadId as string

      const thread = await prisma.thread.findUnique({
        where: {
          owner: {
            username,
          },
          id: threadId,
        },
        include: {
          ...getThreadBaseIncludeParams(currentUser),
        },
      })

      // has parent
      if (thread?.replyToId && thread?.level > 0) {
        const includeParams = {
          ...getThreadBaseIncludeParams(currentUser),
          ...generateNestedIncludes(thread.level, currentUser),
        }

        const parentThread = await prisma.thread.findUnique({
          where: {
            id: thread.replyToId,
          },
          include: includeParams,
        })

        res.status(200).json({
          thread,
          parentThread,
          includeParams,
        })
      }

      res.status(200).json({
        thread,
        parentThread: null,
      })
    },
  })
}

const generateNestedIncludes = (level: number, currentUser: CurrentUser) => {
  if (level <= 0) {
    return null
  }

  const includeParams = {
    replyTo: {
      include: {
        ...getThreadBaseIncludeParams(currentUser),
      },
    },
  } satisfies Prisma.ThreadFindManyArgs['include']

  let nestedIncludes = includeParams
  for (let i = 1; i < level; i++) {
    nestedIncludes = {
      replyTo: {
        include: {
          ...getThreadBaseIncludeParams(currentUser),
          ...nestedIncludes,
        },
      },
    } satisfies Prisma.ThreadFindManyArgs['include']
  }

  return nestedIncludes
}
