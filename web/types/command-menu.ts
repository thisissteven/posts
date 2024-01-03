export type CommandMenuItemProps = {
  avatar?: string | null
  displayName: string
  username: string
  description: string
  alt: string
  onSelect?: (value: string) => void
}
