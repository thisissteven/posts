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
      const user = await prisma.user.delete({
        where: {
          id: currentUser.id,
        },
      })

      res.status(200).json(user)
    },
  })
}
