import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { updateUser } from '../../db/updateUser'
import { withAuth } from '../../utils/auth'
import { hashValue } from '../../utils/hash'
import { response } from '../../utils/response'
import { isValid } from '../../utils/validations'

const minAuth = Number(process.env.MIN_AUTH_LEVEL)

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    // console.log(event)
    const user = await withAuth(event)
    let email = user.email

    // Admin needs query param email
    if (user.role >= minAuth) {
      const { email: m } = event.queryStringParameters || {}
      if (!m) return response.error('Missing `email` query parameter', 400)
      isValid.email({ value: m })
      email = m
    }

    const { username, maxCals, budget, age, password, role } = JSON.parse(
      event.body || '{}'
    )
    const errors = [
      maxCals &&
        isValid.number({
          value: maxCals,
          range: [500, 5000],
          key: 'maxCals',
          silent: true,
        }),
      budget &&
        isValid.number({
          value: budget,
          range: [500, 10000],
          key: 'budget',
          silent: true,
        }),
      age &&
        isValid.number({
          value: age,
          range: [12, 120],
          key: 'age',
          silent: true,
        }),
      username && isValid.username({ value: username, silent: true }),
      password && isValid.password({ value: password, silent: true }),
    ].filter((d) => d)

    if (errors.length) return response.error(errors, 400)

    let exp = `SET #Id = (${user.id})`

    if (password) exp += `, #Password = (${hashValue(password)})`
    if (username) exp += `, #Username = (${username})`
    if (maxCals) exp += `, #MaxCals = (${maxCals})`
    if (budget) exp += `, #Budget = (${budget})`
    if (age) exp += `, #Age = (${age})`

    if (user.role >= minAuth && role) {
      isValid.number({ value: role, range: [0, 4], key: 'role' })
      exp += `, #Role = (${role})`
    }

    const updated = await updateUser(email, exp)
    const message = updated
      ? `User ${email} has been updated`
      : `User ${email} was not found`
    return response.success({ message }, updated ? 200 : 404)
  } catch (error: any) {
    return response.error(error)
  }
}
