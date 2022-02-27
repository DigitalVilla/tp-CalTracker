import { DeleteCommand, DeleteCommandInput } from '@aws-sdk/lib-dynamodb'
import { parseExpression } from '../utils/parseExpression'
import { client, TableName } from '../utils/clientDB'

export async function deleteEntry({
  id,
  email,
}: {
  id: string
  email: string
}): Promise<boolean> {
  try {
    const Email = email.toLowerCase()

    const params = parseExpression({
      TableName,
      Key: { PK: 'Entry', SK: id },
      ConditionExpression: `#Email = (${Email})`,
    })

    const cmd = new DeleteCommand(params as DeleteCommandInput)
    const data = await client.send(cmd)

    return !Boolean(data.ConsumedCapacity)
  } catch (error) {
    console.log(error)
    return false
  }
}
