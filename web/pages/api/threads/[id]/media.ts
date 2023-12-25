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
    GET: async (session) => {
      const previousCursor = req.query.cursor as string

      const username = req.query.id as string

      const threads = await getPaginatedThreads({
        session,
        category: 'media',
        previousCursor,
        params: {
          where: {
            owner: {
              username,
            },
            mediaType: {
              not: null,
            },
          },
          select: {
            id: true,
            mediaType: true,
            source: true,
            highResSource: true,
            width: true,
            height: true,
          },
        },
      })

      res.status(200).json(threads)
    },
  })
}
