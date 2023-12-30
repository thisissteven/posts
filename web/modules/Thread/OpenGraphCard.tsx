import Image from 'next/image'
import React from 'react'

import { Globe } from '@/components/Icons'

import { ThreadItem } from '@/types'

export function OpenGraphCard({ embed }: { embed?: ThreadItem['embed'] }) {
  if (!embed) return null

  if (!embed?.image) {
    return (
      <div className="relative mt-3">
        <a
          onClick={(e) => {
            e.stopPropagation()
          }}
          href={embed?.secureUrl}
          target="_blank"
        >
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
                {embed?.url}
              </div>
            </div>
          </div>
        </a>
      </div>
    )
  }

  return (
    <div className="relative mt-3">
      <a
        onClick={(e) => {
          e.stopPropagation()
        }}
        href={embed?.secureUrl}
        target="_blank"
      >
        <div className="rounded-2xl overflow-hidden bg-soft-background">
          <div className="relative pb-[52.5%]">
            <Image
              src={embed.image}
              alt={embed.title ?? embed.secureUrl ?? 'Open Graph Image'}
              fill
              className="object-cover"
            />
          </div>
          <div className="pl-4 py-4 pr-2.5 overflow-hidden rounded-b-2xl border border-popover">
            <div className="line-clamp-1 text-sm font-light">
              {embed?.title}
            </div>
            <div className="line-clamp-1 text-sm font-light text-soft-primary tracking-wide">
              {embed?.description}
            </div>
            <div className="line-clamp-1 mt-2 text-xs font-light text-span">
              {embed?.url}
            </div>
          </div>
        </div>
      </a>
    </div>
  )
}
