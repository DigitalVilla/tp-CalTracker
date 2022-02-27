import { PutCommand, PutCommandInput } from '@aws-sdk/lib-dynamodb'
import { client, TableName } from '../utils/clientDB'
import { setTimeStamp } from '../utils/time'

export async function setEntry({
  name,
  cals,
  email,
  date,
  createdBy,
  type,
  price,
}: Record<string, any>): Promise<boolean> {
  const Date = setTimeStamp(date)
  const Email = email.toLowerCase()
  const modelKey = `${type}#${Date}`

  const Item = {
    PK: 'Entry',
    SK: modelKey,
    Id: modelKey,
    createdBy: createdBy,
    UpdatedAt: '',
    UpdatedBy: '',
    Email,
    Name: name,
    Cals: cals,
    Price: price,
    Date,
    GSI1PK: `user#${email}`,
    GSI1SK: modelKey,
  }

  const params: PutCommandInput = {
    TableName,
    Item,
    ConditionExpression: 'attribute_not_exists(PK)',
  }
  try {
    const cmd = new PutCommand(params)
    await client.send(cmd)
    return true
  } catch (error: any) {
    return false
  }
}
