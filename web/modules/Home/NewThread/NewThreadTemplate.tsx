import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import React from 'react'
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
  useFormContext,
  useWatch,
} from 'react-hook-form'

import {
  Dialog,
  RegularButton,
  Textarea,
  UploadImageInput,
} from '@/components/UI'

import { NewThreadFormValues, newThreadSchema } from './Form'

export function NewThreadTemplate({
  canEscape = true,
  onSubmit,
}: {
  canEscape?: boolean
  onSubmit: SubmitHandler<NewThreadFormValues>
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

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(async function (data) {
          await onSubmit(data)
          setOpen(false)
          reset()
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

const MediaPreview = () => {
  const { control } = useFormContext()

  const input = useWatch({
    control,
    name: 'media',
  })

  const hasMedia = Boolean(input && input.length > 0)
  const mediaUrl = React.useMemo(
    () => input && URL.createObjectURL(input[0]),
    [input]
  )

  if (!hasMedia) return null

  const mediaType = input && input[0]?.type.split('/')[0]

  return <Media src={mediaUrl} type={mediaType} />
}

const Media = React.memo(
  ({ src, type }: { src: string; type: 'video' | 'image' }) => {
    return (
      <div className="relative my-1 rounded-lg overflow-hidden">
        {type === 'video' && (
          <video
            src={src}
            className="object-cover w-full h-full"
            autoPlay
            playsInline
            loop
          />
        )}

        {type === 'image' && (
          <Image
            src={src}
            width={300}
            height={200}
            alt="image"
            className="object-cover w-full h-full"
          />
        )}
      </div>
    )
  },
  (prevProps, nextProps) =>
    prevProps.src === nextProps.src && prevProps.type === nextProps.type
)

function PostButton() {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const input = useWatch({
    control,
    name: 'textContent',
  })

  return (
    <RegularButton
      disabled={input.length === 0 || Boolean(errors['textContent'])}
    >
      Post
    </RegularButton>
  )
}
