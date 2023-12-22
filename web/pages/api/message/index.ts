import type { NextApiRequest, NextApiResponse } from 'next'

import { requestHandler } from '@/lib'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await requestHandler(req, res, {
    allowedRoles: {
      GET: ['PUBLIC'],
      POST: ['USER'],
    },
    GET: async (session) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      res.status(200).json({
        status: 'success',
      })
    },
    POST: async (session) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      res.status(200).json({
        status: 'success',
      })
    },
  })
}
