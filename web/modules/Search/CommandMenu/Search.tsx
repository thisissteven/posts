import { Command } from 'cmdk'
import React from 'react'

function SearchIcon() {
  return (
    <svg
      className="shrink-0"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.74 10.68a6.001 6.001 0 10-1.06 1.06l3.037 3.038a.75.75 0 001.061-1.06L11.74 10.68zm-1.558-6.862a4.5 4.5 0 11-6.364 6.364 4.5 4.5 0 016.364-6.364z"
        fill="#888"
      ></path>
    </svg>
  )
}

export function CommandMenuSearch({
  value,
  onValueChange,
}: {
  value: string
  onValueChange: (value: string) => void
}) {
  return (
    <div className="px-4 py-3.5 flex items-center gap-2">
      <SearchIcon />
      <Command.Input
        className="w-full focus:outline-none tracking-wide bg-transparent placeholder:text-placeholder text-sm font-light"
        placeholder="Search people or teams..."
        value={value}
        onValueChange={onValueChange}
      />
    </div>
  )
}
