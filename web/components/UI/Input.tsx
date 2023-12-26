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
  watchLength?: boolean
  withSuccessIndicator?: boolean
} & React.ComponentPropsWithoutRef<'input'>

// Use this when working with react-hook-form
export const FormInput = React.forwardRef(function FormInput(
  {
    className,
    label,
    watchLength = false,
    required,
    withSuccessIndicator = false,
    ...rest
  }: FormInputProps,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  const name = rest.name as string

  if (!name) {
    throw new Error('FormInput must have a name')
  }

  const {
    control,
    formState: { errors, dirtyFields, isDirty },
  } = useFormContext()

  const value = useWatch({
    control,
    name,
  })

  const errorMessage = errors[name]?.message as string

  return (
    <div className="space-y-1">
      <div className="flex px-0.5">
        {label && (
          <label htmlFor={name} className="text-xs text-soft-primary flex-1">
            {label}
            {required && '*'}
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
          id={name}
          ref={ref}
          className={cn(
            'w-full px-3 py-2 text-sm rounded-lg bg-soft-background placeholder:text-light-span focus:outline-none',
            errorMessage && value.length > 0 && 'ring-2 ring-danger',
            className
          )}
        />
        {withSuccessIndicator && (
          <div
            className={cn(
              'absolute origin-center right-3 top-1/2 -translate-y-1/2 transition',
              !errorMessage && dirtyFields[name]
                ? 'opacity-100 scale-125'
                : 'opacity-0 scale-0'
            )}
          >
            <Success />
          </div>
        )}
      </div>
    </div>
  )
})
