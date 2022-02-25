import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { setUser } from '../../actions/setUser'
import { withAuth } from '../../utils/auth'
import { response } from '../../utils/response'
import { isInvalid } from '../../utils/validations'

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    console.log(event)
    await withAuth(event, 3)

    const { email, password, role = 0 } = JSON.parse(event.body || '{}')
    if (!email) return response.error('Missing Email', 400)
    if (!password) return response.error('Missing Password', 400)

    const isEmailInvalid = isInvalid.email(email)
    const isPassInvalid = isInvalid.password(password)

    if (isEmailInvalid) return response.error(isEmailInvalid, 400)
    if (isPassInvalid) return response.error(isPassInvalid, 400)

    const message = await setUser({ email, password, role })
    return response.success(message, 201)
  } catch (error: any) {
    return response.error(error.message ? error.message : error, error?.code)
  }
}
