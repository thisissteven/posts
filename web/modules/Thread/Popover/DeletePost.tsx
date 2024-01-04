import React from 'react'

import { apiClient } from '@/lib'
import { useMutation } from '@/hooks'

import { Popover } from '@/components/UI'

export function DeletePost({
  threadId,
  onDelete,
}: {
  threadId: string
  onDelete: () => void
}) {
  const { trigger, status } = useMutation(
    `/threads/${threadId}`,
    async (url) => {
      return await apiClient.delete(url)
    }
  )

  return (
    <Popover.Item
      className="text-danger-soft"
      onSelect={async () => {
        try {
          await trigger()
        } finally {
          onDelete()
        }
      }}
    >
      {status.state === 'loading' ? 'Deleting...' : 'Delete Post'}
    </Popover.Item>
  )
}
