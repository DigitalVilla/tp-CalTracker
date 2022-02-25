import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { response } from '../../utils/response'

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  console.log(event)
  return response.success('success', 200)
}
