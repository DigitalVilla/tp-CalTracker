import { APIGatewayProxyEvent } from 'aws-lambda'
import { isValid } from './validations'

export function getEmail(event: APIGatewayProxyEvent) {
  const { email } = event.queryStringParameters || {}
  if (!email) {
    const err: any = new Error('Missing query parameter: email')
    err.code = 400
    throw err
  }
  isValid.email({ value: email })
  return email
}
