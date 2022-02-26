import { GetCommand, GetCommandInput } from '@aws-sdk/lib-dynamodb'
import { client, TableName } from '../utils/clientDB'

export async function getUser(email: string): Promise<any> {
  try {
    const Email = email.toLowerCase()
    const modelKey = `user#${Email}`

    const params: GetCommandInput = {
      TableName,
      Key: { PK: 'User', SK: modelKey },
    }

    const cmd = new GetCommand(params)
    const data = await client.send(cmd)

    return data.Item
  } catch (error: any) {
    console.log(error)
    return null
  }
}
