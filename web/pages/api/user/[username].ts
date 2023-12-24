import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma, requestHandler } from '@/lib'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const username = req.query.username as string
  await requestHandler(req, res, {
    allowedRoles: {
      GET: ['PUBLIC', 'USER'],
    },
    GET: async (session) => {
      const user = await prisma.user.findUnique({
        where: {
          username,
        },
        select: {
          id: true,
        },
      })

      res.status(200).json(user)
    },
  })
}
