import { LinkButton, RegularButton } from '@/components/UI'

import { useAuth } from '@/modules/Auth'

export function BottomBanner() {
  const { isAuthenticated, openAuthDialog } = useAuth()

  if (isAuthenticated) return null

  return (
    <div className="xs:hidden absolute flex items-center justify-between inset-0 w-full h-full bg-background px-6">
      <p className="text-soft-primary text-sm">
        <LinkButton href="https://posts.cv" target="_blank">
          Posts
        </LinkButton>
        , a community app by{' '}
        <LinkButton href="https://read.cv" target="_blank">
          Read.cv
        </LinkButton>
      </p>

      <RegularButton onClick={openAuthDialog} className="text-xs font-medium">
        Log in
      </RegularButton>
    </div>
  )
}
