import React from 'react'

import { getAMPM, getRelativeTimeString } from '@/lib'

import { SmallAvatar } from '@/components/UI'

import { GetRoomMessagesResponse } from '@/pages/api/message/[receiverId]'

type GroupedMessages = {
  [timeString: string]: GetRoomMessagesResponse['messages'][number][]
}

export function ChatRoom({ data }: { data?: GetRoomMessagesResponse }) {
  if (!data) return null

  // Group messages by time string
  const groupedMessages: GroupedMessages = data.messages.reduce(
    (groups, message) => {
      const timeString = getRelativeTimeString(new Date(message.createdAt))
      const timeSenderString = `${timeString}-${message.sender.username}`

      if (!groups[timeSenderString]) {
        groups[timeSenderString] = []
      }

      groups[timeSenderString].push(message)
      return groups
    },
    {} as GroupedMessages
  )

  // Create a sorted array based on timeSenderString keys
  const sortedMessages = Object.keys(groupedMessages)
    .sort()
    .map((timeSenderString) => ({
      timeSenderString,
      messages: groupedMessages[timeSenderString],
    }))

  return (
    <div className="p-8 space-y-5">
      {sortedMessages.map((messageGroup) => {
        const alt = messageGroup.messages[0].sender.username
        const avatarUrl = messageGroup.messages[0].sender.avatarUrl
        return (
          <div
            key={messageGroup.timeSenderString}
            className="flex gap-2 items-start"
          >
            <SmallAvatar alt={alt} avatarUrl={avatarUrl} />
            <div className="flex-1">
              {messageGroup.messages.map((message) => {
                return (
                  <div
                    key={message.id}
                    className="flex items-center gap-3 group py-1"
                  >
                    <p className="text-sm font-light text-soft-primary flex-1">
                      {message.content}
                    </p>
                    <div className="mt-2 text-xs font-light text-span opacity-0 group-hover:opacity-100 transition">
                      {getAMPM(new Date(message.createdAt))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
