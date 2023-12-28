import * as React from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import useSWRImmutable from 'swr/immutable'
import { z } from 'zod'

import { useDebounce } from '@/hooks'

import { FormInput } from '@/components/UI'

export const editProfileSchema = z.object({
  username: z
    .string()
    .min(2, 'Username is invalid')
    .max(20, 'Username is invalid')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username is invalid'),
  displayName: z.string().min(1).max(48),
  profession: z.string().max(32).optional(),
  location: z.string().max(32).optional(),
  pronouns: z.string().max(12).optional(),
  website: z
    .string()
    .max(96)
    .refine((arg) => {
      if (arg === undefined || arg === null || arg === '') {
        return true
      }

      const domainRegex = /^[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]{2,}$/

      if (!arg.startsWith('http://') && !arg.startsWith('https://')) {
        return domainRegex.test(arg)
      }

      try {
        const url = new URL(arg)

        const hostnameParts = url.hostname.split('.')
        if (hostnameParts.length < 2) {
          return false
        }

        const tld = hostnameParts[hostnameParts.length - 1]
        if (tld.length < 2) {
          return false
        }
        return true
      } catch {
        return false
      }
    }, 'Invalid url')
    .optional(),
})

export type EditProfileSchema = z.infer<typeof editProfileSchema>

export function EditProfileForm() {
  const { register } = useFormContext<EditProfileSchema>()

  return (
    <div className="space-y-6">
      <UsernameInput />

      <FormInput
        {...register('displayName')}
        label="Display Name"
        placeholder="How your name appears on your profile"
        autoComplete="off"
        maxLength={48}
        watchLength
        required
      />

      <FormInput
        {...register('profession')}
        label="What do you do?"
        placeholder="Architect, painter, etc"
        autoComplete="off"
        maxLength={32}
        watchLength
      />

      <FormInput
        {...register('location')}
        label="Location"
        placeholder="Where you're based"
        autoComplete="off"
        maxLength={32}
        watchLength
      />

      <FormInput
        {...register('pronouns')}
        label="Pronouns"
        placeholder="He/him, etc"
        autoComplete="off"
        maxLength={12}
        watchLength
      />

      <FormInput
        {...register('website')}
        label="Website"
        placeholder="https://example.com"
        autoComplete="off"
        maxLength={96}
        watchLength
      />
    </div>
  )
}

function UsernameInput() {
  const {
    register,
    control,
    formState: { dirtyFields },
  } = useFormContext<EditProfileSchema>()

  const value = useWatch({
    control,
    name: 'username',
  })

  const debouncedValue = useDebounce(value, 300)

  const { data } = useSWRImmutable<{
    id: string
  }>(`/user/${debouncedValue}`)

  const isTaken = Boolean(data?.id) && Boolean(dirtyFields.username)

  return (
    <FormInput
      {...register('username')}
      label="Username"
      placeholder="your unique @handle"
      autoComplete="off"
      required
      withSuccessIndicator
      customError={isTaken ? 'Username is taken' : undefined}
    />
  )
}
