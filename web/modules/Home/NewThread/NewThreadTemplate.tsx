import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
} from 'react-hook-form'

import { useMutation, useUser } from '@/hooks'

import {
  Dialog,
  FormTextarea,
  RegularButton,
  UploadImageInput,
} from '@/components/UI'

import { CharacterCount } from './CharacterCount'
import {
  createNewThread,
  NewThreadFormValues,
  NewThreadPayload,
  newThreadSchema,
} from './Form'
import { MediaPreview } from './MediaPreview'

export function NewThreadTemplate({
  canEscape = true,
  onSubmitted,
  id,
}: {
  canEscape?: boolean
  onSubmitted?: () => void | Promise<void>
  id: string
}) {
  const [open, setOpen] = React.useState(false)
  const { user } = useUser()

  const methods = useForm<NewThreadFormValues>({
    shouldUnregister: true,
    resolver: zodResolver(newThreadSchema),
    mode: 'onChange',
    defaultValues: {
      textContent: '',
      source: null,
    },
  })

  const { handleSubmit, register, control, reset } = methods

  const onEscape = React.useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && canEscape) {
        e.preventDefault()
        setOpen(false)
        reset()
      }
    },
    [canEscape, reset]
  )

  const { trigger } = useMutation<NewThreadPayload>(
    '/threads',
    createNewThread,
    {
      mutatedBy: id,
    }
  )

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(async function (data) {
          await trigger({
            ...data,
            userId: user.id,
          })
          await onSubmitted?.()
          reset()
          setOpen(false)
        })}
        className="flex-1"
      >
        <div className="flex flex-col gap-1 w-full">
          {open && <span className="text-span text-xs">Anyone can reply</span>}

          <Controller
            control={control}
            name="textContent"
            render={({ field: { onChange, onBlur, value, name } }) => (
              <FormTextarea
                style={{
                  height: open ? '48px' : '40px',
                }}
                onEscape={onEscape}
                onFocus={() => setOpen(true)}
                placeholder="What's on your mind..."
                placeholderClassName={[open ? 'top-[0.5px]' : 'top-[11px]']}
                onBlur={onBlur}
                onChange={onChange}
                value={value}
                name={name}
              />
            )}
          />

          <MediaPreview />

          {open && (
            <div className="flex justify-between mt-2">
              <div className="flex gap-4 items-center">
                <UploadImageInput {...register('source')} />
                <CharacterCount control={control} />
              </div>
              <div className="space-x-2">
                {canEscape ? (
                  <RegularButton
                    type="button"
                    variant="underline"
                    className="py-1.5 px-2"
                    onClick={() => {
                      setOpen(false)
                      reset()
                    }}
                  >
                    Cancel
                  </RegularButton>
                ) : (
                  <Dialog.Close asChild>
                    <RegularButton
                      type="button"
                      className="py-1.5 px-2"
                      variant="underline"
                    >
                      Cancel
                    </RegularButton>
                  </Dialog.Close>
                )}
                <PostButton mutatedBy={id} />
              </div>
            </div>
          )}
        </div>
      </form>
    </FormProvider>
  )
}

function PostButton({ mutatedBy }: { mutatedBy: string }) {
  const {
    control,
    formState: { errors },
  } = useFormContext<NewThreadFormValues>()

  const input = useWatch({
    control,
    name: 'textContent',
  })

  const media = useWatch({
    control,
    name: 'source',
  })

  const { status } = useMutation('/threads')

  return (
    <RegularButton
      isLoading={status.state === 'loading' && status.mutatedBy === mutatedBy}
      loaderVariant="secondary"
      disabled={
        (!media && input.length === 0) || Boolean(errors['textContent'])
      }
    >
      Post
    </RegularButton>
  )
}
