import axios from 'axios'

import { ImageResponse, MediaAttributes, UploadFileProps } from './types'

export const uploadVideo = async ({
  formData,
  onUploadProgress,
}: UploadFileProps): Promise<MediaAttributes> => {
  const { timestamp, signature } = await axios
    .get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cloudinary`)
    .then((res) => res.data)

  const fd = new FormData()

  if (formData) {
    fd.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY)
    fd.append('folder', process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER)
    fd.append('file', formData.get('file')!)
    fd.append('timestamp', timestamp)
    fd.append('signature', signature)
  }

  const { data } = await axios.request<ImageResponse>({
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' },
    url: process.env.NEXT_PUBLIC_CLOUDINARY_VIDEO_BASE_URL,
    data: fd,
    onUploadProgress(progressEvent) {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total!
      )
      onUploadProgress?.(percentCompleted)
    },
  })

  const { secure_url, width, height, public_id } = data

  return {
    width,
    height,
    public_id,
    source: secure_url,
    highResSource: secure_url,
  }
}
