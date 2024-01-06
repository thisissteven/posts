import { format } from 'date-fns'

import { GetRoomMessagesResponse } from '@/pages/api/message/[receiverId]'

const toReadableDate = (datetime: string | Date) =>
  format(datetime, 'MMMM d, yyyy')
const toAMPM = (datetime: string | Date) => format(datetime, 'h:mm a')

const getTimeDiffInMins = (
  firstDate: string | Date,
  secondDate: string | Date
) => {
  const firstTime = new Date(firstDate).getTime()
  const secondTime = new Date(secondDate).getTime()

  const differenceMs = firstTime - secondTime

  return Math.abs(differenceMs / (1000 * 60))
}

const MAX_TIME_DIFF_IN_MINS = 5

export type MessageGroupByDate = {
  date: string
  messageGroups: Array<{
    id: string
    username: string | null
    avatarUrl: string | null
    messages: Array<{
      id: string
      time: string
      createdAt: string | Date
      content: string
    }>
  }>
}

export const CHAT_EVENT = 'chat-event'

export function groupMessagesByDate(
  rawMessages: GetRoomMessagesResponse['messages'],
  previousMessages: MessageGroupByDate[] = []
) {
  const messageGroupsByDate: MessageGroupByDate[] = previousMessages

  for (const rawMessage of rawMessages) {
    // 1. grab the date, { time, content }, { avatarUrl, username } of each message
    const createdAt = rawMessage.createdAt
    const date = toReadableDate(createdAt)
    const content = rawMessage.content
    const time = toAMPM(rawMessage.createdAt)
    const { avatarUrl, username } = rawMessage.sender

    // 2. check the last item of the messageGroups array

    const lastMessageGroupByDate =
      messageGroupsByDate[messageGroupsByDate.length - 1]

    // 3. only execute on first iteration, or when the date is not the same
    if (!lastMessageGroupByDate || lastMessageGroupByDate.date !== date) {
      messageGroupsByDate.push({
        date,
        messageGroups: [
          {
            id: rawMessage.id,
            avatarUrl,
            username,
            messages: [
              {
                id: rawMessage.id,
                content,
                time,
                createdAt,
              },
            ],
          },
        ],
      })
      continue
    }

    // 4. if the last item in messageGroups > messages array has the same sender and the time difference is <5mins with the current time, put it there

    const lastMessageGroupIndex =
      lastMessageGroupByDate.messageGroups.length - 1
    const lastMessageGroup =
      lastMessageGroupByDate.messageGroups[lastMessageGroupIndex]

    const lastMessageIndex = lastMessageGroup.messages.length - 1
    const lastMessage = lastMessageGroup.messages[lastMessageIndex]

    const timeDiffInMins = getTimeDiffInMins(lastMessage.createdAt, createdAt)

    if (
      lastMessageGroup.username === username &&
      timeDiffInMins < MAX_TIME_DIFF_IN_MINS
    ) {
      lastMessageGroup.messages.push({
        id: rawMessage.id,
        content,
        time,
        createdAt,
      })
      continue
    }

    // 5. else, create a new item in the messageGroups array
    lastMessageGroupByDate.messageGroups.push({
      id: rawMessage.id,
      avatarUrl,
      username,
      messages: [
        {
          id: rawMessage.id,
          content,
          time,
          createdAt,
        },
      ],
    })
  }

  return messageGroupsByDate
}
