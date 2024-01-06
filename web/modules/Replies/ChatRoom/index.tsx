import React from 'react'
import useSWRImmutable from 'swr/immutable'

import { CHAT_EVENT, getAMPM, supabaseClient } from '@/lib'
import { groupMessagesByDate, MessageGroupByDate } from '@/lib/utils/message'

import { SmallAvatar } from '@/components/UI'

import { GetRoomMessagesResponse } from '@/pages/api/message/[receiverId]'

export function ChatRoom({
  data,
  roomId,
}: {
  data: GetRoomMessagesResponse
  roomId: string
}) {
  const containerRef = React.useRef<HTMLDivElement>(null)

  const rerender = React.useReducer(() => ({}), {})[1]

  const { data: messages, mutate } = useSWRImmutable<MessageGroupByDate[]>(
    roomId,
    () => groupMessagesByDate(data.messages)
  )

  React.useEffect(() => {
    if (containerRef.current && messages) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
      })
    }
  }, [messages])

  React.useEffect(() => {
    mutate(groupMessagesByDate(data.messages))
  }, [data, mutate])

  React.useEffect(() => {
    const channel = supabaseClient.channel(roomId)

    function messageReceived(
      message: GetRoomMessagesResponse['messages'][number]
    ) {
      mutate((oldMessages) => groupMessagesByDate([message], oldMessages))
      rerender()
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollTo({
            top: containerRef.current.scrollHeight,
            behavior: 'smooth',
          })
        }
      })
    }

    const realtimeChannel = channel
      .on('broadcast', { event: CHAT_EVENT }, ({ payload }) => {
        messageReceived(payload)
      })
      .subscribe()

    return () => {
      realtimeChannel.unsubscribe()
    }
  }, [messages, mutate, rerender, roomId])

  return (
    <div
      ref={containerRef}
      className="py-8 px-4 xs:px-8 space-y-5 overflow-y-auto h-full scrollbar-none"
    >
      {messages?.map((messageGroup) => {
        return (
          <div key={messageGroup.date} className="space-y-2">
            <div className="mx-auto text-xs text-soft-primary w-fit">
              {messageGroup.date}
            </div>
            {messageGroup.messageGroups.map((messageGroupItem) => {
              const { username, avatarUrl } = messageGroupItem

              return (
                <div
                  key={messageGroupItem.id}
                  className="flex gap-2 items-start pt-4"
                >
                  <SmallAvatar alt={username} avatarUrl={avatarUrl} />
                  <div className="flex-1">
                    {messageGroupItem.messages.map((message) => {
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
      })}
    </div>
  )
}
