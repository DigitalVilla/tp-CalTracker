import { PutCommand, PutCommandInput } from '@aws-sdk/lib-dynamodb'
import { client, TableName } from '../utils/clientDB'
import { setTimeStamp } from '../utils/time'
import { hashValue } from '../utils/hash'
import { nanoid } from 'nanoid'

export async function setUser({
  password,
  email,
  ...rest
}: Record<string, any>): Promise<boolean> {
  const Email = email.toLowerCase()
  const modelKey = `user#${Email}`

  const Item = {
    PK: 'User',
    SK: modelKey,
    Id: nanoid(),
    Password: hashValue(password),
    CreatedAt: setTimeStamp(),
    Role: Number(rest.role) || 0,
    Username: rest.username || '',
    Age: Number(rest.age) || 0,
    Email,
    Budget: rest.budget || Number(process.env.DEFAULT_BUDGET),
    MaxCals: rest.maxCals || Number(process.env.DEFAULT_MAX_CALS),
    GSI1PK: modelKey,
    GSI1SK: modelKey,
  }

  const params: PutCommandInput = {
    TableName,
    Item,
    ConditionExpression: 'attribute_not_exists(SK)',
  }

  const cmd = new PutCommand(params)

  try {
    await client.send(cmd)
    return true
  } catch (error: any) {
    console.log(error)
    return false
  }
}
