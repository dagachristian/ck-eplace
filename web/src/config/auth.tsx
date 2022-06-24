import { useState, createContext, useCallback, ReactNode, useContext } from 'react'
import { Auth } from 'aws-amplify'
import { BffApiService } from '../services/bffApi'
import socket from '../services/bffApi/websocket'

interface ICognitoUserSession {
  userAuthToken: string
  apiToken: string
}
type AC = {
  loggedIn: boolean
  isAuthenticated: () => Promise<boolean>
  signIn: (email: string) => Promise<any>
  verifyCode: (code: string) => Promise<boolean>
  signOut: typeof Auth.signOut
  currentSession: () => Promise<ICognitoUserSession | null>
  apiToken: string | null
}

const AuthContext = createContext<AC>({
  loggedIn: false,
  isAuthenticated: () => Promise.resolve(false),
  signIn: () => Promise.resolve(),
  verifyCode: () => Promise.resolve(false),
  signOut: () => Promise.resolve(),
  currentSession: () => Promise.resolve(null),
  apiToken: null
})

export const APIContext = createContext<string | null>(null)

interface IAuthProviderProps {
  children: ReactNode
}

const exchangeWithApiToken = (authToken: string) => {
  const api = new BffApiService()
  return api.exchangeToken(authToken)
}

const AuthProvider = (props: IAuthProviderProps) => {
  const [loggedIn, setLoggedIn] = useState<AC['loggedIn']>(false)
  const [apiToken, setApiToken] = useState<AC['apiToken']>(null)
  const [cognitoUser, setCognitoUser] = useState(null)

  const isAuthenticated = useCallback(async () => {
    try {
      await Auth.currentSession()
      return true
    } catch (error) {
      return false
    }
  }, [])

  // useEffect(() => {
  //   isAuthenticated().then((res) => setLoggedIn(res))
  // }, [isAuthenticated])

  const signIn = async (email: string): Promise<any> => {
    const user = await Auth.signIn(email)
    setCognitoUser(user)
    return user
  }

  const verifyCode = async (code: string) => {
    const user = await Auth.sendCustomChallengeAnswer(cognitoUser, code)
    const isOkAuth = await isAuthenticated()
    if (isOkAuth) {
      const session = await Auth.currentSession()
      const userAuthJwt = session?.getAccessToken()?.getJwtToken()
      const newApiToken = await exchangeWithApiToken(userAuthJwt)
      setCognitoUser(user)
      sessionStorage.setItem('dashboard.user', JSON.stringify(cognitoUser!))
      setLoggedIn(true)
      setApiToken(newApiToken)
      sessionStorage.setItem('dashboard.token', newApiToken!)
    }
    return isOkAuth
  }

  const signOut = useCallback(async () => {
    await Auth.signOut()
    setLoggedIn(false)
    setApiToken(null)
    setCognitoUser(null)
    sessionStorage.clear()
    socket.closeSocket()
  }, [])

  const currentSession = useCallback(async () => {
    // refresh token = 8 hrs
    // id and access token = 1 hr
    // set in cognito pool settings on console

    // api token = 1 hr

    let authTokenKey = ''
    for (let item in sessionStorage) {
      if (item.match(/accessToken/)) {
        authTokenKey = item
        break
      }
    }
    const prevAccessToken = authTokenKey === '' ? '' : sessionStorage.getItem(authTokenKey)
    try {
      const session = await Auth.currentSession()

      if (session.isValid()) {
        // getting new api token if access token expired
        const currentAccessToken = session.getAccessToken()?.getJwtToken()
        if (prevAccessToken !== currentAccessToken) {
          exchangeWithApiToken(currentAccessToken).then((newApiToken) => {
            setApiToken(newApiToken)
            sessionStorage.setItem('dashboard.token', newApiToken!)
          })
        } else {
          setApiToken(sessionStorage.getItem('dashboard.token'))
        }

        setLoggedIn(true)

        if (!cognitoUser) {
          setCognitoUser(JSON.parse(sessionStorage.getItem('dashboard.user')!) as any)
        }

        return { userAuthToken: session.getAccessToken()?.getJwtToken(), apiToken: apiToken! }
      }
    } catch (err) {
      signOut()
      if (
        !(err instanceof Error && err.name === 'NotAuthorizedException') &&
        !(err as string).match(/No current user/)
      ) {
        throw err
      }
    }
    return null
  }, [apiToken, cognitoUser, signOut])

  return (
    <AuthContext.Provider
      value={{
        loggedIn,
        isAuthenticated,
        signIn,
        verifyCode,
        signOut,
        currentSession,
        apiToken
      }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}

const useAuth = () => useContext(AuthContext)

export { AuthProvider, useAuth }
