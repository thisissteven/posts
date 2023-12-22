import { Command } from 'cmdk'
import React from 'react'

export default function CommandNoResults() {
  return (
    <Command.Empty className="text-span text-sm ml-2 mb-4 font-light">
      No results found.
    </Command.Empty>
  )
}
