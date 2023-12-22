import React from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

import { cn } from '@/lib'

import { Success } from '../Icons'

export const Input = React.forwardRef(function Input(
  { className, ...rest }: React.ComponentPropsWithoutRef<'input'>,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  return (
    <input
      ref={ref}
      className={cn(
        'w-full px-3 py-2 text-sm rounded-lg bg-soft-background placeholder:text-span focus:outline-none',
        className
      )}
      {...rest}
    />
  )
})

type FormInputProps = {
  label?: string
  id: string
  watchLength?: boolean
} & React.ComponentPropsWithoutRef<'input'>

// Use this when working with react-hook-form
export const FormInput = ({
  className,
  label,
  id,
  watchLength = false,
  ...rest
}: FormInputProps) => {
  const {
    register,
    control,
    formState: { errors, dirtyFields },
  } = useFormContext()

  const value = useWatch({
    control,
    name: id,
  })

  const errorMessage = errors[id]?.message as string

  return (
    <div className="space-y-1">
      <div className="flex px-0.5">
        {label && (
          <label htmlFor={id} className="text-xs text-soft-primary flex-1">
            {label}
          </label>
        )}
        {watchLength ? (
          <span className="text-xs font-light text-span">
            {value.length} of {rest.maxLength}
          </span>
        ) : (
          value.length > 0 && (
            <span className="text-xs text-danger-soft">{errorMessage}</span>
          )
        )}
      </div>
      <div className="relative">
        <input
          {...rest}
          id={id}
          {...register(id)}
          className={cn(
            'w-full px-3 py-2 text-sm rounded-lg bg-soft-background placeholder:text-span focus:outline-none',
            errorMessage && value.length > 0 && 'ring-2 ring-danger',
            className
          )}
        />
        <div
          className={cn(
            'absolute animate-in origin-center right-3 top-1/2 -translate-y-1/2 transition',
            !errorMessage && dirtyFields[id]
              ? 'opacity-100 scale-125'
              : 'opacity-0 scale-0'
          )}
        >
          <Success />
        </div>
      </div>
    </div>
  )
}
