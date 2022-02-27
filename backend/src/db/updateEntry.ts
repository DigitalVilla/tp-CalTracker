import { UpdateCommand, UpdateCommandInput } from '@aws-sdk/lib-dynamodb'
import { client, TableName } from '../utils/clientDB'
import { parseExpression } from '../utils/parseExpression'

export async function updateEntry({
  id,
  email,
  UpdateExpression,
}: {
  id: string
  email: string
  UpdateExpression: string
}): Promise<boolean> {
  try {
    const Email = email.toLowerCase()

    const params = parseExpression({
      TableName,
      Key: { PK: 'Entry', SK: id },
      UpdateExpression,
      ConditionExpression: `#Email = (${Email})`,
      ReturnValues: 'UPDATED_OLD',
    })

    const cmd = new UpdateCommand(params as UpdateCommandInput)
    const data = await client.send(cmd)

    return Boolean(data.Attributes)
  } catch (error: any) {
    console.log(error)
    return false
  }
}
