import React from 'react'

import { apiClient } from '@/lib'

import { Popover } from '@/components/UI'

export function DeletePost({
  threadId,
  onDelete,
}: {
  threadId: string
  onDelete: () => void
}) {
  return (
    <Popover.Item
      className="text-danger-soft"
      onSelect={async () => {
        await apiClient.delete(`/threads/${threadId}`)
        onDelete()
      }}
    >
      Delete Post
    </Popover.Item>
  )
}
