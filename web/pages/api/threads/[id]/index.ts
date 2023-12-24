// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma, requestHandler } from '@/lib'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string
  await requestHandler(req, res, {
    allowedRoles: {
      DELETE: ['USER'],
    },
    DELETE: async (session) => {
      const user = await prisma.thread.delete({
        where: {
          id,
          ownerId: session?.user.id,
        },
      })

      res.status(200).json(user)
    },
  })
}
