import axios from 'axios'

import { ImageResponse, MediaAttributes, UploadFileProps } from './types'

export const uploadImage = async ({
  formData,
  userId,
  onUploadProgress,
}: UploadFileProps): Promise<MediaAttributes> => {
  const { timestamp, signature } = await axios
    .get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cloudinary?user_id=${userId}`)
    .then((res) => res.data)

  const fd = new FormData()
  if (formData) {
    fd.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY)
    fd.append(
      'folder',
      `${process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER}/${userId}`
    )
    fd.append('file', formData.get('file')!)
    fd.append('timestamp', timestamp)
    fd.append('signature', signature)
  }

  const { data } = await axios.request<ImageResponse>({
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' },
    url: process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL,
    data: fd,
    onUploadProgress(progressEvent) {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total!
      )
      onUploadProgress?.(percentCompleted)
    },
  })

  const { secure_url, width, height, public_id } = data

  const urlParts = secure_url.split('/')
  const uploadIndex = urlParts.findIndex((part) => part === 'upload')

  urlParts.splice(uploadIndex + 1, 0, 'c_limit,w_430/dpr_2.0')

  const source = urlParts.join('/')

  const highResSource = source.replace('w_430', 'h_2048,w_2048')

  return { width, height, public_id, source, highResSource }
}
