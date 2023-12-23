import cloudinary from 'cloudinary'
import { NextApiRequest, NextApiResponse } from 'next'

export const cl = cloudinary.v2

cl.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
})

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const timestamp = Math.round(new Date().getTime() / 1000)
  const signature = cl.utils.api_sign_request(
    {
      folder: process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER,
      timestamp,
    },
    process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET
  )

  res.status(200).json({ timestamp, signature })
}
