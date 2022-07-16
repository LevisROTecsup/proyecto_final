import * as auth from '../../libs/auth-provider'

const BASE_URL = "http://localhost:5002/api"

export const client = async (
  endpoint,
  { data, method, token: { ...customToken } = {}, headers: { ...customHeaders } = {}, ...customConfig } = {},
) => {

  let config = {
    method: method ?? "GET",
    headers: {
      ...customToken,
      ...customHeaders,
    },
    ...customConfig,
  }

  let formData = data;

  if (customHeaders["Content-Type"] && customHeaders["Content-Type"] === "application/json") {
    formData = JSON.stringify(data)
  }

  if (data && !method) {
    config.method = "POST";
  }

  if (data) {
    config = { ...config, body: formData };
  }

  return window.fetch(`${BASE_URL}/${endpoint}`, config).then(async response => {
    if (response.status === 403) {
      await auth.logout()

      window.location.assign(window.location)
      return Promise.reject({ message: 'Inice sesión nuevamente.' })
    }

    const data = await response.json()

    if (response.ok) {
      return data.data
    } else {
      return Promise.reject(data)
    }
  })
}