import { DefaultSession, User } from 'next-auth'
import { AdapterUser } from 'next-auth/adapters'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: User & DefaultSession['user']
  }

  interface User {
    hashedPassword: unknown
    avatarUrl?: string | null
    displayName?: string | null
    username?: string | null
    createdAt?: Date | null
    role: 'USER' | 'ADMIN'
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    user: {
      hashedPassword: unknown
      avatarUrl?: string | null
    } & (User | AdapterUser)
  }
}
