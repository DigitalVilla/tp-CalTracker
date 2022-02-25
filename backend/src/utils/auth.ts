import { APIGatewayProxyEvent } from 'aws-lambda'
import { verifyToken } from './hash'

/*
  LEVELS:
    0: 'user'
    1: 'premium'
    2: 'developer'
    3: 'admin'
*/

export async function withAuth(event: APIGatewayProxyEvent, minLevel = 0) {
  try {
    const bearerToken = event.headers?.Authorization

    if (!bearerToken) {
      const err: Record<string, any> = new Error('Missing Authorization Header')
      err.code = 401
      throw err
    }

    const token = bearerToken.replace('Bearer ', '')
    const decoded: any = verifyToken(token)

    if (decoded.Role < minLevel) {
      const err: Record<string, any> = new Error('Unauthorized user')
      err.code = 403
      throw err
    }
  } catch (error: any) {
    error.code = 403
    throw error
  }
}
