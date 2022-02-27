import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { validateUserTypes } from '../../db/validateUserTypes'
import { updateUser } from '../../db/updateUser'
import { withAuth } from '../../utils/auth'
import { getEmail } from '../../utils/getQueryParams'
import { hashValue } from '../../utils/hash'
import { response } from '../../utils/response'
import { validateBody } from '../../utils/validateBody'
import { isValid } from '../../utils/validations'

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

    const [body] = validateBody({ event })
    const errors = validateUserTypes(body)
    if (errors) return response.error(errors, 400)

    let exp = `SET #Id = (${user.id})`
    if (body.password) exp += `, #Password = (${hashValue(body.password)})`
    if (body.username) exp += `, #Username = (${body.username})`
    if (body.verified) exp += `, #Verified = (${body.verified})`
    if (body.maxCals) exp += `, #MaxCals = (${body.maxCals})`
    if (body.budget) exp += `, #Budget = (${body.budget})`
    if (body.age) exp += `, #Age = (${body.age})`

    if (user.role >= minAuth && body.role) {
      isValid.number({ value: body.role, range: [0, 4], key: 'role' })
      exp += `, #Role = (${body.role})`
    }

    const updated = await updateUser({ email, UpdateExpression: exp })
    if (!updated) return response.error(`User ${email} was not found`, 400)
    return response.success(`User ${email} has been updated`, 201)
  } catch (error: any) {
    return response.error(error)
  }
}
