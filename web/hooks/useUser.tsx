import { useSession } from 'next-auth/react'
import * as React from 'react'

type UpdateUserArgs = {
  avatarUrl?: string | null
  displayName?: string
  username?: string
}

export function useDelayedIsAuthenticated() {
  const { status } = useSession()

  const [isAuthenticated, setIsAuthenticated] = React.useState(
    status === 'authenticated'
  )

  React.useEffect(() => {
    let timeout: NodeJS.Timeout
    if (status === 'loading' || status === 'unauthenticated') {
      timeout = setTimeout(() => {
        setIsAuthenticated(false)
      }, 300)
    } else {
      setIsAuthenticated(true)
    }

    return () => clearTimeout(timeout)
  }, [status])

  return isAuthenticated
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
      createdAt: user?.createdAt,
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
