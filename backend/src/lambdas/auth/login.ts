import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { sanitizeUser } from '../../utils/sanitizeUser'
import { getUser } from '../../db/getUser'
import { createToken, hashValue } from '../../utils/hash'
import { response } from '../../utils/response'
import { isValid } from '../../utils/validations'

/**
 *
 * @method POST
 * @queryParams clean - (optional) will return only the token
 * @body - { email, password}
 * @returns - token and user is specified in url
 */
export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    console.log(event)

    const { email, password } = JSON.parse(event.body || '{}')

    if (!email) return response.error('Missing Email', 400)
    if (!password) return response.error('Missing Password', 400)

    isValid.email({ value: email })
    isValid.password({ value: password })

    // Retrieve Item
    const Item = await getUser(email)

    // Validate Passwords
    if (!Item || Item.Password !== hashValue(password)) {
      console.log(`Invalid password`)
      return response.error('Invalid username or password', 404)
    }

    // Create Token
    const payload: Record<string, any> = {}
    payload.token = createToken(
      {
        email: Item.Email,
        role: Item.Role,
        id: Item.Id,
      },
      '7d'
    )

    // Sanitize Item as User
    if (typeof event.queryStringParameters?.clean !== 'string') {
      payload.user = sanitizeUser(Item)
    }

    return response.success(payload, 201)
  } catch (error: any) {
    return response.error(error)
  }
}
