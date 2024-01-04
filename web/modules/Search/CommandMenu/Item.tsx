/* eslint-disable @next/next/no-img-element */
import { Command } from 'cmdk'
import Image from 'next/image'
import React from 'react'

import { CommandMenuItemProps } from '@/types'

export function CommandMenuItem({
  avatarUrl,
  username,
  displayName,
  bio,
  onSelect,
  value = `${displayName} ${username} ${bio}`,
}: CommandMenuItemProps) {
  return (
    <Command.Item
      value={value}
      onSelect={onSelect}
      className="cursor-pointer w-full px-2 py-1.5 flex items-center rounded-xl data-[selected=true]:bg-divider active:bg-divider select-none text-sm font-light gap-3"
    >
      <div className="shrink-0 w-9 h-9 rounded-full bg-background overflow-hidden">
        {avatarUrl ? (
          <Image
            draggable={false}
            src={avatarUrl}
            alt={displayName}
            width={36}
            height={36}
          />
        ) : (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-9 h-9"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M16 16H0V0H16V16ZM11.8437 10.8927C12.383 11.3431 12.383 12.1569 11.8437 12.6073C10.8027 13.4768 9.46243 14 8 14C6.53757 14 5.19734 13.4768 4.15629 12.6073C3.61696 12.1569 3.61696 11.3431 4.15629 10.8927C5.19734 10.0232 6.53757 9.5 8 9.5C9.46243 9.5 10.8027 10.0232 11.8437 10.8927ZM10 6C10 7.10457 9.10457 8 8 8C6.89543 8 6 7.10457 6 6C6 4.89543 6.89543 4 8 4C9.10457 4 10 4.89543 10 6Z"
              fill="#333"
            ></path>
          </svg>
        )}
      </div>
      <div className="flex-1">
        <div className="text-primary">{displayName}</div>
        <div className="text-[11.5px] -mt-0.5 line-clamp-1">
          {bio ?? username}
        </div>
      </div>
    </Command.Item>
  )
}
