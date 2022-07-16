// pretend this is firebase, netlify, or auth0's code.
// you shouldn't have to implement something like this in your own app

const localStorageKey = '__auth_provider_token__'
const localAdminStorageKey = '__auth_admin_provider_token__'

async function getToken() {
  return JSON.parse(window.localStorage.getItem(localStorageKey))
}

async function getTokenAdmin() {
  return JSON.parse(window.localStorage.getItem(localAdminStorageKey))
}

function handleUserResponse({ data }) {
  const tokenSerializer = JSON.stringify(data.token)
  window.localStorage.setItem(localStorageKey, tokenSerializer)
  return data?.user
}

function handleAdminResponse({ data }) {
  const tokenSerializer = JSON.stringify(data.token)
  window.localStorage.setItem(localAdminStorageKey, tokenSerializer)
  return data?.user
}

function handleResponse(data) {
  return data
}

function loginAdmin({ email, password }) {
  return client("admin/auth/login", { email, password }).then(handleAdminResponse)
}

function login({ email, password }) {
  return client("user/auth/login", { email, password }).then(handleUserResponse)
}

function registerAdmin({ email, password, name }) {
  return client("admin/auth/register", { email, password, name }).then(handleResponse)
}

function register({ email, password, name }) {
  return client("user/auth/register", { email, password, name }).then(handleResponse)
}

async function logout() {
  window.localStorage.removeItem(localStorageKey)
}

async function logoutAdmin() {
  window.localStorage.removeItem(localAdminStorageKey)
}

const BASE_URL = "http://localhost:5002/api"

async function client(endpoint, data) {
  const config = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  }

  return window.fetch(`${BASE_URL}/${endpoint}`, config).then(async response => {
    const data = await response.json()
    if (response.ok) {
      return data
    } else {
      return Promise.reject(data)
    }
  })
}

export {
  login,
  logout,
  register,
  getToken,
  loginAdmin,
  logoutAdmin,
  registerAdmin,
  getTokenAdmin,
  localStorageKey
}
