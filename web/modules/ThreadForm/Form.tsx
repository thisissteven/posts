import { z } from 'zod'

import { apiClient, uploadImage, uploadVideo } from '@/lib'

export const newThreadSchema = z.object({
  textContent: z.string().max(280, 'Max length is 280 characters.'),
  source: z
    .any()
    .refine((files) => {
      return !files || files.length === 0 || files?.[0]?.size <= 5000000
    }, `Max image size is 5MB.`)
    .refine(
      (files) =>
        !files ||
        files.length === 0 ||
        [
          'image/jpeg',
          'image/png',
          'image/gif',
          'video/mp4',
          'video/quicktime',
        ].includes(files?.[0]?.type),
      'Only .jpg, .png, .gif, .mp4, and .quicktime formats are supported.'
    ),
  alt: z.string().max(100).optional(),
  embed: z
    .object({
      url: z.string(),
      secureUrl: z.string(),
      title: z.string().nullable().optional(),
      description: z.string().nullable().optional(),
      image: z.string().nullable().optional(),
    })
    .optional(),
})

export type NewThreadFormValues = z.infer<typeof newThreadSchema>

export type NewThreadPayload = {
  mediaType?: string
  highResSource?: string
  width?: number
  height?: number
  userId?: string
} & NewThreadFormValues

export async function createNewThread(url: string, payload: NewThreadPayload) {
  if (payload.source && payload.source.length > 0) {
    const formData = new FormData()
    formData.append('file', payload.source[0])

    const mediaType = payload.source[0].type.split('/')[0]
    formData.append('type', mediaType)

    const { source, highResSource, width, height } =
      mediaType === 'video'
        ? await uploadVideo({
            formData,
            userId: payload.userId as string,
          })
        : await uploadImage({
            formData,
            userId: payload.userId as string,
          })

    payload = {
      ...payload,
      source,
      highResSource,
      mediaType,
      width,
      height,
    }
  }

  delete payload.userId

  return await apiClient.post(url, payload)
}
