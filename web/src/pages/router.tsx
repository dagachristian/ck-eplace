import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../config/auth';

import Login from './login';
import Dashboard from './dashboard';
import Profile from './profile';

export default function Router() {
  const { loggedIn, currentSession } = useAuth();
  const [ sameSession, setSameSession ] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const authed = await currentSession();
      setSameSession(authed?true:false);
    }
    checkSession()
  }, [sameSession, loggedIn, currentSession])

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to='/dashboard' replace/>}/>
        <Route path='/dashboard' element={<Dashboard />}/>
        <Route path='/profile' element={<Profile />}/>
        <Route path='/login' element={(loggedIn || sameSession)?<Navigate to='/profile' replace />:<Login />}/>
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  )
}