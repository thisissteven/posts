/* eslint-disable @next/next/no-img-element */
import { Command } from 'cmdk'
import Image from 'next/image'
import React from 'react'

import { CommandMenuItemProps } from '@/types'

export function CommandMenuItem({
  avatar,
  username,
  displayName,
  description,
  alt,
  onSelect,
}: CommandMenuItemProps) {
  return (
    <Command.Item
      value={`${displayName} ${username}`}
      onSelect={onSelect}
      className="cursor-pointer w-full px-2 py-1.5 flex items-center rounded-xl data-[selected=true]:bg-divider active:bg-divider select-none text-sm font-light gap-3"
    >
      <div className="shrink-0 w-9 h-9 rounded-full bg-divider overflow-hidden">
        <Image
          draggable={false}
          src={avatar}
          alt={alt}
          width={36}
          height={36}
        />
      </div>
      <div className="flex-1">
        <div className="text-primary">{displayName}</div>
        <div className="text-[11.5px] -mt-0.5 line-clamp-1">{description}</div>
      </div>
    </Command.Item>
  )
}
