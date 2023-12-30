import { getHref, isWebsite } from '@/lib'

export function ThreadText({ textContent }: { textContent?: string }) {
  const lines = textContent?.split('\n') ?? []
  const hasLines = lines.length > 0

  if (hasLines) {
    return lines.map((line: string, index: number) => {
      const lastWordIndex = line.split(' ').length - 1
      return (
        <p
          key={index}
          className="text-sm text-soft-primary font-light whitespace-pre-line break-all leading-6"
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
    <p className="text-sm text-soft-primary font-light whitespace-pre-line break-all leading-6">
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
