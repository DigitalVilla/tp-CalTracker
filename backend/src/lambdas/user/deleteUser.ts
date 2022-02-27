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

    const deleted = await deleteUser({ email })
    if (!deleted) return response.error(`User ${email} was not found`, 400)
    return response.success(`User ${email}  has been deleted`, 201)
  } catch (error: any) {
    return response.error(error)
  }
}
