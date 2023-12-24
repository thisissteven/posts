import React from 'react'
import useSWRImmutable from 'swr/immutable'

import { useMutation } from '@/hooks'

import { Input, RegularButton } from '@/components/UI'

type Payload = {
  message: string
  from: string
}

export default function Experiment() {
  const [message, setMessage] = React.useState<string>('')
  const [from, setFrom] = React.useState<string>('')

  const { trigger, status } = useMutation<Payload>('/message')

  const { data, mutate } = useSWRImmutable('/just-a-demo', () => {
    return {
      message: 'Hello',
      from: 'World',
    }
  })

  return (
    <div className="p-8">
      <button
        onClick={() => {
          mutate(
            {
              message: 'Hello 2',
              from: 'World 2',
            },
            {
              revalidate: false,
            }
          )
        }}
      >
        just trying
      </button>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          await trigger({
            message,
            from,
          })
        }}
        className="flex flex-col items-end gap-4"
      >
        <div className="space-y-1 w-full">
          <label htmlFor="message">Message</label>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            id="message"
            placeholder="Enter your message"
          />
        </div>

        <div className="space-y-1 w-full">
          <label htmlFor="from">From</label>
          <Input
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            id="from"
            placeholder="Who are you?"
          />
        </div>

        <RegularButton
          variant="secondary"
          isLoading={status.state === 'loading'}
        >
          Submit
        </RegularButton>
      </form>
    </div>
  )
}
