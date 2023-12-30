import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import useSWR from 'swr'

import { getRelativeTimeString } from '@/lib'
import { useUser } from '@/hooks'

import { ThreadUserAvatar } from '@/components/UI'

import { Header } from '@/modules/Replies'

import { GetMessagesResponse } from '../api/message'

function RoomItem({
  room,
  lastMessage,
  me,
}: {
  room: GetMessagesResponse['rooms'][number]
  lastMessage: GetMessagesResponse['lastMessages'][number]
  me: {
    username: string
  }
}) {
  const isSender = me.username === room.sender.username

  const receiverUsername = isSender
    ? room.receiver.username
    : room.sender.username

  const isLastSender = lastMessage.sender.username === me.username

  const senderUsername = isLastSender && 'You:'

  const avatarUrl = isSender ? room.receiver.avatarUrl : room.sender.avatarUrl

  return (
    <li>
      <Link
        href={`/replies/${room.identifier}`}
        className="flex gap-3 px-6 py-3 items-center hover:bg-soft-black"
      >
        <ThreadUserAvatar
          threadUser={{
            avatarUrl: avatarUrl,
            username: receiverUsername!,
          }}
        />
        <div className="flex-1">
          <p className="text-sm leading-4">{receiverUsername}</p>
          <span className="text-sm font-light text-span overflow-hidden flex gap-1">
            {senderUsername}
            <span className="line-clamp-1">{lastMessage.content}</span>
          </span>
        </div>
        <span className="text-span text-xs self-start mt-2 font-light tracking-wide">
          {getRelativeTimeString(new Date(lastMessage.createdAt))}
        </span>
      </Link>
    </li>
  )
}

export default function Replies() {
  const { data } = useSWR<GetMessagesResponse>('/message')

  const { user } = useUser()

  return (
    <>
      <Head>
        <title>Replies</title>
      </Head>
      <Header />

      <ul>
        {data?.rooms.map((room, index) => {
          const lastMessage = data?.lastMessages[index]
          return (
            <RoomItem
              key={room.identifier}
              me={user}
              room={room}
              lastMessage={lastMessage}
            />
          )
        })}
      </ul>
    </>
  )
}
