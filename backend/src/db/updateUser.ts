import { UpdateCommand, UpdateCommandInput } from '@aws-sdk/lib-dynamodb'
import { client, TableName } from '../utils/clientDB'
import { parseExpression } from '../utils/parseExpression'

export async function updateUser(
  email: string,
  UpdateExpression: string
): Promise<boolean> {
  try {
    const Email = email.toLowerCase()
    const modelKey = `user#${Email}`

    const params = parseExpression({
      TableName,
      Key: { PK: 'User', SK: modelKey },
      UpdateExpression,
      ConditionExpression: {
        expression: 'attribute_exists(SK)',
        delimiter: null,
      },
      ReturnValues: 'UPDATED_OLD',
    })

    const cmd = new UpdateCommand(params as UpdateCommandInput)
    const data = await client.send(cmd)

    console.log('DATA: ', data, modelKey)

    return Boolean(data.Attributes?.Id)
  } catch (error: any) {
    console.log(error)
    return false
  }
}
