import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getUser } from '../../db/getUser'
import { createToken, hashValue } from '../../utils/hash'
import { response } from '../../utils/response'
import { validateBody } from '../../utils/validateBody'
import { validateUserTypes } from '../../db/validateUserTypes'

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

    const [body, missing] = validateBody({
      required: ['email', 'password'],
      event,
    })
    if (missing.length) return response.error(missing, 400)

    const errors = validateUserTypes(body)
    if (errors) return response.error('Invalid username or password', 404)

    // Retrieve Item
    const Item = await getUser({ email: body.email })

    // Validate Passwords
    if (!Item || Item.Password !== hashValue(body.password)) {
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
      '10s'
    )

    return response.success(payload, 201)
  } catch (error: any) {
    return response.error(error)
  }
}
