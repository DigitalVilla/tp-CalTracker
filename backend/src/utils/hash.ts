import { createHmac } from 'crypto'
import { sign, verify } from 'jsonwebtoken'

const hashingSecret = `${process.env.HASH_SECRET}`

export function hashValue(value: string) {
  const hashedStr = createHmac('sha256', hashingSecret)
    .update(value)
    .digest('hex')
  return hashedStr
}

export function verifyToken(token: string) {
  const decoded = verify(token, hashingSecret)
  return decoded
}

export function createToken(
  data: Record<string, string | number>,
  expiresIn = '24h'
) {
  const token = sign(data, hashingSecret, { expiresIn })
  return token
}
