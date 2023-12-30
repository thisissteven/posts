import Image from 'next/image'
import React from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

import { getHref, isWebsite } from '@/lib'
import { useDebounce, useOpenGraphData } from '@/hooks'

import { Close, Globe } from '@/components/Icons'

import { NewThreadFormValues } from './Form'

export function OpenGraphPreview() {
  const { control, setValue } = useFormContext<NewThreadFormValues>()

  const textContent = useWatch({
    control,
    name: 'textContent',
  })

  const source = useWatch({
    control,
    name: 'source',
  })

  const embed = useWatch({
    control,
    name: 'embed',
  })

  const lines = textContent?.split('\n') ?? []
  const hasLines = lines.length > 0

  const lastLineIndex = lines.length - 1

  const textToCheck = hasLines ? lines[lastLineIndex] : textContent

  const href = getHref(textToCheck?.split(' ').find(isWebsite))

  const secureUrl = useDebounce(href, 500)

  const url = secureUrl?.replace('https://', '')

  const { data } = useOpenGraphData(secureUrl)

  React.useEffect(() => {
    if (data?.secureUrl) {
      setValue('embed', {
        url: url ?? data.secureUrl,
        secureUrl: data.secureUrl,
        title: data.ogTitle,
        description: data.ogDescription,
        image: data.ogImage,
      })
    }

    if (source || !data) {
      setValue('embed', undefined)
    }
  }, [data, setValue, source, url])

  if (!embed || source) return null

  const alt = embed?.title ?? secureUrl ?? 'Open Graph Image'

  if (!embed?.image) {
    return (
      <div className="relative mt-2">
        <a href={secureUrl} target="_blank">
          <div className="rounded-2xl overflow-hidden bg-soft-background flex border border-popover">
            <div className="relative w-[108px] aspect-square grid place-items-center border-r border-popover">
              <Globe />
            </div>
            <div className="pl-4 py-4 pr-2.5 overflow-hidden rounded-b-2xl">
              <div className="line-clamp-1 text-sm font-light">
                {embed?.title}
              </div>
              <div className="line-clamp-1 text-sm font-light text-soft-primary tracking-wide">
                {embed?.description}
              </div>
              <div className="line-clamp-1 mt-2 text-xs font-light text-span">
                {url}
              </div>
            </div>
          </div>
        </a>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setValue('embed', undefined)
          }}
          className="absolute active:bg-black/60 duration-200 left-0 top-0 mx-3 my-4 p-1.5 rounded-full bg-black/50"
        >
          <Close />
        </button>
      </div>
    )
  }

  return (
    <div className="relative mt-2">
      <a href={secureUrl} target="_blank">
        <div className="rounded-2xl overflow-hidden bg-soft-background">
          <div className="relative pb-[52.5%]">
            <Image src={embed.image} alt={alt} fill className="object-cover" />
          </div>
          <div className="pl-4 py-4 pr-2.5 overflow-hidden rounded-b-2xl border border-popover">
            <div className="line-clamp-1 text-sm font-light">
              {embed?.title}
            </div>
            <div className="line-clamp-1 text-sm font-light text-soft-primary tracking-wide">
              {embed?.description}
            </div>
            <div className="line-clamp-1 mt-2 text-xs font-light text-span">
              {url}
            </div>
          </div>
        </div>
      </a>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          setValue('embed', undefined)
        }}
        className="absolute active:bg-black/60 duration-200 left-0 top-0 mx-3 my-4 p-1.5 rounded-full bg-black/50"
      >
        <Close />
      </button>
    </div>
  )
}
