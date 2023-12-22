import { z } from 'zod'

import { apiClient } from '@/lib'

export const newThreadSchema = z.object({
  textContent: z.string().min(1).max(280, 'Max length is 280 characters.'),
  media: z
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
})

export type NewThreadFormValues = z.infer<typeof newThreadSchema>

export async function onSubmit(data: NewThreadFormValues) {
  await apiClient.post('/threads', data)
}
