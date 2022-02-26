import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { deleteUser } from '../../db/deleteUser'
import { withAuth } from '../../utils/auth'
import { getEmail } from '../../utils/getQueryParams'
import { response } from '../../utils/response'

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

    // Remove user
    const deleted = await deleteUser(email)

    const message = deleted
      ? `User ${email} has been deleted`
      : `User ${email} was not found`

    return response.success({ message }, deleted ? 200 : 404)
  } catch (error: any) {
    return response.error(error)
  }
}
