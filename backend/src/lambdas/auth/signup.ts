import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { setUser } from '../../db/setUser'
import { response } from '../../utils/response'
import { isValid } from '../../utils/validations'

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    console.log(event)

    const { email, password, username, age, budget, maxCals } = JSON.parse(
      event.body || '{}'
    )
    if (!email) return response.error('Missing Email', 400)
    if (!password) return response.error('Missing Password', 400)

    isValid.email({ value: email })
    isValid.password({ value: password })

    const set = await setUser({
      email,
      password,
      username,
      budget,
      maxCals,
      age,
    })

    const message = set
      ? `User ${email} was created`
      : `User ${email} already exist`

    return response.success(message, set ? 201 : 400)
  } catch (error: any) {
    return response.error(error)
  }
}
