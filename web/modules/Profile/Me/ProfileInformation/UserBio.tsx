import { FindUserResponse } from '@/pages/api/profile/[username]'

export function getDescription(user?: FindUserResponse) {
  const pronounOnly = user?.pronouns && !user?.profession && !user?.location
  const professionOnly = user?.profession && !user?.location && !user?.pronouns
  const locationOnly = user?.location && !user?.profession && !user?.pronouns

  const pronounAndProfession =
    user?.pronouns && user?.profession && !user?.location
  const professionAndLocation =
    user?.profession && user?.location && !user?.pronouns

  const nothing = !user?.profession && !user?.location && !user?.pronouns

  if (nothing) {
    return ''
  }

  if (professionOnly) {
    return user?.profession
  }

  if (locationOnly) {
    return user?.location
  }

  if (pronounOnly) {
    return user?.pronouns
  }

  if (professionAndLocation) {
    return `${user?.profession} in ${user?.location}`
  }

  if (pronounAndProfession) {
    return `${user?.profession}, ${user?.pronouns}`
  }

  return `${user?.profession} in ${user?.location}, ${user?.pronouns}`
}

export function UserBio({ user }: { user?: FindUserResponse }) {
  const description = getDescription(user)

  const website = user?.website?.replace('https://', '').replace('http://', '')

  const href =
    !website?.startsWith('http://') && !website?.startsWith('https://')
      ? 'https://' + website
      : website

  return (
    <div>
      <div className="text-2xl font-light">{user?.displayName}</div>
      <div className="text-sm text-soft-primary">{description}</div>
      {website && (
        <div className="mt-1.5">
          <a
            href={href}
            className="active:bg-website-active bg-website px-3 py-1 rounded-full text-xs font-light tracking-wide w-fit text-soft-primary"
            target="_blank"
          >
            {website}
          </a>
        </div>
      )}
    </div>
  )
}
