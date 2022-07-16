export const errorHttp = (error) => {

  let errorResponse

  if (error.response) {
      const { status, data } = error.response
      errorResponse = { status: data.status, statusCode: status, message: data.message, data: data.data }
  }
  else if (error.request) errorResponse = { status: false, statusCode: 0, message: 'Error de conexión', data: null }
  else errorResponse = { status: false, statusCode: -1, message: error.message, data: null }

  return errorResponse
}