import { createContext, useContext, useState, useEffect } from 'react';

import '../styles/global.css';
import { Amplify } from 'aws-amplify'
import { AuthProvider } from '../auth/auth';


const Context = createContext();

export default function App({ Component, pageProps }) {
  const [state, setState] = useState({});
  
  useEffect(() => {
    Amplify.configure({
      Auth: {
        storage: sessionStorage
      }
    })
  }, [])
  
  return (
    <Context.Provider value={[state, setState]}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </Context.Provider>
  );
}

export function useStateContext() {
  return useContext(Context);
}