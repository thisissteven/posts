import { Prisma } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

import { prisma, requestHandler } from '@/lib'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await requestHandler(req, res, {
    allowedRoles: {
      GET: ['PUBLIC', 'USER'],
      POST: ['USER'],
    },
    GET: async (session) => {
      const threads = await getAllThread()

      res.status(200).json(threads)
    },
    POST: async (session) => {
      const thread = await createThread(req.body)

      res.status(200).json(thread)
    },
  })
}

/* ------------ GET -------------- */

// type PaginationOptions = {

// }

// const getAllThread2 = async () => {
//   const threads = await prisma.thread.findMany({

//   })
//   return threads
// }

const getAllThread = async () => {
  const threads = await prisma.thread.findMany()
  return threads
}

export type GetAllThreadResponse = Prisma.PromiseReturnType<typeof getAllThread>

/* ------------ GET -------------- */

/* ------------ POST -------------- */

type CreateThreadArgs = Prisma.ThreadCreateArgs['data']
export type CreateThreadResponse = Prisma.PromiseReturnType<typeof createThread>

const createThread = async (data: CreateThreadArgs) => {
  const thread = await prisma.thread.create({
    data,
  })

  return thread
}

/* ------------ POST -------------- */

type ZodShape<T> = {
  // Require all the keys from T
  [key in keyof T]-?: undefined extends T[key]
    ? // When optional, require the type to be optional in zod
      z.ZodOptionalType<z.ZodType<T[key]>>
    : z.ZodType<T[key]>
}

const shape: ZodShape<Pick<CreateThreadArgs, 'textContent' | 'source'>> = {
  textContent: z.string().min(1).max(280),
  source: z
    .any()
    .refine((files) => {
      return !files || files.length === 0 || files?.[0]?.size <= 5000000
    }, `Max image size is 5MB.`)
    .refine(
      (files) =>
        !files ||
        files.length === 0 ||
        [
          'image/jpeg',
          'image/png',
          'image/gif',
          'video/mp4',
          'video/quicktime',
        ].includes(files?.[0]?.type),
      'Only .jpg, .png, .gif, .mp4, and .quicktime formats are supported.'
    )
    .optional(),
}

const schema = z.object(shape)
type CreateThreadPayload = z.infer<typeof schema>
