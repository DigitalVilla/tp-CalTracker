const defaultHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
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

  error: (error: any, status, headers = {}) => {
    const message =
      typeof error === 'object'
        ? error?.message || error
        : error || 'Exception error'
    const code =
      typeof error === 'object'
        ? error?.code || error?.statusCode || status || 500
        : status || 500

    console.log(`${code} Error Response:`, `"${message}"`)

    return {
      statusCode: code,
      headers: { ...defaultHeaders, ...headers },
      body: JSON.stringify({ message }),
    }
  },
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
