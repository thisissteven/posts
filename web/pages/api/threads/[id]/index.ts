// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma, requestHandler } from '@/lib'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await requestHandler(req, res, {
    allowedRoles: {
      DELETE: ['USER'],
    },

    DELETE: async (currentUser) => {
      const id = req.query.id as string

      const thread = await prisma.thread.delete({
        where: {
          id,
          ownerId: currentUser.id,
        },
      })

      res.status(200).json(thread)
    },
  })
}
