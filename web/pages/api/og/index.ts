import type { NextApiRequest, NextApiResponse } from 'next'
import ogs from 'open-graph-scraper'

import { requestHandler } from '@/lib'

import { cl } from '../cloudinary'

const userAgent =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await requestHandler(req, res, {
    allowedRoles: {
      GET: ['USER'],
    },

    GET: async (_) => {
      const url = req.query.url as string

      const options = {
        url,
        fetchOptions: { headers: { 'user-agent': userAgent } },
      }

      const openGraphData = await ogs(options)

      const ogTitle = openGraphData.result.ogTitle ?? null
      const ogImage = openGraphData.result.ogImage
        ? cl.url(openGraphData.result.ogImage[0].url, {
            type: 'fetch',
            transformation: [
              {
                width: 1080,
              },
              {
                fetch_format: 'auto',
              },
            ],
          })
        : null
      const ogDescription = openGraphData.result.ogDescription ?? null

      res.status(200).json({
        ogImage,
        ogTitle,
        ogDescription,
        secureUrl: url,
      })
    },
  })
}
