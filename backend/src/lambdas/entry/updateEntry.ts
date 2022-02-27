import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { updateEntry } from '../../db/updateEntry'
import { validateEntryTypes } from '../../db/validateEntryTypes'
import { withAuth } from '../../utils/auth'
import { getEmail } from '../../utils/getQueryParams'
import { response } from '../../utils/response'
import { setTimeStamp } from '../../utils/time'
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

    const [body, missing] = validateBody({ required: ['id'], event })
    if (missing.length) return response.error(missing, 400)

    const errors = validateEntryTypes(body)
    if (errors) return response.error(errors, 400)

    let exp = `SET #UpdatedAt = (${setTimeStamp()})`
    exp += `, #UpdatedBy = (${hasAuth ? user.email : 'self'})`
    if (body.name) exp += `, #Name = (${body.name})`
    if (body.cals) exp += `, #Cals = (${body.cals})`
    if (body.price) exp += `, #Price = (${body.price})`

    const updated = await updateEntry({
      UpdateExpression: exp,
      id: body.id,
      email,
    })

    if (!updated) return response.error(`Entry for ${email} was not found`, 400)
    return response.success(`Entry for ${email} has been updated`, 201)
  } catch (error: any) {
    return response.error(error)
  }
}
