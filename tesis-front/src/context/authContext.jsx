import * as React from 'react'

import { client } from '../services/api'
import { useAsync } from '../utils/hooks'
import * as auth from '../libs/auth-provider'

async function bootstrapAppData() {
  let user = null
  const token = await auth.getToken()

  if (token) {
    const response = await client('user/auth/me', { token: { authorization: `Bearer ${token}` } })
    user = response?.user
  }

  return user
}

const AuthContext = React.createContext()
AuthContext.displayName = 'AuthContext'

function AuthProvider(props) {
  const {
    data: user,
    run,
    isIdle,
    status,
    isError,
    setData,
    isLoading,
    isSuccess,
  } = useAsync()

  React.useEffect(() => {
    const appDataPromise = bootstrapAppData()
    run(appDataPromise)
  }, [run])

  const login = React.useCallback(
    form => auth.login(form).then(user => setData(user)),
    [setData],
  )
  const register = React.useCallback(
    form => auth.register(form).then(user => setData(user)),
    [setData],
  )
  const logout = React.useCallback(() => {
    auth.logout()
    setData(null)
  }, [setData])

  const value = React.useMemo(() => ({
    user,
    login,
    logout,
    register
  }), [
    user,
    login,
    logout,
    register
  ])

  if (isLoading || isIdle) {
    return <>Spineeeeeeeeeeeeer!!</>
  }

  if (isError) {
    return <><p>Existe un problema recargue la página.</p></>
  }

  if (isSuccess) {
    return <AuthContext.Provider value={value} {...props} />
  }

  throw new Error(`Unhandled status: ${status}`)
}

function useAuth() {
  const context = React.useContext(AuthContext)

  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`)
  }
  return context
}

function useClient() {
  const { user } = useAuth()
  const token = user?.token

  return React.useCallback(
    (endpoint, config) => client(endpoint, { ...config, token: { authorization: `Bearer ${token}` } }),
    [token],
  )
}

export { AuthProvider, useAuth, useClient }
