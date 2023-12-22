import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
} from 'react-hook-form'

import { useMutation } from '@/hooks'

import {
  Dialog,
  RegularButton,
  Textarea,
  UploadImageInput,
} from '@/components/UI'

import { NewThreadFormValues, newThreadSchema } from './Form'
import { MediaPreview } from './MediaPreview'

export function NewThreadTemplate({
  canEscape = true,
  onSubmitted,
}: {
  canEscape?: boolean
  onSubmitted?: () => void
}) {
  const [open, setOpen] = React.useState(false)

  const methods = useForm<NewThreadFormValues>({
    shouldUnregister: true,
    resolver: zodResolver(newThreadSchema),
    mode: 'onChange',
    defaultValues: {
      textContent: '',
      media: null,
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

  const { trigger: createNewThread } =
    useMutation<NewThreadFormValues>('/threads')

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(async function (data) {
          await createNewThread(data)
          setOpen(false)
          reset()
          onSubmitted?.()
        })}
        className="w-full"
      >
        <div className="flex flex-col gap-1 w-full">
          {open && <span className="text-span text-xs">Anyone can reply</span>}

          <Controller
            control={control}
            name="textContent"
            render={({ field: { onChange, onBlur, value, name } }) => (
              <Textarea
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
              <UploadImageInput {...register('media')} />
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
                <PostButton />
              </div>
            </div>
          )}
        </div>
      </form>
    </FormProvider>
  )
}

function PostButton() {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const input = useWatch({
    control,
    name: 'textContent',
  })

  const media = useWatch({
    control,
    name: 'media',
  })

  const { isLoading } = useMutation('/threads')

  return (
    <RegularButton
      isLoading={isLoading}
      disabled={
        !media && (input.length === 0 || Boolean(errors['textContent']))
      }
    >
      Post
    </RegularButton>
  )
}
