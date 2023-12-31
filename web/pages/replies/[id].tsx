import clsx from 'clsx'
import { useParams } from 'next/navigation'
import * as React from 'react'

import { CHAT_EVENT, supabaseClient } from '@/lib'
import { useDelayedSWR, useMutation, useUser } from '@/hooks'

import { Airplane } from '@/components/Icons'
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
    roomId && user.id ? `/message/${getReceiverId(roomId, user.id)}` : null,
    {
      duration: 300,
    }
  )

  const isSender = data?.roomDetails?.senderId === user.id

  const from = isSender
    ? data?.roomDetails?.receiver.username
    : data?.roomDetails?.sender.username

  const fromId = isSender
    ? data?.roomDetails?.receiver.id
    : data?.roomDetails?.sender.id

  const pageTitle = data ? `Replies from: ${from}` : 'Replies'

  return (
    <>
      <Seo title={pageTitle} />
      <DetailHeader from={from} />

      <div
        className={clsx(
          'duration-300',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
      >
        <div className="h-[calc(100vh-195px)] xs:h-[calc(100vh-145px)]">
          {!!data && <ChatRoom data={data} roomId={roomId} />}
        </div>

        <ChatInput roomId={roomId} fromId={fromId} />
      </div>
    </>
  )
}

const ChatInput = React.memo(function ChatInput({
  roomId,
  fromId,
}: {
  roomId?: string
  fromId?: string
}) {
  const { trigger } = useMutation<{ content: string }>(`/message/${fromId}`)

  const [content, setContent] = React.useState('')

  const textAreaRef =
    React.useRef() as React.MutableRefObject<HTMLTextAreaElement>

  const buttonRef = React.useRef() as React.MutableRefObject<HTMLButtonElement>

  const sendMessage = async () => {
    if (!roomId) return
    const channel = supabaseClient.channel(roomId, {
      config: {
        broadcast: {
          self: true,
        },
      },
    })

    const response = await trigger(
      { content },
      {
        revalidate: false,
      }
    )

    await channel.send({
      type: 'broadcast',
      event: CHAT_EVENT,
      payload: response.data,
    })
  }

  if (!fromId) return null

  return (
    <div className="sticky bg-background px-4 xs:px-10 pt-4 pb-4 xs:pb-8 bottom-[61px] xs:bottom-0 left-0">
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          if (content.length === 0) return
          await sendMessage()
          setContent('')
          textAreaRef.current.style.height = 'auto'
          textAreaRef.current.style.height = '36px'
        }}
        className="flex items-end gap-4"
      >
        <textarea
          ref={textAreaRef}
          className="placeholder:text-light-span bg-soft-background rounded-md px-4 py-2 scrollbar-none text-sm w-full focus:outline-none resize-none font-light"
          spellCheck={false}
          value={content}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              buttonRef.current.click()
            }
          }}
          onKeyUp={(e) => {
            if (e.key === 'Enter' && e.shiftKey) {
              textAreaRef.current.style.height = 'auto'
              textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`
            }
          }}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setContent(e.target.value)
            textAreaRef.current.style.height = 'auto'
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`
          }}
          placeholder="Ask anything..."
          rows={1}
        />
        <button ref={buttonRef} className="mb-2 shrink-0">
          <Airplane />
        </button>
      </form>
    </div>
  )
})
