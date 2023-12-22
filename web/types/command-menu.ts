export type CommandMenuItemProps = {
  avatar: string
  displayName: string
  username: string
  description: string
  alt: string
  onSelect?: (value: string) => void
}
