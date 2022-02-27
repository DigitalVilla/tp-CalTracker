import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { setUser } from '../../db/setUser'
import { validateUserTypes } from '../../db/validateUserTypes'
import { response } from '../../utils/response'
import { validateBody } from '../../utils/validateBody'
import { isValid } from '../../utils/validations'

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
    if (errors) return response.error(errors, 400)

    const set = await setUser({
      email: body.email,
      password: body.password,
      username: body.username,
      budget: body.budget,
      maxCals: body.maxCals,
      age: body.age,
    })

    if (!set) return response.error(`User ${body.email} already exist`, 400)
    return response.success(`User ${body.email} was created`, 201)
  } catch (error: any) {
    return response.error(error)
  }
}
