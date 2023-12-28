import { PrismaAdapter } from '@next-auth/prisma-adapter'
import NextAuth, { AuthOptions } from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import GoogleProvider from 'next-auth/providers/google'

import { prisma } from '@/lib'

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      maxAge: 10 * 60,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      if (trigger === 'update') {
        const username = session.user.username
        const displayName = session.user.displayName
        const avatarUrl = session.user.avatarUrl

        await prisma.user.update({
          where: {
            id: token.user.id,
          },
          data: {
            username,
            displayName,
            avatarUrl,
          },
        })

        if (token.user) {
          token.user = {
            ...token.user,
            username,
            displayName,
            avatarUrl,
          }
        }
      } else {
        user && (token.user = user)
      }
      return token
    },
    session: async ({ session, token }) => {
      session.user = token.user

      return session
    },
  },
  pages: {
    signIn: '/',
    error: '/',
    verifyRequest: '/',
  },
  // debug: process.env.NODE_ENV === "development",
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)
