import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma, requestHandler } from '@/lib'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await requestHandler(req, res, {
    allowedRoles: {
      GET: ['PUBLIC'],
      POST: ['USER'],
    },
    GET: async (_) => {
      const threads = await prisma.thread.findMany()

      res.status(200).json(threads)
    },
    POST: async (session) => {
      const { textContent, mediaType, source, urlEmbed } = req.body

      const user = await prisma.thread.create({
        data: {
          textContent,
          mediaType,
          source,
          urlEmbed,
          owner: {
            connect: {
              id: session?.user.id,
            },
          },
        },
      })

      res.status(200).json(user)
    },
  })
}
