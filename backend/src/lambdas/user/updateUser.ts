import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { PutCommand, PutCommandInput } from '@aws-sdk/lib-dynamodb'
import { client, TableName } from '../../utils/clientDB'
import { response } from '../../utils/response'
import { setTimeStamp } from '../../utils/time'
import { hashValue } from '../../utils/hash'
import { isInvalid } from '../../utils/validations'
import { nanoid } from 'nanoid'

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  console.log(event)

  const { email, password } = JSON.parse(event.body || '{}')
  if (!email) return response.error('Missing Email', 400)
  if (!password) return response.error('Missing Password', 400)

  const isEmailInvalid = isInvalid.email(email)
  const isPassInvalid = isInvalid.password(password)

  if (isEmailInvalid) return response.error(isEmailInvalid, 400)
  if (isPassInvalid) return response.error(isPassInvalid, 400)

  const Email = email.toLowerCase()
  const modelKey = `user#${Email}`

  const params: PutCommandInput = {
    TableName,
    Item: {
      PK: 'User',
      SK: modelKey,
      Id: nanoid(),
      Password: hashValue(password),
      CreatedAt: setTimeStamp(),
      Role: 'user',
      Token: '',
      Name: '',
      Age: 0,
      Email,
      Budget: Number(process.env.DEFAULT_BUDGET || 1000),
      MaxCals: Number(process.env.DEFAULT_MAX_CALS || 2100),
      GSI1PK: modelKey,
      GSI1SK: modelKey,
    },
    ConditionExpression: 'attribute_not_exists(Id)',
  }

  const cmd = new PutCommand(params)

  try {
    await client.send(cmd)
    const message = `User ${email} has been created`
    console.log(message)
    return response.success(message, 201)
  } catch (error: any) {
    console.error(`Failed to create User ${email}`, error.message)
    if (error.message === 'The conditional request failed')
      return response.error(`Email ${email} already exist`)
    return response.error(error.message ? error.message : error)
  }
}
