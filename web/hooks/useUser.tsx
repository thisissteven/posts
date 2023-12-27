import { useSession } from 'next-auth/react'
import * as React from 'react'

type UpdateUserArgs = {
  avatarUrl?: string
  displayName?: string
  username?: string
}

export function useUser() {
  const { data: session, status, update } = useSession()

  const user = session?.user

  const isAuthenticated = React.useMemo(
    () => status === 'authenticated',
    [status]
  )

  return {
    user: {
      avatarUrl: user?.avatarUrl,
      displayName: user?.displayName,
      username: user?.username ?? '',
      id: user?.id ?? '',
      role: user?.role,
      email: user?.email ?? '',
    },
    status,
    updateUser: async (args: UpdateUserArgs) => {
      const sessionObj = {
        ...session,
        user: {
          ...session?.user,
          ...args,
        },
      }

      await update(sessionObj)
    },
    isAuthenticated,
    isOnboarded: Boolean(user?.displayName && user?.username),
  }
}
