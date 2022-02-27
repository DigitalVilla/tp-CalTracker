import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { sanitizeUser } from '../../utils/sanitizeUser'
import { getUser } from '../../db/getUser'
import { withAuth } from '../../utils/auth'
import { response } from '../../utils/response'
import { getEmail } from '../../utils/getQueryParams'

const minAuth = Number(process.env.MIN_AUTH_LEVEL)

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    console.log(event)
    const user = await withAuth(event)
    let email = user.email

    // Admin needs query param email
    if (user.role >= minAuth) email = getEmail(event)

    const Item = await getUser({ email })
    if (!Item) return response.error(`User ${email} was not found`, 404)
    return response.success(sanitizeUser(Item, user.role >= minAuth), 200)
  } catch (error: any) {
    return response.error(error)
  }
}
