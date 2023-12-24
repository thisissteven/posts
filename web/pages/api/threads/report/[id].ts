// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma, requestHandler } from '@/lib'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string

  const { reason } = req.body
  await requestHandler(req, res, {
    allowedRoles: {
      POST: ['PUBLIC', 'USER'],
    },
    POST: async (session) => {
      const user = await prisma.threadReport.create({
        data: {
          threadId: id,
          reason,
          reporterId: session?.user.id,
        },
      })
      await new Promise((resolve) => setTimeout(resolve, 1000))

      res.status(200).json(user)
    },
  })
}
