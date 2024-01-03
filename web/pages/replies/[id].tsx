import clsx from 'clsx'
import { useParams } from 'next/navigation'
import React from 'react'

import { useDelayedSWR, useUser } from '@/hooks'

import { Seo } from '@/components/Seo'

import { ChatRoom, DetailHeader } from '@/modules/Replies'

import {
  getReceiverId,
  GetRoomMessagesResponse,
} from '../api/message/[receiverId]'

export default function ReplyPage() {
  const params = useParams()
  const roomId = params?.id as string

  const { user } = useUser()

  const { data, isLoading } = useDelayedSWR<GetRoomMessagesResponse>(
    () =>
      roomId && user.id ? `/message/${getReceiverId(roomId, user.id)}` : null,
    {
      duration: 300,
    }
  )

  const isSender = data?.roomDetails?.senderId === user.id

  const from = isSender
    ? data?.roomDetails?.receiver.username
    : data?.roomDetails?.sender.username

  const pageTitle = data ? `Replies from: ${from}` : 'Replies'

  return (
    <>
      <Seo title={pageTitle} />
      <DetailHeader from={from} />

      <div
        className={clsx(
          'duration-300 mt-1',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
      >
        <ChatRoom data={data} />
      </div>
    </>
  )
}
