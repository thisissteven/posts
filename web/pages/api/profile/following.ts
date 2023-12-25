import type { NextApiRequest, NextApiResponse } from 'next'

import { getFollowing, requestHandler } from '@/lib'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await requestHandler(req, res, {
    allowedRoles: {
      GET: ['USER'],
    },

    GET: async (session) => {
      const userId = session?.user.id as string

      const following = await getFollowing(userId)

      res.status(200).json({
        list: following?.following ?? [],
      })
    },
  })
}
