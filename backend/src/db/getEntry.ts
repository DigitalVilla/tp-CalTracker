import { GetCommand, GetCommandInput } from '@aws-sdk/lib-dynamodb'
import { client, TableName } from '../utils/clientDB'

export async function getEntry({ id }: { id: string }): Promise<any> {
  try {
    const params = {
      TableName,
      Key: { PK: 'Entry', SK: id },
    }

    const cmd = new GetCommand(params as GetCommandInput)
    const data = await client.send(cmd)

    return data.Item
  } catch (error: any) {
    console.log(error)
    return null
  }
}
