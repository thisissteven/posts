import Image from 'next/image'
import React from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useSWRConfig } from 'swr'

import { useOpenGraphData } from '@/hooks'

import { Close } from '@/components/Icons'

import { NewThreadFormValues } from './Form'

export function OpenGraphPreview() {
  const { control } = useFormContext<NewThreadFormValues>()

  const textContent = useWatch({
    control,
    name: 'textContent',
  })

  const { data, secureUrl, key } = useOpenGraphData(textContent)
  const { mutate } = useSWRConfig()

  if (!data || !secureUrl) return null

  const alt = data.ogTitle ?? secureUrl ?? 'Open Graph Image'
  const url = secureUrl.replace('https://', '')

  return (
    <a href={secureUrl} target="_blank" className="relative mt-2">
      <div className="rounded-2xl overflow-hidden bg-soft-background">
        <div className="relative pb-[52.5%]">
          {data.ogImage && (
            <Image src={data.ogImage} alt={alt} fill className="object-cover" />
          )}
        </div>
        <div className="pl-4 py-4 pr-2.5 overflow-hidden rounded-b-2xl border border-divider">
          <div className="line-clamp-1 text-sm font-light">{data.ogTitle}</div>
          <div className="line-clamp-1 text-sm font-light text-soft-primary tracking-wide">
            {data.ogDescription}
          </div>
          <div className="line-clamp-1 mt-2 text-xs font-light text-span">
            {url}
          </div>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation()
          mutate(key, undefined, {
            revalidate: false,
          })
        }}
        className="absolute active:bg-black/60 duration-200 left-0 top-0 mx-3 my-4 p-1.5 rounded-full bg-black/50"
      >
        <Close />
      </button>
    </a>
  )
}
