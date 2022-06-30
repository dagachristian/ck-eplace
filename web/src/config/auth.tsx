import { useState, createContext, useCallback, ReactNode, useContext } from 'react'
import { bffApi } from '../services/bffApi'
import { IUser } from '../services/interfaces'

type AC = {
  loggedIn: boolean
  signIn: (username: string, password: string) => Promise<boolean>
  signOut: () => Promise<any>
  currentSession: () => Promise<boolean>
  apiToken: string | null
}

const AuthContext = createContext<AC>({
  loggedIn: false,
  signIn: () => Promise.resolve(false),
  signOut: () => Promise.resolve(),
  currentSession: () => Promise.resolve(false),
  apiToken: null
})

interface IAuthProviderProps {
  children: ReactNode
}

const AuthProvider = (props: IAuthProviderProps) => {
  const [loggedIn, setLoggedIn] = useState<AC['loggedIn']>(false)
  const [apiToken, setApiToken] = useState<AC['apiToken']>(null)
  const [user, setUser] = useState<IUser | null>(null)

  const signIn = useCallback(async (username: string, password: string): Promise<any> => {
    const ret = await bffApi.login(username, password);
    if (ret.user) {
      setUser(ret.user);
      setLoggedIn(true);
      setApiToken(ret.token);
      sessionStorage.setItem('dashboard.user', JSON.stringify(ret.user));
      sessionStorage.setItem('dashboard.token', ret.token);
      return true;
    }
    return false;
  }, [])

  const signOut = useCallback(async () => {
    try {
      await bffApi.logout(apiToken!);
    } catch (e) {}
    setLoggedIn(false)
    setApiToken(null)
    setUser(null)
    sessionStorage.clear()
  }, [])

  const currentSession = useCallback(async () => {
    try {
      const tok = sessionStorage.getItem('dashboard.token');
      await bffApi.currentSession(tok!)
      setApiToken(tok);
      setLoggedIn(true);
      setUser(JSON.parse(sessionStorage.getItem('dashboard.user')!));
      // refresh token

      return true;
    } catch (e) {
      console.log(e);
      signOut()
    }
    return false;
  }, [])

  return (
    <AuthContext.Provider
      value={{
        loggedIn,
        signIn,
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
