import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

const endpoint = process.env.DYNAMO_ENDPOINT
const region = process.env.AWS_REGION
const clientParams: Record<string, any> = {}

if (region) clientParams.region = region
if (endpoint) clientParams.endpoint = endpoint

const clientDB = new DynamoDBClient(clientParams)

export const client = DynamoDBDocumentClient.from(clientDB)
export const TableName = `${process.env.TABLE_NAME}`

export default client
