import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { setEntry } from '../../db/setEntry'
import { validateEntryTypes } from '../../db/validateEntryTypes'
import { withAuth } from '../../utils/auth'
import { getEmail } from '../../utils/getQueryParams'
import { response } from '../../utils/response'
import { validateBody } from '../../utils/validateBody'

const minAuth = Number(process.env.MIN_AUTH_LEVEL)

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    console.log(event)
    const user = await withAuth(event)
    const hasAuth = user.role >= minAuth
    // Admin needs query param email
    const email = hasAuth ? getEmail(event) : user.email

    const [body, missing] = validateBody({
      required: ['type', 'name', 'cals'],
      event,
    })
    if (missing.length) return response.error(missing, 400)

    const errors = validateEntryTypes(body)
    if (errors) return response.error(errors, 400)

    const set = await setEntry({
      ...body,
      email,
      createdBy: hasAuth ? user.email : 'self',
    })
    if (!set) return response.error(`Entry date already exists`, 400)
    return response.success(`Entry ${body.name} was created`, 201)
  } catch (error: any) {
    return response.error(error)
  }
}
