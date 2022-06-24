import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '../config/auth';

import Login from './login';
import Dashboard from './dashboard';
import { useEffect, useState } from 'react';
import { Profile } from './profile';

let savedPath = '/dashboard';

export default function Router() {
  const { loggedIn, isAuthenticated } = useAuth();
  const [ sameSession, setSameSession ] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      // should set logged in to true changing auth doesn't update context state for some reason
      const authed = await isAuthenticated();
      setSameSession(authed);
    }
    checkSession()
  }, [sameSession, isAuthenticated, loggedIn])

  function ProtectedRoute() {
    const path = useLocation().pathname;
    if (path !== '/login' && path !== '/') savedPath = path
    // console.log(savedPath)
    return (loggedIn || sameSession)?<Outlet />:<Navigate to='/login' replace />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<ProtectedRoute/>}>
          <Route path='/' element={<Navigate to='/dashboard' replace/>}/>
          <Route path='/dashboard' element={<Dashboard />}/>
          <Route path='/profile' element={<Profile />}/>
        </Route>
        <Route path='/login' element={(loggedIn || sameSession)?<Navigate to={savedPath} replace />:<Login />}/>
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  )
}