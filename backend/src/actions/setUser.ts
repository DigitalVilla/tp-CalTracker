import { PutCommand, PutCommandInput } from '@aws-sdk/lib-dynamodb'
import { client, TableName } from '../utils/clientDB'
import { setTimeStamp } from '../utils/time'
import { hashValue } from '../utils/hash'
import { nanoid } from 'nanoid'

export async function setUser({
  password,
  email,
  role = 0,
}: Record<string, any>): Promise<any> {
  const Email = email.toLowerCase()
  const modelKey = `user#${Email}`

  const Item = {
    PK: 'User',
    SK: modelKey,
    Id: nanoid(),
    Password: hashValue(password),
    CreatedAt: setTimeStamp(),
    Role: role,
    Token: '',
    Name: '',
    Age: 0,
    Email,
    Budget: Number(process.env.DEFAULT_BUDGET || 1000),
    MaxCals: Number(process.env.DEFAULT_MAX_CALS || 2100),
    GSI1PK: modelKey,
    GSI1SK: modelKey,
  }

  const params: PutCommandInput = {
    TableName,
    Item,
    ConditionExpression: 'attribute_not_exists(Id)',
  }

  const cmd = new PutCommand(params)

  try {
    await client.send(cmd)
    const message = `User ${Email} has been created`
    return message
  } catch (error: any) {
    if (error.message === 'The conditional request failed')
      throw new Error(`Email ${Email} already exist`)
    throw error
  }
}
