import { PutCommand, PutCommandInput } from '@aws-sdk/lib-dynamodb'
import { client, TableName } from '../utils/clientDB'
import { setTimeStamp } from '../utils/time'
import { hashValue } from '../utils/hash'
import { nanoid } from 'nanoid'

export async function setUser({
  password,
  email,
  role = 0,
}: Record<string, any>): Promise<boolean> {
  const Email = email.toLowerCase()
  const modelKey = `user#${Email}`

  const Item = {
    PK: 'User',
    SK: modelKey,
    Id: nanoid(),
    Password: hashValue(password),
    CreatedAt: setTimeStamp(),
    Role: role,
    Username: '',
    Age: 0,
    Email,
    Budget: Number(process.env.DEFAULT_BUDGET),
    MaxCals: Number(process.env.DEFAULT_MAX_CALS),
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
