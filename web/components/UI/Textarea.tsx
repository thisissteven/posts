import clsx from 'clsx'
import React from 'react'

type TextareaProps = {
  onEscape?: (e: KeyboardEvent) => void
  minHeight?: string
  placeholderClassName?: string | boolean | (string | boolean)[]
} & React.ComponentPropsWithoutRef<'textarea'>

export function Textarea({
  className,
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

  return (
    <div className="relative">
      <textarea
        ref={textAreaRef}
        onChange={(e) => {
          if (onChange) onChange(e)
          textAreaRef.current.style.height = minHeight
          textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`
        }}
        className={clsx(
          'bg-transparent placeholder:text-transparent resize-none focus:outline-none font-light text-soft-primary w-full',
          className
        )}
        {...rest}
      />
      <span
        aria-hidden
        className={clsx(
          'text-span absolute whitespace-nowrap pointer-events-none font-light left-0',
          placeholderClassName
        )}
      >
        What&apos;s on your mind...
      </span>
    </div>
  )
}
