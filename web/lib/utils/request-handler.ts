import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession, Session } from 'next-auth'

import { authOptions } from '@/pages/api/auth/[...nextauth]'

type Role = 'USER' | 'ADMIN' | 'PUBLIC'
type HttpMethods = 'GET' | 'POST' | 'PUT' | 'DELETE'

type AllowedRoles = {
  [method in HttpMethods]?: Role[]
}

type HandlerType = {
  allowedRoles?: AllowedRoles
} & {
  [method in HttpMethods]?: (session: Session | null) => Promise<void>
}

async function isRequestValid(
  allowedRoles: Role[],
  sessionRole: Role | null
): Promise<boolean> {
  return sessionRole !== null && allowedRoles.includes(sessionRole)
}

export async function requestHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  handler: HandlerType
) {
  try {
    const method: HttpMethods | undefined = req.method as
      | HttpMethods
      | undefined

    if (
      !method ||
      !handler[method] ||
      !handler.allowedRoles ||
      !handler.allowedRoles[method]
    ) {
      return res.status(405).json({ message: 'Method not allowed' })
    }

    const allowedRoles = handler.allowedRoles[method] ?? ['PUBLIC']

    const session =
      allowedRoles.includes('PUBLIC') && allowedRoles.length === 1
        ? null
        : await getServerSession(req, res, authOptions)

    const sessionRole: Role | null = session?.user?.role || 'PUBLIC'

    const requestValid = await isRequestValid(allowedRoles, sessionRole)

    if (!requestValid) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    await handler[method]?.(session)
  } catch (err) {
    const statusCode = err instanceof Error ? 400 : 500
    const message = err instanceof Error ? err.message : 'Something went wrong.'
    res.status(statusCode).json({ statusCode, message })
  }
}
