import { useState, createContext, useCallback, ReactNode, useContext } from 'react'

import { bffApi } from './bffApi'
import { IUser } from './interfaces'

type AC = {
  loggedIn: boolean
  signIn: (username: string, password: string, remember: boolean) => Promise<boolean>
  signOut: () => Promise<any>
  currentSession: () => Promise<string | null>
  apiToken: string | null
  user: IUser | null
}

const AuthContext = createContext<AC>({
  loggedIn: false,
  signIn: () => Promise.resolve(false),
  signOut: () => Promise.resolve(),
  currentSession: () => Promise.resolve(null),
  apiToken: null,
  user: null
})

interface IAuthProviderProps {
  children: ReactNode
}

const AuthProvider = (props: IAuthProviderProps) => {
  const [loggedIn, setLoggedIn] = useState<AC['loggedIn']>(false)
  const [apiToken, setApiToken] = useState<AC['apiToken']>(null)
  const [user, setUser] = useState<IUser | null>(null)

  const signIn = useCallback(async (username: string, password: string, remember: boolean): Promise<any> => {
    const ret = await bffApi.login(username, password);
    if (ret.user) {
      setUser(ret.user);
      setLoggedIn(true);
      setApiToken(ret.apiToken);
      sessionStorage.setItem('user.authed', JSON.stringify(ret.user));
      sessionStorage.setItem('token.api', ret.apiToken);
      if (remember) localStorage.setItem('token.refresh', ret.refreshToken);
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
    localStorage.clear()
  }, [apiToken])

  const currentSession = useCallback(async () => {
    let tok = apiToken || sessionStorage.getItem('token.api');
    let usr = JSON.parse(sessionStorage.getItem('user.authed')!);
    try {
      await bffApi.currentSession(tok!)
    } catch (e) {
      console.log(e);
      tok = localStorage.getItem('token.refresh');
      const ret = await bffApi.renewSession(tok!);
      tok = ret.apiToken;
      usr = ret.user;
      sessionStorage.setItem('user.authed', JSON.stringify(ret.user));
      sessionStorage.setItem('token.api', ret.apiToken);
    }
    if (tok) {
      setApiToken(tok);
      setLoggedIn(true);
    }
    if (!user) setUser(usr);
    return tok;
  }, [apiToken, user])

  return (
    <AuthContext.Provider
      value={{
        loggedIn,
        signIn,
        signOut,
        currentSession,
        apiToken,
        user
      }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}

const useAuth = () => useContext(AuthContext)

export { AuthProvider, useAuth }
