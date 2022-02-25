const defaultHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
}

type ResponseType = {
  success: ResponseFn
  error: ResponseFn
}

type ResponseFn = (
  body?: Record<string, any> | string,
  status?: number,
  headers?: Record<string, string | boolean>
) => PayloadType

type PayloadType = {
  statusCode: number
  headers: Record<string, string | boolean>
  body: string
}

export const response: ResponseType = {
  success: (body, status = 200, headers = {}) => {
    const response =
      typeof body === 'object' ? body : { message: body || 'success' }
    return {
      statusCode: status,
      headers: { ...defaultHeaders, ...headers },
      body: JSON.stringify(response),
    }
  },

  error: (error, status, headers = {}) => {
    console.log('Error', error)
    const message =
      typeof error === 'object' ? error?.message : error || 'Unknown error'
    const code = typeof error === 'object' ? error?.statusCode : status || 500
    return {
      statusCode: code,
      headers: { ...defaultHeaders, ...headers },
      body: JSON.stringify({ message }),
    }
  },
}
