import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import * as React from 'react'
import {
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
} from 'react-hook-form'
import useSWR from 'swr'
import { z } from 'zod'

import { useDebounce } from '@/hooks'

import { FormInput } from '@/components/UI'

const editProfileSchema = z.object({
  username: z
    .string()
    .min(2, 'Username is invalid')
    .max(20, 'Username is invalid')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username is invalid'),
  displayName: z.string().min(1).max(48),
  profession: z.string().max(32).optional(),
  location: z.string().max(32).optional(),
  pronouns: z.string().max(12).optional(),
  website: z.string().url().max(96).optional().or(z.literal('')),
})

export type EditProfileSchema = z.infer<typeof editProfileSchema>

export function EditProfileForm() {
  const { data: session } = useSession()

  const methods = useForm<EditProfileSchema>({
    resolver: zodResolver(editProfileSchema),
    mode: 'onChange',
    defaultValues: {
      username: '',
      displayName: '',
      profession: '',
      location: '',
      pronouns: '',
      website: '',
    },
  })

  const { handleSubmit, register } = methods

  const onSubmit = async (values: EditProfileSchema) => {}

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
      </form>
    </FormProvider>
  )
}

function UsernameInput() {
  const { control, setError, register } = useFormContext<EditProfileSchema>()

  const value = useWatch({
    control,
    name: 'username',
  })

  const debouncedValue = useDebounce(value, 300)

  const { data: user } = useSWR<{
    id: string
  }>(`/user/${debouncedValue}`)

  const usernameTaken = Boolean(user?.id)

  React.useEffect(() => {
    if (usernameTaken) {
      setError('username', {
        type: 'manual',
        message: 'This username is taken',
      })
    }
  }, [usernameTaken, setError])

  return (
    <FormInput
      {...register('username')}
      label="Username"
      placeholder="your unique @handle"
      autoComplete="off"
      required
      withSuccessIndicator
    />
  )
}
