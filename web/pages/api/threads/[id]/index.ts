// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma, requestHandler } from '@/lib'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username, displayName } = req.body

  await requestHandler(req, res, {
    allowedRoles: {
      DELETE: ['USER'],
    },
    DELETE: async (session) => {
      const user = await prisma.user.update({
        where: {
          id: session?.user.id,
        },
        data: {
          username,
          displayName,
        },
      })

      res.status(200).json(user)
    },
  })
}
