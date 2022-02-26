import { DeleteCommand, DeleteCommandInput } from '@aws-sdk/lib-dynamodb'
import { client, TableName } from '../utils/clientDB'

export async function deleteUser(email: string): Promise<boolean> {
  try {
    const Email = email.toLowerCase()
    const modelKey = `user#${Email}`

    const params: DeleteCommandInput = {
      TableName,
      Key: { PK: 'User', SK: modelKey },
    }

    const cmd = new DeleteCommand(params)
    const data = await client.send(cmd)

    return !Boolean(data.ConsumedCapacity)
  } catch (error) {
    console.log(error)
    return false
  }
}
