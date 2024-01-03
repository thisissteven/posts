import clsx from 'clsx'
import React from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

import { cn, isWebsite } from '@/lib'

type TextareaProps = {
  onEscape?: (e: KeyboardEvent) => void
  minHeight?: string
  placeholderClassName?: string | boolean | (string | boolean)[]
} & React.ComponentPropsWithoutRef<'textarea'>

export function Textarea({
  className,
  placeholderClassName,
  minHeight = '40px',
  onEscape = (_) => {},
  onChange,
  ...rest
}: TextareaProps) {
  const textAreaRef =
    React.useRef() as React.MutableRefObject<HTMLTextAreaElement>

  React.useEffect(() => {
    const textArea = textAreaRef.current

    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        textAreaRef.current.blur()
        onEscape(e)
      }
    }

    textArea.addEventListener('keydown', handleEscape)

    return () => {
      textArea.removeEventListener('keydown', handleEscape)
    }
  }, [onEscape])

  return (
    <div className="relative w-full">
      <textarea
        ref={textAreaRef}
        onChange={(e) => {
          if (onChange) onChange(e)
          textAreaRef.current.style.height = minHeight
          textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`
        }}
        className={cn(
          'bg-transparent placeholder:text-span resize-none focus:outline-none font-light text-soft-primary w-full',
          className
        )}
        {...rest}
      />
    </div>
  )
}

// use this when working with react-hook-form
export function FormTextarea({
  className,
  placeholder,
  placeholderClassName,
  minHeight = '48px',
  onEscape = (_) => {},
  onChange,
  ...rest
}: TextareaProps) {
  const textAreaRef =
    React.useRef() as React.MutableRefObject<HTMLTextAreaElement>

  React.useEffect(() => {
    const textArea = textAreaRef.current

    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        textAreaRef.current.blur()
        onEscape(e)
      }
    }

    textArea.addEventListener('keydown', handleEscape)

    return () => {
      textArea.removeEventListener('keydown', handleEscape)
    }
  }, [onEscape])

  const { control } = useFormContext()

  const value = useWatch({
    control,
    name: rest.name as string,
  })

  const lines = value?.split('\n') ?? []
  const hasLines = lines.length > 0

  return (
    <div className="relative">
      <span
        aria-hidden
        className={cn(
          'text-span absolute whitespace-nowrap pointer-events-none font-light left-0',
          value?.length > 0 && 'hidden',
          placeholderClassName
        )}
      >
        {placeholder}
      </span>
      <textarea
        ref={textAreaRef}
        onChange={(e) => {
          if (onChange) onChange(e)
          textAreaRef.current.style.height = minHeight
          textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`
        }}
        style={{
          color: 'transparent',
        }}
        className="relative bg-transparent whitespace-pre-line break-words placeholder:text-span text-soft-primary resize-none focus:outline-none font-light w-full"
        {...rest}
        spellCheck={false}
      />
      <div
        style={{
          minHeight,
        }}
        className={cn(
          'absolute h-full inset-0 font-light w-full break-words pointer-events-none text-transparent',
          className
        )}
      >
        {hasLines &&
          lines.map((line: string, index: number) => {
            return (
              <div
                key={index}
                className="whitespace-pre-line break-words leading-6"
              >
                {line.split(' ').map((word: string, i: number) => {
                  return (
                    <span
                      key={i}
                      className={clsx(isWebsite(word) ? 'text-primary' : '')}
                    >
                      {word}{' '}
                    </span>
                  )
                })}
                {'\n'}
              </div>
            )
          })}

        {!hasLines &&
          value.split(' ').map((word: string, i: number) => {
            return (
              <span
                key={i}
                className={clsx(isWebsite(word) ? 'text-primary' : '')}
              >
                {word}{' '}
              </span>
            )
          })}
      </div>
    </div>
  )
}
