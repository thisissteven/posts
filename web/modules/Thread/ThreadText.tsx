import clsx from 'clsx'

import { getHref, isWebsite } from '@/lib'

export function ThreadText({
  textContent,
  textSize = 'small',
}: {
  textContent?: string
  textSize?: 'small' | 'normal'
}) {
  const lines = textContent?.split('\n') ?? []
  const hasLines = lines.length > 0

  if (hasLines) {
    return lines.map((line: string, index: number) => {
      const lastWordIndex = line.split(' ').length - 1
      return (
        <p
          key={index}
          className={clsx(
            'text-soft-primary font-light whitespace-pre-line break-words leading-6',
            textSize === 'small' ? 'text-sm' : 'text-base'
          )}
        >
          {line.split(' ').map((word: string, i: number) => {
            if (isWebsite(word)) {
              const href = getHref(word)
              return (
                <a
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                  href={href}
                  target="_blank"
                  key={i}
                  className="text-primary hover:underline underline-offset-[3px]"
                >
                  {word}
                  {i !== lastWordIndex && ' '}
                </a>
              )
            }
            return word + ' '
          })}
          {'\n'}
        </p>
      )
    })
  }

  return (
    <p
      className={clsx(
        'text-soft-primary font-light whitespace-pre-line break-words leading-6',
        textSize === 'small' ? 'text-sm' : 'text-base'
      )}
    >
      {textContent?.split(' ').map((word, i) => {
        if (isWebsite(word)) {
          const href = getHref(word)
          return (
            <a
              onClick={(e) => {
                e.stopPropagation()
              }}
              href={href}
              target="_blank"
              key={i}
              className="text-primary hover:underline underline-offset-[3px]"
            >
              {word}{' '}
            </a>
          )
        }
        return word + ' '
      })}
    </p>
  )
}
