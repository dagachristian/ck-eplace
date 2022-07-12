import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import GlobalLayout from '../../components/layout';
import LoginForm from './loginForm';
import RegisterForm from './registerForm';

import './login.css';

const TITLE = 'Login | CK';

export default function Login() {
  const [ showLogin, setShowLogin ] = useState(true);

  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      <GlobalLayout login>
        <div id='center-div'>
          <div id='bg-image' />
          {showLogin ?
            <LoginForm showLogin={setShowLogin} />
            : <RegisterForm showLogin={setShowLogin} />}
        </div>
      </GlobalLayout>
    </>
  );
}
