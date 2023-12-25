import { Prisma } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma, requestHandler } from '@/lib'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string
  await requestHandler(req, res, {
    allowedRoles: {
      GET: ['PUBLIC', 'USER'],
      PUT: ['USER'],
      DELETE: ['USER'],
    },
    GET: async (session) => {
      const threads = await getThreadById(id)

      res.status(200).json(threads)
    },
    PUT: async (session) => {
      const thread = await updateThread(id, req.body)

      res.status(200).json(thread)
    },
    DELETE: async (session) => {
      const thread = await deleteThread(id)

      res.status(200).json(thread)
    },
  })
}

/* ------------ GET BY ID -------------- */

const getThreadById = async (id: string) => {
  const thread = await prisma.thread.findUnique({
    where: {
      id,
    },
  })

  return thread
}

export type GetThreadByIdResponse = Prisma.PromiseReturnType<
  typeof getThreadById
>

/* ------------ GET BY ID -------------- */

/* ------------ PUT -------------- */

export type UpdateThreadPayload = Prisma.ThreadUpdateArgs['data']
export type UpdateThreadResponse = Prisma.PromiseReturnType<typeof updateThread>

const updateThread = async (id: string, data: UpdateThreadPayload) => {
  const thread = await prisma.thread.update({
    where: {
      id,
    },
    data,
  })

  return thread
}

/* ------------ PUT -------------- */

/* ------------ DELETE -------------- */

export type DeleteThreadResponse = Prisma.PromiseReturnType<typeof deleteThread>

const deleteThread = async (id: string) => {
  const thread = await prisma.thread.delete({
    where: {
      id,
    },
  })

  return thread
}

/* ------------ DELETE -------------- */
