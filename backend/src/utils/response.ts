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
  body?: Record<string, any>,
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
    const response = !body ? { message: 'success' } : body
    return {
      statusCode: status,
      headers: { ...defaultHeaders, ...headers },
      body: JSON.stringify(response),
    }
  },

  error: (error = {}, status, headers = {}) => {
    console.log('Error', error)
    return {
      statusCode: status || error.statusCode || 500,
      headers: { ...defaultHeaders, ...headers },
      body: JSON.stringify({
        error: error.name || 'Exception',
        message: error.message || 'Unknown error',
      }),
    }
  },
}
