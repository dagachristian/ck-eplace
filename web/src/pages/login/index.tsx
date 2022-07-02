import { createContext, useState } from 'react';

import GlobalLayout from '../../components/layout';
import LoginForm from './loginForm';
import RegisterForm from './registerForm';

import './login.css';

export const FormContext = createContext<any>([]);

export default function Login() {
  const [ showLogin, setShowLogin ] = useState(true);

  document.title='Login | CK';
  return (
    <GlobalLayout login>
      <div id='center-div'>
        <div id='bg-image'/>
        <FormContext.Provider value={[showLogin, setShowLogin]}>
          {showLogin?
            <LoginForm />
            :<RegisterForm />
          }
        </FormContext.Provider>
      </div>
    </GlobalLayout>
  );
}
