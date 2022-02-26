import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { setUser } from '../../db/setUser'
import { withAuth } from '../../utils/auth'
import { response } from '../../utils/response'
import { isValid } from '../../utils/validations'

const minAuth = Number(process.env.MIN_AUTH_LEVEL)

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    console.log(event)
    await withAuth(event, minAuth)

    const { email, password, ...rest } = JSON.parse(event.body || '{}')
    if (!email) return response.error('Missing Email', 400)
    if (!password) return response.error('Missing Password', 400)

    isValid.email({ value: email })
    isValid.password({ value: password })

    const set = await setUser({ email, password, ...rest })

    const message = set
      ? `User ${email} was created`
      : `User ${email} already exist`

    return response.success({ message }, set ? 201 : 400)
  } catch (error: any) {
    return response.error(error)
  }
}
