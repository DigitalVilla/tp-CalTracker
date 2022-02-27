import { APIGatewayProxyEvent } from 'aws-lambda'

type BodyFieldsProps = { event: APIGatewayProxyEvent; required?: string[] }

export function validateBody({ event, required = [] }: BodyFieldsProps): any {
  const body = JSON.parse(event.body || '{}')
  const errors: string[] = []

  required.forEach((el) => {
    if (!body[el]) errors.push(`${el} is required`)
  })

  return [body, errors]
}
