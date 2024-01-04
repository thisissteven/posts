export type CommandMenuItemProps = {
  objectID: string
  avatarUrl: string | null
  displayName: string
  username: string
  bio: string | null
  onSelect?: (value: string) => void
  value?: string
}
